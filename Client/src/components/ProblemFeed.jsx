// src/components/ProblemFeed.jsx
import React, { useEffect, useState } from 'react';
import PrblmPost from './PrblmPost';

const ProblemFeed = () => {
  const [problems, setProblems] = useState([]);
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

  // Fetch problem posts
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/problem/get-all-problem', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}) // Adjust if any data is required
        });
        if (response.ok) {
          const result = await response.json();
          setProblems(result.data || result.user || []);
        } else {
          console.error('Failed to fetch problem posts');
        }
      } catch (error) {
        console.error('Error fetching problem posts:', error);
      }
    };
    fetchProblems();
  }, []);

  // Sort problems so newest appear at the top (assumes each problem has a createdAt field)
  const sortedProblems = [...problems].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  
  return (
    <div className="w-full flex flex-col items-center pt-5">
      {sortedProblems.length > 0 ? (
        sortedProblems.map(problem => (
          <PrblmPost key={problem._id} problem={problem} currentUser={currentUser} />
        ))
      ) : (
        <p className="text-white">No problem posts found.</p>
      )}
    </div>
  );
};

export default ProblemFeed;
