import React from 'react'
import { useNavigate } from "react-router-dom";

const DmButton = () => {
     const navigate = useNavigate()
  return (
    <div>
      <button className='w-24 h-20 fixed bottom-10 right-28 text-white rounded-2xl  bg-gray-900 ' onClick={()=> navigate('/profile/chats')}></button>
    </div>
  )
}

export default DmButton
