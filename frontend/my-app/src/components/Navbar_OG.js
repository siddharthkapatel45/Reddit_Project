import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Correct import
import Fuse from 'fuse.js'; // Import Fuse.js for fuzzy search

export default function Navbar_OG() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [query, setQuery] = useState('');
  const [communityResults, setCommunityResults] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);

  // Fetch user data including profile picture
  const fetchUserData = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      return; // No user logged in
    }

    try {
      const response = await fetch('https://reddit-project-ifyg.onrender.com/profile/getimg', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error(data.message || 'Failed to fetch user data');
        return;
      }

      const data = await response.json();
      setUserData(data); // Store user data in state
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch all communities from the backend
  const fetchCommunities = async () => {
    try {
      const response = await fetch('https://reddit-project-ifyg.onrender.com/createcomm/search'); // API endpoint for all communities
      const data = await response.json();
      setAllCommunities(data); // Store all communities for search
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  // Use Fuse.js for fuzzy search
  useEffect(() => {
    if (query) {
      const fuse = new Fuse(allCommunities, {
        keys: ['name'],
        threshold: 0.3, // Control how strict the matching is
      });
      const results = fuse.search(query);
      setCommunityResults(results.map(result => result.item));
    } else {
      setCommunityResults([]); // Clear results when the query is empty
    }
  }, [query, allCommunities]);

  useEffect(() => {
    fetchUserData();
    fetchCommunities(); // Fetch communities on component load
  }, []);

  return (
    <div>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
  <img src="/Preview.png" className=" h-10 w-18" alt="Greddit Logo " />
  {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Greddit</span> */}
</a>


          
          {/* Right-side items including buttons and Profile picture */}
          <div className="flex items-center space-x-4 md:order-2">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => navigate("/create")}
            >
              Create
            </button>
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => navigate("/create-community")}
            >
              Create Community
            </button>
            <a href="/profile">
              <img
                src={userData ? userData.imgUrl : './sidd.jpg'} // Fallback to sidd.jpg if no data
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </a>
          </div>

          {/* Search bar section */}
          <div className="relative w-96">
            <input
              type="text"
              className="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Communities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M4.5 10.5a6 6 0 1112 0 6 6 0 01-12 0z"
              />
            </svg>
            {query && (
              <div className="absolute bg-white border rounded-lg shadow-lg w-full mt-2 max-h-60 overflow-y-auto">
                {communityResults.length > 0 ? (
                  communityResults.map((community) => (
                    <div
                      key={community._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"//edit this 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/community-names', { state: { community_id: community._id } });
                      }} // Navigate to community page
                    >
                      <p className="font-semibold">{community.name}</p>
                      <p className="text-sm text-gray-500">{community.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
