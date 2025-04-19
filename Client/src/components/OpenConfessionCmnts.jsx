import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OpenConfessionCmnts = () => {
  const [comment, setComment] = useState(""); // Store user input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [isWritten, setIsWritten] = useState(false); // Track if input is written
  const [comments, setComments] = useState([]); // Store fetched comments
  const navigate = useNavigate();
  const location = useLocation();
  const commentInputRef = useRef(null); // Ref for input focus
  const commentsEndRef = useRef(null); // Ref for auto-scrolling

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
          setComments(result.data || []);  // **Fix: Use `result.data` instead of `result.comments`**
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

  // Scroll to latest comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
    setIsWritten(e.target.value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!"); // DEBUG CHECK
  
    if (!comment.trim() || !confessionId) return;
    console.log("Comment:", comment);
    console.log("Confession ID:", confessionId);
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
          body: JSON.stringify({ description: comment, confessionId }),  // **Fix: Use `description` instead of `comment`**
        }
      );

      if (response.ok) {
        const result = await response.json();
        setComments((prev) => [...prev, result.data]); // Update UI
        setComment(""); // Clear input field
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
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="Openpostcard w-2/3 h-5/6 bg-gray-50 rounded-2xl border border-zinc-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="Headerpost flex justify-between items-center p-4 bg-gray-200">
          <div className="Profiletag flex items-center gap-5">
            <div className="ProfilePicture w-14 h-14 bg-gray-400 rounded-full"></div>
            <div className="Username w-32 h-6 bg-gray-300 rounded-full"></div>
          </div>
          <button
            onClick={() => navigate("/profile/confessions")}
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Back to post
          </button>
        </div>

        {/* Comments Display Area */}
        <div className="h-96 px-4 py-2 bg-gray-100 flex flex-col overflow-y-auto">
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
        <div className="text-sm font-semibold">
          {cmnt.byUser?.username || "User"}  {/* Ensure username displays */}
        </div>
      </div>
      <p className="text-gray-700 mt-1">{cmnt.description}</p> {/* Fix this */}
    </div>
  ))
) : (
  <p className="text-gray-500 text-center">No comments yet.</p>
)}

          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input Section */}
        <div className="p-2.5 bg-white border-t">
          <form  className="flex gap-2" onSubmit={handleSubmit}>
          <input
  type="text"  // Fix type
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
  placeholder="Write a comment..."
  name="comment"
  value={comment}
  onChange={handleInputChange}
  required
  disabled={isLoading}
/>
<button
  type="submit"  // Fix type
  className={`text-sm px-4 py-2 rounded-md transition ${
    isLoading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
  }`}
  disabled={!isWritten || isLoading}
>
  {isLoading ? "Posting..." : "Post"}
</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenConfessionCmnts;
