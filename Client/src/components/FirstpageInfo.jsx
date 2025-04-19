import React from 'react'
import { useNavigate } from "react-router-dom";

const FirstpageInfo = () => {
   const navigate = useNavigate()

  return (
   
      <div data-layer="Desktop - 2" className="Desktop2 w-full text-center lg:text-start lg:px-28 py-10 bg-stone-500 lg:justify-start  self-center justify-center gap-2.5 inline-flex overflow-hidden">
  <div data-layer="info" className="Info  py-7 flex-col justify-center items-start inline-flex overflow-hidden">
    <div data-layer="text" className="Text  py-7  self-stretch  flex-col lg:justify-start  gap-3.5 flex">
      <h1 className='text-6xl font-bold font-serif'>Its all about </h1>
      <h1 className='text-8xl font-semibold font-serif tracking-tighter'>Voices</h1>
      
      <div className='w-96  font-serif tracking-tight'>
          <p> Experience a world full of voices, found the voices who needs you and make freinds, 
            connect with peoples from all over the world ! </p>
      </div>
    
    </div>
    <div className='buttons  lg:flex gap-5 '>
      <button data-layer="button" className="Button w-52 self-stretch h-14 bg-gray-900 rounded-2xl text-gray-200 font-semibold  font-sans text-2xl " onClick={()=>navigate('/api/v1/user/login')}>Start Talking </button>
      <button data-layer="button" className="Button w-52 self-stretch h-14 bg-gray-200 rounded-2xl text-gray-900 font-semibold  font-sans text-2xl" onClick={()=>navigate('/api/v1/user/register')}>Make Account</button>
      
      
    </div>
    
      
  </div>
</div>
   
  )
}

export default FirstpageInfo
