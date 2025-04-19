import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const ConfessionPost = ({ confession, currentUser ,onPlay  }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };
  console.log("onPlay Type:", typeof onPlay); // Debugging
  const handlePlay = () => {
    if (typeof onPlay === "function") {
      onPlay(confession._id); // Ensure it's a function before calling
    }
  };
  

  return (
    <div className="w-full pt-5 flex flex-col justify-center items-center">
      <div className="w-[400px] bg-[#F8F9FA] rounded-lg border border-[#DDDFE4] flex flex-col justify-center items-center overflow-hidden">
        
        {/* Header Section */}
        <div className="w-full h-[86px] px-4 flex justify-between items-center">
          <div className="flex items-center gap-[21px]">
            <div className="profilePic w-[50px] h-[50px] bg-[#1A1E25] rounded-full flex justify-center items-center"></div>
            <div className="UserName/Time w-[290px] h-[20px] flex gap-2 rounded-md">
              <p className="text-black font-semibold">Anonymous</p>
              {confession?.createdAt && (
                <div className="time tracking-tighter text-sm">...{timeAgo(confession.createdAt)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div className="w-full flex flex-col gap-2 p-5 bg-[#795458] justify-center items-center">
          <h5>{confession?.title}</h5>
          <div className="w-full flex flex-col gap-5 justify-center items-center">
            
            {/* Audio Player */}
            <div className="w-40 h-40 bg-slate-300 flex justify-center items-center">
              {confession?.audio ? (
                <audio controls  onPlay={handlePlay}  className="w-full">
                  <source src={confession.audio} type="audio/mpeg" />
                   {/*// Increment count on play */}
                  {/* Your browser does not support the audio tag. */}
                </audio>
              ) : (
                <p className="text-white">No audio available</p>
              )} 
            </div>

            {/* Audio Waveform / Progress Bar Placeholder */}
            <div className="w-5/6 h-10 bg-slate-300"></div>
          </div>

          {/* Caption / Summary */}
          <p
            className={`relative text-sm caption tracking-tighter ${
              isExpanded ? 'h-auto' : 'overflow-hidden h-24'
            }`}
            style={{ transition: 'height 0.3s ease' }}
          >
            {confession?.summary}
          </p>
          <button className="text-zinc-800 text-sm tracking-tighter" onClick={toggleCaption}>
            {isExpanded ? 'View Less' : 'View More'}
          </button>
        </div>

        {/* Comment Section */}
        <div className="w-full flex flex-col px-4">
          {/* Buttons Section */}
          <div className="w-full flex justify-between pt-4 pb-0">
            <button className="like w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
            <div className="flex gap-[32px]">
              <div className="mt-0 w-fit flex gap-1 pt-1 font-semibold justify-center items-baseline">
                <p>{confession.plays||0}</p> 
                <p className="font-semibold text-sm tracking-tighter">plays</p>
              </div>
            </div>
            <button className="share w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
          </div>

          {/* Comment & Solutions Section */}
          <div className="flex flex-col pt-3 pb-[10px]">
            <div className="w-full flex flex-col gap-1 justify-center items-center">
              <button
                className="text-zinc-800 text-sm tracking-tighter"
                onClick={() => navigate('/profile/confessions/comments', { state: { confessionId: confession._id } })}
              >
                Give them a solution
              </button>
              <button
                className="text-zinc-800 text-sm tracking-tighter"
                onClick={() => navigate('/profile/confessions/comments', { state: { confessionId: confession._id } })}
              >
                View all solutions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionPost;
