import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Profilepage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
   
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
    <div data-layer="first route pg" className="FirstRoutePg w-full bg-gray-100 flex-col justify-start items-start inline-flex overflow-hidden">
       <div className="Mainnavbar w-full px-4 sm:px-8 lg:px-28 py-4 flex items-center justify-between">
    {/* Logo Section */}
   <div>
   <button className=' font-bold  text-gray-800 ' onClick={() => navigate('/profile/confessions')}>back to home</button>

   </div>
  
    {/* Container for Buttons and Profile Picture */}
    <div className="flex items-center gap-6 sm:gap-10 lg:gap-16">
      {/* Buttons Section (Only Visible on Large Devices) */}
      <div className="Btns hidden lg:flex justify-center items-center  sm:gap-6 md:gap-7">
      <button className=' font-bold  text-gray-800 ' onClick={() => navigate('/edit_profile')}>edit the profile</button>
       
      </div>
  
      {/* Profile Picture */}
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
       
        <button className=' font-bold  text-gray-800 ' onClick={() => navigate('/edit_profile')}>edit the profile</button>
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
      <div data-layer="Desktop - 2" className="Desktop2 self-stretch h-96 px-44 py-9 bg-stone-500 flex-col justify-center items-center gap-7 flex overflow-hidden">
        <div className="PlaceholderProfilePicture  w-32 h-32 bg-gray-900 rounded-full justify-center items-center gap-2 inline-flex overflow-hidden" >
  {data?.image ? (
    <img
      src={data.image} // 👈 Check if your Cloudinary returns image.url
      alt="profile"
      className="w-32 h-32 rounded-full object-cover"
    />
  ) : (
    <p className='text-white'>No Image</p>
  )}
</div>
{data ? (
  <div key={data._id} className='text-center'>
    <h3>{data.fullName}</h3>
    <p>{data.username}</p>
    {/* Display the bio here */}
    {data.bio && <p className="bio text-gray-700">{data.bio}</p>}
  </div>
) : (
  <p>Loading...</p>
)}
      </div>
      <div data-layer="photosSec" className="Photossec self-stretch h-96 flex-col justify-center items-center gap-2.5 flex overflow-hidden">
        <div data-layer="photos" className="Photos p-2.5" />
      </div>
      <div data-layer="postUserNav" className="Postusernav self-stretch px-16 py-8 bg-gray-50 justify-center items-center gap-80 inline-flex overflow-hidden">
        <div data-layer="Frame 1000002105" className="Frame1000002105 h-3.5 justify-center items-center gap-16 flex">
          <div data-layer="Rectangle 5669" className="Rectangle5669 w-20 h-3.5 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5670" className="Rectangle5670 w-20 h-3.5 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5671" className="Rectangle5671 w-20 h-3.5 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5672" className="Rectangle5672 w-20 h-3.5 bg-gray-400 rounded-full" />
        </div>
      </div>
      <div data-layer="PostSec" className="Postsec self-stretch h-96 flex-col justify-center items-center gap-2.5 flex overflow-hidden">
        <div data-layer="posts" className="Posts p-2.5" />
      </div>
    </div>
  );
};

export default Profilepage;