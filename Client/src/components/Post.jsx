import React, { useState } from 'react';

const Post = () => {
  // State to toggle caption visibility
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCaption = () => {
    setIsExpanded(!isExpanded);
  };


   // Check if there's any text in the textarea and show post button
  const [isWritten, setIsWritten] = useState(false);

  const postButton = (e) => {
    setIsWritten(e.target.value.trim() !== '');
  };

  return (
  <div className='w-full pt-5 flex flex-col justify-center items-center'>

    <div className="w-[400px] bg-[#F8F9FA] rounded-lg border border-[#DDDFE4] flex flex-col justify-center items-center overflow-hidden">
      {/* Header Section */}
      <div className="w-full h-[86px] px-4 flex justify-between items-center">
        <div className="flex items-center gap-[21px]">
          <div className="profilePic w-[50px] h-[50px] bg-[#1A1E25] rounded-full flex justify-center items-center"></div>
          <div className="UserName/Time w-[290px] h-[20px] flex gap-2 rounded-md">
            <div className='username font-semibold'>username</div>
            <div className='time'>...3h</div>
          </div>
        </div>
      </div>

      {/* Audio Note Section */}
      <div className="w-full h-[80px] bg-[#795458] flex justify-center items-center"></div>

      {/* Comment Section */}
      <div className="w-full flex flex-col px-4">
        {/* Buttons Section */}
        <div className="w-full flex justify-between pt-4 pb-0">
          <div className="flex gap-[32px]">
            <button className="w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
            <button className="w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
            <button className="w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
          </div>
          <button className="w-[35px] h-[35px] bg-[#E6EAED] rounded-full"></button>
        </div>
        <div className="mt-0 pt-2 pb-[1px] font-semibold">921k likes</div>

        {/* Caption and Comment Section */}
        <div className="flex flex-col  pb-[10px]">
          <div className="captionSection">
            <p
              className={`relative text-sm caption tracking-tighter ${
                isExpanded ? 'h-auto' : 'overflow-hidden h-10'
              }`}
              style={{ transition: 'height 0.3s ease' }}
            >
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi harum vel non, ea dicta veritatis saepe
              incidunt recusandae earum quibusdam autem tempora quae magnam cumque rerum debitis fugiat nostrum.
              Corrupti praesentium optio temporibus earum. Quo consectetur fugiat rem quam vitae alias sit voluptatum
              minima optio magni?
            </p>
            <button
              className="text-zinc-800  text-sm tracking-tighter "
              onClick={toggleCaption}
            >
              {isExpanded ? 'View Less' : 'View More'}
            </button>
          </div>
          
          <div className="w-full">
            <form className='flex justify-between content-center' action="">
            <textarea className="w-full outline-none justify-between content-center resize-none bg-transparent" placeholder="add comment..." name="comment" id="" onChange={postButton}></textarea>
              {isWritten && (
                  <input
                    className="text-sm px-2 text-blue-500" 
                    type="submit"
                    value="Post"
                  />
               )}
            </form>
          </div>
          <a  className="text-zinc-800 text-sm tracking-tighter " href="/profile/comments">view all comments</a>
        </div>
      </div>
    </div>
  </div>
  );
  
};

export default Post;
