import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MyCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      const token = Cookies.get('authToken');

      if (!token) {
        console.error('No token found. Redirecting to login...');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://reddit-project-ifyg.onrender.com/createcomm/mycommunities', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setCommunities(data.communities);
      } catch (error) {
        console.error('Error fetching communities:', error.message);
      }
    };

    fetchCommunities();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Your Communities</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {communities.length === 0 ? (
          <p className="text-center text-gray-500">No communities found.</p>
        ) : (
          communities.map((community, index) => (
            <div
              key={index}
              className="w-full sm:w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex flex-col items-center p-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                  <img
                    src={`https://reddit-project-ifyg.onrender.com/${community.imgUrl || 'some-default-image.jpg'}`}
                    alt={community.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{community.name}</h2>
                <p className="text-gray-500 text-center mt-2">{community.description}</p>
                <button
  onClick={() => navigate('/accept', { state: { community_id: community._id } })}
  className="mt-4 py-2 px-6 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
>
  View Community
</button>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCommunities;
