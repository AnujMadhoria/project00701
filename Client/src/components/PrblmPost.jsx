// src/components/PrblmPost.jsx
import React, { useState } from 'react'

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
     
       const toggleCaption = () => {
         setIsExpanded(!isExpanded);
       };
  return (
    <div className="w-[400px] bg-[#F8F9FA] rounded-lg border border-[#DDDFE4] flex flex-col justify-center items-center overflow-hidden mb-4">
      {/* Header Section */}
      <div className="w-full h-[86px] px-4 flex justify-between items-center">
        <div className="flex items-center gap-[21px]">
          <div className="profilePic w-[50px] h-[50px] bg-[#1A1E25] rounded-full flex justify-center items-center">
            {/* Optionally, display the current user's profile picture */}
          </div>
          <div className="UserName/Time w-[290px] h-[20px] flex gap-2 rounded-md">
            <div>
              {currentUser ? (
                <div key={currentUser._id}>
                  <p className="text-black font-semibold">anonymous</p>
                </div>
              ) : (
                <p className="text-white">Loading...</p>
              )}
            </div>
            <div className="time  tracking-tighter text-sm">...{timeAgo(problem.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col gap-2 p-5 bg-[#795458] justify-center items-center">
        <h3 className="text-xl font-bold text-gray-800">{problem.title}</h3>
        <p  className={`relative text-sm caption tracking-tighter ${
               isExpanded ? 'h-auto' : 'overflow-hidden h-24'
             }`}
             style={{ transition: 'height 0.3s ease' }}
             >{problem.summary}</p>
             <button
             className="text-zinc-800  text-sm tracking-tighter "
             onClick={toggleCaption}
           >
             {isExpanded ? 'View Less' : 'View More'}
           </button>
      </div>

      {/* Footer Section */}
      <div className="w-full flex flex-col px-4 pb-4">
        <div className="w-full flex justify-between pt-4 pb-0">
          <button className="like w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
          <div className="flex gap-[32px]">
            <div className="mt-0 w-fit flex gap-1 pt-1 font-semibold justify-center items-baseline">
              <p>921k </p>
              <p className="font-semibold text-sm tracking-tighter">have concerns</p>
            </div>
          </div>
          <button className="share w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
        </div>
        <div className="flex flex-col pt-3 pb-[10px]">
          <div className="w-full flex flex-col gap-1 justify-center items-center">
            <button className="text-zinc-800 text-sm tracking-tighter">
              give them a solution
            </button>
            <button className="text-zinc-800 text-sm tracking-tighter">
              view all solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrblmPost;
