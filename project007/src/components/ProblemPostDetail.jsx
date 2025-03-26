import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProblemPostDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/get-problem-details', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (response.ok) {
          const result = await response.json();
          // Assuming your controller returns the problem details in result.data or similar
          setProblem(result.data || result.user);
        } else {
          console.error('Failed to fetch problem details');
        }
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };
    fetchProblemDetails();
  }, [id]);

  return (
    <div className="max-w-xl mx-auto p-6">
      {problem ? (
        <div>
          <h2 className="text-2xl font-bold">{problem.title}</h2>
          <p className="mt-2 text-gray-700">{problem.summary}</p>
          {/* Render additional details like tags, comments, etc. */}
        </div>
      ) : (
        <p>Loading problem details...</p>
      )}
    </div>
  );
};

export default ProblemPostDetail;
