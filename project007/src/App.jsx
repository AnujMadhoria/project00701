import React from 'react'
import ChoicesNavbar from './components/ChoicesNavbar'
import MainNavbar from './components/MainNavbar'
import FirstpageInfo from './components/FirstpageInfo'
import Login from './components/Login'
import Signup from './components/Signup'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import OpenComments from './components/OpenComments'
import DmButton from './components/DmButton'
import Dmpopup from './components/Dmpopup'
import ConfessionPost from './components/ConfessionPost'
import OpenConfessionCmnts from './components/OpenConfessionCmnts'
import OpenPrblmCmnts from './components/OpenPrblmCmnts'
import Profilepage from './components/Profilepage'
import PostButton from './components/PostButton'
import EditProfile from './components/EditProfile' 
import PostFormSelector from './components/PostFormSelector'
import ProblemFeed from './components/ProblemFeed';

import  { useState } from 'react';
import ConfessionFeed from './components/ConfessionFeed'
import SearchButton from './components/SearchButton'
import SearchingPage from './components/SearchingPage'




const App = () => {
   // feedKey is used to force remount ProblemFeed when new post is created
   const [feedKey, setFeedKey] = useState(Date.now());

   const handlePostCreated = () => {
     // Update the feedKey so that ProblemFeed re-fetches the posts
     setFeedKey(Date.now());
   };
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <>
            <MainNavbar />
            <FirstpageInfo />
            </>
        }></Route>
   
          <Route path='/api/v1/user/register' element={<Signup />}></Route>
          <Route path='/api/v1/user/login' element={<Login />}></Route>
         

         <Route path='/user_id' element={<Profilepage />}></Route> 
         <Route path='/profile/prblms' element={
           <div className="bg-[#a1a1a1] min-h-screen">
            <MainNavbar />
            <ChoicesNavbar />
            <ProblemFeed key={feedKey} />
            <PostButton />
            <DmButton />
            <SearchButton/>
            </div>
         }></Route>

        <Route path='/profile/confessions'  element={
           <div className="bg-[#a1a1a1] min-h-screen">
           <MainNavbar />
           <ChoicesNavbar />
           <ConfessionFeed key={feedKey} />
           <PostButton />
           <DmButton />
           <SearchButton />
         </div>
        }></Route>

         <Route path='/profile/searchprofiles' element={<SearchingPage />}></Route> 
         <Route path='/profile/comments' element={<OpenComments />}></Route>
         <Route path='/profile/confessions/comments' element={<OpenConfessionCmnts />}></Route>
         <Route path='/profile/prblms/comments' element={<OpenPrblmCmnts />}></Route>
         <Route path='/profile/chats' element={<Dmpopup />}></Route>
          

        <Route path='/edit_profile' element={<EditProfile />}></Route>  
        <Route path='/post_selection' element={<PostFormSelector onPostCreated={handlePostCreated} />} />

        </Routes>   

       
      </BrowserRouter>

       
    
  )
}

export default App
 