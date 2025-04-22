import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaShare } from "react-icons/fa";

// Helper function to convert seconds to MM:SS format
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const ConfessionPost = ({ confession, currentUser, onPlay }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Toggle Caption View
  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle Play/Pause and Update Time
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (typeof onPlay === "function") {
          onPlay(confession._id);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update Current Time While Playing
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <div className="w-full pb-5 flex flex-col justify-center items-center">
      <div className="w-[400px] bg-[#2C2F33] text-white rounded-lg border border-[#444A50] shadow-lg flex flex-col justify-center items-center overflow-hidden">
        
        {/* Header Section */}
        <div className="w-full h-[86px] px-4 flex justify-between items-center">
          <div className="flex items-center gap-[15px]">
            <div className="profilePic w-[50px] h-[50px] bg-[#7289DA] rounded-full flex justify-center items-center"></div>
            <div className="UserName/Time flex flex-col">
              <p className="font-semibold text-sm">anonymous</p>
              <p className="text-gray-400 text-sm"> {confession?.createdAt ? new Date(confession.createdAt).toLocaleDateString() : ""}</p>
            </div>
          </div>
        </div>

        {/* Audio Section */}
        <div className="w-full flex flex-col p-5 bg-[#3A3F44] justify-center items-center rounded-lg">
          <h5 className="text-xl font-semibold">{confession?.title}</h5>
          
          {/* Custom Audio Player */}
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            {confession?.audio ? (
              <div className="w-56 flex items-center gap-4 mt-3">
                {/* Play/Pause Button */}
                <button onClick={handlePlayPause} className="text-white text-2xl">
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Progress Bar */}
                <input
                  type="range"
                  className="w-40 accent-[#7289DA]"
                  min="0"
                  max={audioRef.current?.duration || 0}
                  value={currentTime}
                  onChange={(e) => audioRef.current.currentTime = e.target.value}
                />

                {/* Timer */}
                <p className="text-sm">{formatTime(currentTime)}</p>
              </div>
            ) : (
              <p className="text-white">No audio available</p>
            )}
            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src={confession.audio}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Caption / Summary */}
          <p className={`relative text-sm tracking-tighter mt-3 ${isExpanded ? 'h-auto' : 'overflow-hidden h-16'}`}>
            {confession?.summary}
          </p>
          <button className="text-blue-400 text-sm tracking-tighter mt-2" onClick={toggleCaption}>
            {isExpanded ? 'View Less' : 'View More'}
          </button>
        </div>

        {/* Comment Section */}
        <div className="w-full flex flex-col px-4 py-3">
          {/* Buttons Section */}
          <div className="w-full flex justify-between items-center">
            <button className="text-[#E74C3C] text-lg"><FaHeart /></button>
            <p className="text-sm font-semibold">{confession.plays || 0} Plays</p>
            <button className="text-[#3498DB] text-lg"><FaShare /></button>
          </div>

          {/* Comment & Solutions Section */}
          <div className="flex flex-col pt-3 pb-[10px]">
            <button
              className="text-blue-400 text-sm tracking-tighter"
              onClick={() => navigate('/profile/confessions/comments', { state: { confessionId: confession._id } })}
            >
              Give them a solution
            </button>
            <button
              className="text-blue-400 text-sm tracking-tighter"
              onClick={() => navigate('/profile/confessions/comments', { state: { confessionId: confession._id } })}
            >
              View all solutions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionPost;
