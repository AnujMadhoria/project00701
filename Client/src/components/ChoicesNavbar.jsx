import React from 'react'
import { useNavigate } from "react-router-dom";

const ChoicesNavbar = () => {
       const navigate = useNavigate()
  
  return (
    
      <div data-layer="ChoicesNavbar" className="Choicesnavbar pl-3 w-full h-16 bg-[#f4f2f8]  justify-center items-center gap-5 sm:gap-8 md:gap-12 inline-flex overflow-hidden">
        
         <button  data-layer="route4" className="Route4 font-semibold  text-gray-800 rounded-full" onClick={()=> navigate('/profile/confessions')}> Confessions & Stories </button>
         <button  data-layer="route5" className="Route5 font-semibold  text-gray-800 rounded-full" onClick={()=> navigate('/profile/prblms')}> I Have a Problem </button>
      </div>
   
  )
}

export default ChoicesNavbar
