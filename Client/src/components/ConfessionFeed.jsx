import React, { useEffect, useState } from 'react';
import ConfessionPost from './ConfessionPost';

const ConfessionFeed = () => {
  const [confessions, setConfessions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user details
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Cookies:", document.cookie);
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/current-user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setCurrentUser(result.user || result.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch confession posts
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/confession/get-all-confession', {
          method: 'GET', // Changed from POST to GET
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const result = await response.json();
          setConfessions(result.data || []);
        } else {
          console.error('Failed to fetch confession posts');
        }
      } catch (error) {
        console.error('Error fetching confession posts:', error);
      }
    };
    fetchConfessions();
  }, []);

  
  // Sort confessions so the newest appear at the top (assuming each has a `createdAt` field)
  const sortedConfessions = [...confessions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  // Handle audio play event
  const handlePlay = async (confessionId) => {
    try {
      await fetch("http://localhost:3000/api/v1/confession/increment-play", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confessionId }),
      });

      // Update UI immediately after play
      setConfessions((prev) =>
        prev.map((confession) =>
          confession._id === confessionId
            ? { ...confession, plays: (confession.plays || 0) + 1 }
            : confession
        )
      );
    } catch (error) {
      console.error("Error updating play count:", error);
    }
  };


  return (
    <div className="w-full flex flex-col items-center pt-5">
      {sortedConfessions.length > 0 ? (
        sortedConfessions.map(confession => (
          <ConfessionPost key={confession._id} confession={confession} currentUser={currentUser} onPlay={handlePlay}  />
        ))
      ) : (
        <p className="text-white">No confession posts found.</p>
      )}
    </div>
  );
};

export default ConfessionFeed;
 