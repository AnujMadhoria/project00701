import React from 'react'
import { useNavigate,useLocation} from "react-router-dom";

const ChoicesNavbar = () => {
       const navigate = useNavigate()
       const location = useLocation(); // Get current URL path

  return (
    
    <div 
    data-layer="ChoicesNavbar" 
    className="Choicesnavbar pl-3 w-full h-16 bg-[#2C2F33] justify-center items-center gap-5 sm:gap-8 md:gap-12 inline-flex overflow-hidden 
    sticky top-0 z-50 shadow-md"
  >
  
        
  <button  
  data-layer="route4"  
  className={`Route4 font-semibold text-white rounded-none relative pb-2 transition-all duration-300 
    ${location.pathname === "/profile/confessions" ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-black after:rounded" : "hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gray-600"}`}
  onClick={() => navigate("/profile/confessions")}
> 
  Confessions & Stories  
</button>

<button  
  data-layer="route5"  
  className={`Route5 font-semibold text-white rounded-none relative pb-2 transition-all duration-300 
    ${location.pathname === "/profile/prblms" ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-black after:rounded" : "hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-gray-600"}`}
  onClick={() => navigate("/profile/prblms")}
> 
  I Have a Problem  
</button>


      </div>
   
  )
}

export default ChoicesNavbar
