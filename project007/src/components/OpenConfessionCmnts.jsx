import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OpenConfessionCmnts = () => {
  const [comment, setComment] = useState(""); // Store user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isWritten, setIsWritten] = useState(false); // Track if input is written
  const [comments, setComments] = useState([]); // Store fetched comments
  const navigate = useNavigate();
  const location = useLocation();
  const commentInputRef = useRef(null);
  const commentsEndRef = useRef(null);

  // Extract confession ID from the URL state
  const confessionId = location.state?.confessionId;

  useEffect(() => {
    if (!confessionId) return;

    const fetchComments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/confession/get-all-comments-on-confession",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ confessionId }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setComments(result.data || []);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [confessionId]);

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
    setIsWritten(e.target.value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim() || !confessionId) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/confession/add-comment-on-confession",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ description: comment, confessionId }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setComments((prev) => [...prev, result.data]);
        setComment("");
        setIsWritten(false);
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error while commenting:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 px-2 sm:px-4">
      <div className="w-full max-w-[90%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[50%] h-[90vh] sm:h-[85vh] bg-gray-50 rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
            <div className="text-sm sm:text-base font-semibold text-gray-700">Username</div>
          </div>
          <button
            onClick={() => navigate("/profile/confessions")}
            className="text-gray-700 hover:text-gray-900 transition text-xs sm:text-sm"
          >
            Back
          </button>
        </div>

        {/* Comments Section */}
        <div className="flex-1 px-4 py-2 bg-gray-100 overflow-y-auto">
          {comments.length > 0 ? (
            comments.map((cmnt) => (
              <div key={cmnt._id} className="p-3 bg-white rounded-lg mb-2 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    {cmnt.byUser?.image ? (
                      <img
                        src={cmnt.byUser.image}
                        alt={cmnt.byUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white text-xs rounded-full">
                        {cmnt.byUser?.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {cmnt.byUser?.username || "User"}
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{cmnt.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No comments yet.</p>
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input Section */}
        <div className="p-3 bg-white border-t flex gap-2">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write a comment..."
            value={comment}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className={`text-sm px-4 py-2 rounded-md transition ${
              isLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={!isWritten || isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenConfessionCmnts;
