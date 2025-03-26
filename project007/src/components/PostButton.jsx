import React from 'react'
import { useNavigate } from "react-router-dom";

const PostButton = () => {
         const navigate = useNavigate()
    
  return (
    <div>
    <button className='w-24 h-20 fixed bottom-10 left-28 text-white rounded-2xl  bg-gray-900 ' onClick={()=>navigate('/post_selection')}></button>
  </div>
  )
}

export default PostButton
