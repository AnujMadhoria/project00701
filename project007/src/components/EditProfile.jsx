import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  // States for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user details on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/user/current-user",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const result = await response.json();
          const user = result.user || result.data;
          if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setBio(user.bio || "");
            setGender(user.gender || "");
            if (user.image && user.image.url) {
              setPreview(user.image.url);
            }
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile picture change and preview
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
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

      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);

        const imageResponse = await fetch(
          "http://localhost:3000/api/v1/user/image",
          {
            method: "PATCH",
            credentials: "include",
            body: formData,
          }
        );

        if (imageResponse.ok) {
          const imageResult = await imageResponse.json();
          updatedUser = imageResult.data || imageResult.user;
        } else {
          console.error("Failed to update profile picture");
        }
      }

      const accountResponse = await fetch(
        "http://localhost:3000/api/v1/user/update-account",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            bio,
            gender,
          }),
        }
      );

      if (accountResponse.ok) {
        const accountResult = await accountResponse.json();
        updatedUser = accountResult.data || accountResult.user || updatedUser;
      } else {
        console.error("Failed to update account details");
      }

      console.log("Profile updated successfully:", updatedUser);
      navigate("/user_id");
    } catch (err) {
      console.error("Error updating profile:", err);
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#1A1E25] flex justify-center items-center">
      <div className="w-[90%] max-w-xl p-6 bg-[#2C2F33] rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full p-2 bg-[#3A3F44] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 bg-[#3A3F44] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-1">Bio:</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full p-2 bg-[#3A3F44] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-1">Gender:</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 bg-[#3A3F44] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="block w-full text-white"
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="mt-3 w-24 h-24 rounded-full object-cover border-2 border-gray-500 mx-auto"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button
          className="w-full mt-4 p-3 bg-gray-700 rounded-lg text-white font-bold hover:bg-gray-600 transition"
          onClick={() => navigate("/user_id")}
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
