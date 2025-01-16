import React, { useEffect, useState } from 'react';
import { FaUserFriends, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProfileCard = () => {
  console.log('Welcome to Profile Page');
  const [userData, setUserData] = useState(null); // Store all user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = Cookies.get('authToken');

      if (!token) {
        console.error('No token found. Redirecting to login...');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/profile', {
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
        console.log('Fetched Profile Data:', data); // Debugging
        setUserData(data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        navigate('/login'); // Redirect to login on failure
      }
    };

    fetchProfileData();
  }, [navigate]);

  // Handle cases where user data is still loading
  if (!userData) {
    return (
      <div className="text-center mt-8">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto sm:max-w-sm md:max-w-sm lg:max-w-lg xl:max-w-xl mt-8 bg-white shadow-lg rounded-lg text-gray-900 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Cover Image */}
      <div className="rounded-t-lg h-32 sm:h-24 md:h-28 lg:h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full h-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Cover"
        />
      </div>
      {/* Profile Image */}
      <div className="mx-auto w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 relative -mt-12 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center w-full h-full"
          src={userData ? userData.imgUrl : './sidd.jpg'} 

          alt={userData.name || 'User'}

        />
      </div>
      {/* User Info */}
      <div className="text-center mt-4">
        <h2 className="font-semibold text-lg sm:text-base md:text-lg">{userData.name || 'User'}</h2>
        <p className="text-gray-600 text-sm">{userData.email || 'No email provided'}</p>
      </div>
      {/* Followers and Following */}
      <ul className="py-4 text-gray-700 flex justify-around">
        <li className="flex flex-col items-center">
          <FaUserFriends className="text-blue-600 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <div className="text-sm font-medium">{userData.followers?.length || 0} Followers</div>
        </li>
        <li className="flex flex-col items-center">
          <FaUserPlus className="text-green-500 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <div className="text-sm font-medium">{userData.following?.length || 0} Following</div>
        </li>
      </ul>
      {/* Edit Profile Button */}
      <div className="p-4 border-t mt-2">
        <button
          onClick={() => navigate('/profile/edit_profile')}
          className="w-full rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-4 py-2 sm:py-1 md:py-2 text-sm sm:text-xs md:text-sm"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
