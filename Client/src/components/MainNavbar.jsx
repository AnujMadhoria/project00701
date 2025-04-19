import React, { useEffect } from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mainNavbar = () => {
    const navigate = useNavigate()
    const [isSidebarOpen, setSidebarOpen] = useState(false);
      const [data, setData] = useState(null);
     
    
      useEffect(() => {
        const fetchData = async () => {
          console.log(document.cookie);
          try {
            const response = await fetch('http://localhost:3000/api/v1/user/current-user', {
              method: 'GET',
              credentials: 'include', // Important to include cookies
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const result = await response.json();
              setData(result.user|| result.data);
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) { 
            console.error('Error:', error); 
          }
        };
    
        fetchData();
      }, []);
      
  return (
    <div className="Mainnavbar w-full px-4 sm:px-8 lg:px-28 py-4 flex items-center justify-between">
    {/* Logo Section */}
    <div className="Logo flex items-center gap-4 sm:gap-8 justify-start lg:mr-auto">
      <div className="Logoimg w-16 sm:w-20 h-16 sm:h-20 bg-gray-900 rounded-2xl"></div>
    </div>
  
    {/* Container for Buttons and Profile Picture */}
    <div className="flex items-center gap-6 sm:gap-10 lg:gap-16">
      {/* Buttons Section (Only Visible on Large Devices) */}
      <div className="Btns hidden lg:flex justify-center items-center  sm:gap-6 md:gap-7">
        
        <a href='' className="Rectangle5669 font-bold  text-gray-800 rounded-full">Home</a>
        <a href='' className="Rectangle5670 font-bold  text-gray-800 rounded-full">Blog</a>
        <a href='' className="Rectangle5671 font-bold  text-gray-800 rounded-full">About</a>
        <a href='' className="Rectangle5672 font-bold  text-gray-800 rounded-full">Support</a>
      </div>
  
      {/* Profile Picture */}
      <button className="Profilepicture w-12 sm:w-16 h-12 sm:h-16  bg-gray-900 rounded-full flex justify-end items-center  overflow-hidden" onClick={()=>navigate('/user_id')}>
      {data?.image ? (
    <img
      src={data.image} // 👈 Check if your Cloudinary returns image.url
      alt="profile"
      className=" rounded-full object-cover"
    />
  ) : (
    <p className='text-white'>No Image</p>
  )}
      </button>
    </div>
  
    {/* Hamburger Menu for Small Devices */}
    <div className="lg:hidden ml-4">
      <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md">
        {/* Hamburger Icon */}
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
          <div className="w-6 h-0.5 bg-black"></div>
        </div>
      </button>
    </div>
  
    {/* Sidebar (Visible when Hamburger is Clicked) */}
    {isSidebarOpen && (
      <div className="fixed top-0 right-0 h-screen w-64 bg-white shadow-lg z-50 p-6 flex flex-col gap-4">
        <button onClick={() => setSidebarOpen(false)} className="self-end w-8 h-8 bg-gray-300 flex items-center justify-center rounded-md" >
          {/* Close Icon */}
          <div className="w-5 h-0.5 bg-black rotate-45 absolute"></div>
          <div className="w-5 h-0.5 bg-black -rotate-45 absolute"></div>
        </button>
  
        {/* Buttons in Sidebar */}
        <div className="justify-center flex flex-col gap-11 mt-6">
        <a href='' className="Rectangle5669  sm:w-20   text-gray-800 rounded-full">Home</a>
        <a href='' className="Rectangle5670  sm:w-20   text-gray-800 rounded-full">Blog</a>
        <a href='' className="Rectangle5671  sm:w-20   text-gray-800 rounded-full">About</a>
        <a href='' className="Rectangle5672  sm:w-20   text-gray-800 rounded-full">Support</a>
        </div>
      </div>
    )}
  
    {/* Sidebar Overlay (to close sidebar when clicking outside) */}
    {isSidebarOpen && (
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 bg-black opacity-50 z-40"
      ></div>
    )}
  </div>
  
  )
}

export default mainNavbar
