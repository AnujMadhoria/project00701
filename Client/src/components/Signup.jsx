import React, { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState()
    const [fullname, setFullname] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [img, setImg] = useState(null);

    const navigate = useNavigate()

    const handleSubmit = (e)=>{
      console.log("1");
      
        e.preventDefault();
        axios.post('http://localhost:3000/api/v1/user/register', {username:name,fullName:fullname, email, password,coverImage:img},{withCredentials: true})
        .then(result => {
          console.log("Sign Up Successful:", result.data);
            navigate('/profile/confessions')
        })
        .catch(err => console.log(err))
    } 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
              placeholder="Enter your username"
              onChange={(e)=> setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fullname</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
              placeholder="Enter your Fullname"
              onChange={(e)=> setFullname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
              placeholder="Enter your email"
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
  <input 
    type="file" 
    name="img"    // Ensure this matches your multer field name
    accept="image/*"
    onChange={(e) => setImg(e.target.files[0])} 
    className="w-full"
  />
</div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300 outline-none"
              placeholder="Enter your password"
              onChange={(e)=> setPassword(e.target.value)} 
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a href="/api/v1/user/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
