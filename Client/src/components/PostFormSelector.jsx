import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PostFormSelector = ({ onPostCreated }) => {
  const [postType, setPostType] = useState("confession"); // Default selection
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [audioBlob, setAudioBlob] = useState(null); // Store recorded audio
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const navigate = useNavigate();

  // Handle post type selection
  const handlePostTypeChange = (type) => {
    setPostType(type);
    setTitle("");
    setSummary("");
    setTags("");
    setAudioBlob(null);
  };

  // Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioFile = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(audioFile);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (postType === "confession") {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("summary", summary);
        formData.append("tags", tags);
        if (audioBlob) {
          formData.append("audio", audioBlob, "recorded-audio.webm");
        }
  
        const response = await fetch(
          "http://localhost:3000/api/v1/user/new-confession",
          {
            method: "POST",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // If token is stored in localStorage
            
            },
            body: formData,
          }
        );
  
        if (response.ok) {
          onPostCreated();
          navigate("/profile/confessions"); // Redirecting to confessions page
        } else {
          console.error("Failed to create confession post");
        }
      } else if (postType === "problem") {
        const postData = { title, summary, tags };
        const response = await fetch(
          "http://localhost:3000/api/v1/user/new-problem",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          }
        );
        if (response.ok) {
          onPostCreated();
          navigate("/profile/prblms"); // Redirecting to problems page
        } else {
          console.error("Failed to create problem post");
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Post Type Selector */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          onClick={() => handlePostTypeChange("confession")}
          className={`px-4 py-2 rounded ${
            postType === "confession"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Confession Post
        </button>
        <button
          type="button"
          onClick={() => handlePostTypeChange("problem")}
          className={`px-4 py-2 rounded ${
            postType === "problem"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Problem Post
        </button>
      </div>

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Heading (Title):</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the heading"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {postType === "confession" && (
          <div>
            <label className="block font-medium mb-1">Record Audio:</label>
            <div className="flex items-center space-x-4">
              {isRecording ? (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Start Recording
                </button>
              )}
            </div>

            {audioBlob && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">Recorded Audio:</p>
                <audio controls src={URL.createObjectURL(audioBlob)}></audio>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block font-medium mb-1">Tags:</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma separated tags"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            {postType === "confession" ? "Brief (10-20 words):" : "Summary:"}
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={
              postType === "confession"
                ? "Enter a short description..."
                : "Describe your problem..."
            }
            className="w-full p-2 border rounded"
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Submit Post
        </button>
      </form>
      <button
        className="font-bold text-gray-800 mt-4"
        onClick={() => navigate("/profile/prblms")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default PostFormSelector;
