import React from 'react'
import { useNavigate } from "react-router-dom";


const SearchButton = () => {
       const navigate = useNavigate()
  
  return (
    <div>
    <button className='w-24 h-20 fixed bottom-40 left-28 text-white rounded-2xl  bg-gray-900 ' onClick={()=>navigate('/profile/searchprofiles')} ></button>
    </div>
  )
}

export default SearchButton
