import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  
  // States for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Email state added
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Fetch current user details on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/current-user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const result = await response.json();
          const user = result.user || result.data;
          if (user) {
            setFullName(user.fullName || '');
            setEmail(user.email || ''); // Set email field
            setBio(user.bio || '');
            setGender(user.gender || '');
            // Assuming the image field is stored as an object with a URL property:
            if (user.image && user.image.url) {
              setPreview(user.image.url);
            }
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Handle profile picture change and preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit form: update image (if changed) and account details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let updatedUser = null;
      
      // 1. Update profile picture if a new file was selected
      if (profilePic) {
        const formData = new FormData();
        formData.append('image', profilePic);
        
        const imageResponse = await fetch('http://localhost:3000/api/v1/user/image', {
          method: 'PATCH',
          credentials: 'include',
          body: formData
        });
        
        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          updatedUser = imageResult.data || imageResult.user;
        } else {
          console.error('Failed to update profile picture');
        }
      }
      
      // 2. Update account details (fullName, email, bio, gender)
      const accountResponse = await fetch('http://localhost:3000/api/v1/user/update-account', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          bio,
          gender
        })
      });
      
      if (accountResponse.ok) {
        const accountResult = await accountResponse.json();
        updatedUser = accountResult.data || accountResult.user || updatedUser;
      } else {
        console.error('Failed to update account details');
      }
      
      console.log('Profile updated successfully:', updatedUser);
      navigate('/user_id'); // Navigate back to the profile page
      
    } catch (err) {
      console.error('Error updating profile:', err);
    }
    
    setLoading(false);
  };
  
  return (
    <div className="edit-profile-container max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Full Name:</label>
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        {/* Email */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        {/* Bio */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Bio:</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        
        {/* Gender */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Gender:</label>
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Profile Picture */}
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Profile Picture:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleProfilePicChange}
            className="block"
          />
          {preview && (
            <img 
              src={preview} 
              alt="Profile Preview" 
              className="mt-2 w-24 h-24 rounded-full object-cover"
            />
          )}
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
      <button className=' font-bold mt-12 text-gray-800 ' onClick={() => navigate('/user_id')}>back to home</button>

    </div>
  );
};

export default EditProfile;
