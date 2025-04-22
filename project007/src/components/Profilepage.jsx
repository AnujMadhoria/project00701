import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfessionPost from "./ConfessionPost"; // Import ConfessionPost
import PrblmPost from "./PrblmPost"; // Import PrblmPost

const ProfilePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("confessions");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch User Data
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/user/current-user", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.user || result.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch User Posts (Confessions or Problems)
    const fetchUserPosts = async () => {
      const endpoint =
        activeTab === "confessions"
          ? "http://localhost:3000/api/v1/user/userconfession"
          : "http://localhost:3000/api/v1/user/userproblem";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const result = await response.json();

        if (response.ok && result.data && Array.isArray(result.data)) {
          setPosts(result.data); // Use "data" instead of "posts"
        } else {
          console.error("Unexpected API response structure", result);
          setPosts([]);
        }
        
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [activeTab]);

  return (
    <div className="w-full min-h-screen bg-[#2C2F33] text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-600">
        <button
          className="text-lg font-bold text-gray-300 hover:text-white"
          onClick={() => navigate("/profile/confessions")}
        >
          Back to Home
        </button>
        <button
          className="text-lg font-bold text-gray-300 hover:text-white"
          onClick={() => navigate("/edit_profile")}
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-4xl flex flex-col items-center py-10">
        {/* Profile Picture */}
        <div className="w-32 h-32 bg-gray-800 rounded-full overflow-hidden">
          {data?.image ? (
            <img src={data.image} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <p className="flex items-center justify-center w-full h-full text-gray-400">
              No Image
            </p>
          )}
        </div>

        {/* User Info */}
        {data && (
          <div className="mt-4 text-center">
            <h3 className="text-2xl font-semibold">{data.fullName}</h3>
            <p className="text-gray-400">@{data.username}</p>
            {data.bio && <p className="mt-2 text-gray-500">{data.bio}</p>}
          </div>
        )}
      </div>

      {/* Tabs for Confessions & Problems */}
      <div className="w-full max-w-4xl flex justify-around border-t border-b border-gray-600 py-3">
        <button
          className={`text-lg font-semibold py-2 w-1/2 ${
            activeTab === "confessions" ? "border-b-4 border-green-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("confessions")}
        >
          Confessions
        </button>
        <button
          className={`text-lg font-semibold py-2 w-1/2 ${
            activeTab === "problems" ? "border-b-4 border-green-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("problems")}
        >
          Problems
        </button>
      </div>

      {/* Posts Section */}
      <div className="w-full max-w-4xl flex flex-col gap-4 py-6 items-center">
        {posts.length > 0 ? (
          posts.map((post) =>
            activeTab === "confessions" ? (
              <ConfessionPost key={post._id} confession={post} />
            ) : (
              <PrblmPost key={post._id} problem={post} />
            )
          )
        ) : (
          <p className="text-gray-500 text-center">No posts available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
