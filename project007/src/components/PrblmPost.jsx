import React, { useState } from "react";

// Helper function to convert a date to a "time ago" string
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const PrblmPost = ({ problem, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-[400px] bg-[#2C2F33] rounded-2xl shadow-lg border border-[#3A3F44] flex flex-col overflow-hidden mb-4">
      {/* Header Section */}
      <div className="w-full h-[80px] px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-[50px] h-[50px] bg-gray-700 rounded-full flex justify-center items-center">
            {/* Profile Picture Placeholder */}
          </div>
          <div className="flex flex-col">
            <p className="text-white font-semibold">Anonymous</p>
            <span className="text-gray-400 text-sm">{timeAgo(problem.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col gap-2 p-5 bg-[#3A3F44] text-white">
        <h3 className="text-lg font-bold">{problem.title}</h3>
        <p
          className={`text-sm ${
            isExpanded ? "h-auto" : "overflow-hidden h-24"
          } transition-all duration-300`}
        >
          {problem.summary}
        </p>
        <button
          className="text-blue-400 text-sm hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "View Less" : "View More"}
        </button>
      </div>

      {/* Footer Section */}
      <div className="w-full flex flex-col px-4 pb-4 bg-[#2C2F33]">
        <div className="flex justify-between pt-4">
          <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
            👍
          </button>
          <div className="flex gap-4 items-center">
            <p className="text-gray-300 text-sm">921k have concerns</p>
          </div>
          <button className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition">
            🔄
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col pt-3 pb-3 items-center">
          <button className="text-blue-400 text-sm hover:underline">
            Give them a solution
          </button>
          <button className="text-blue-400 text-sm hover:underline">
            View all solutions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrblmPost;
