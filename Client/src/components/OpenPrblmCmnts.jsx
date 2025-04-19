import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const OpenPrblmCmnts = () => {
 const [isWritten, setIsWritten] = useState(false);
   const navigate = useNavigate()
      
        const postButton = (e) => {
          setIsWritten(e.target.value.trim() !== '');
        };
      
    return (
      <div className='w-full h-screen flex items-center justify-center '>
          <div data-layer="openPostCard" className="Openpostcard w-2/3 h-5/6 bg-gray-50 rounded-2xl border border-zinc-200 flex-col justify-start items-start inline-flex overflow-hidden">
      <div data-layer="headerPost" className="Headerpost self-stretch h-20 p-4 justify-between items-center gap-96 inline-flex">
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div> 
          <button onClick={()=>navigate('/profile/prblms')} className="text-zinc-800 tracking-tighter">back to post</button>
        </div>
      </div>
      <div data-layer="commentSec" className="Commentsec self-stretch h-28 flex-col justify-start items-center flex">
        <div data-layer="likeesComments" className="Likeescomments self-stretch h-44 px-4 pt-4 pb-10 flex-col justify-start items-start gap-6 flex">
          <div data-layer="vewiCmntSec" className="Vewicmntsec h-12 flex-col justify-start items-start gap-4 flex">
            <div data-layer="Rectangle 5660" className="Rectangle5660 w-72 h-4 bg-gray-200 rounded-full" />
            <div data-layer="Rectangle 5661" className="Rectangle5661 w-96 h-4 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
      <div data-layer="Frame 1000002276" className="Frame1000002276  h-96 self-stretch grow shrink px-11 py-2.5 bg-stone-600 flex-col justify-center items-start gap-8 flex overflow-y-scroll outline-none">
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
        <div data-layer="profileTag" className="Profiletag justify-start items-center gap-5 inline-flex">
          <div data-layer="profile-picture" className="ProfilePicture w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" />
          <div data-layer="username" className="Username w-72 h-7 bg-slate-400 rounded-full" />
        </div>
      </div>
      <div data-layer="Frame 1000002277" className="Frame1000002277 self-stretch h-28 p-2.5 bg-white">
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
      </div>
    </div>
      </div>
      
    )
}

export default OpenPrblmCmnts
