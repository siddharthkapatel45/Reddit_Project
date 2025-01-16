import React, { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function JobPost() {
  const [userData, setUserData] = useState(null); // Store user data
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = Cookies.get("authToken");

      if (!token) {
        console.error("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Profile Data:", data); // Debugging
        setUserData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        navigate("/login"); // Redirect to login on failure
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
    <div className="lg:flex lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1 flex items-center space-x-4">
        {/* Photo Circle */}
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={`${userData.imgUrl}`} // Use dynamic image URL from the profile data
            alt={userData.name || "Profile"} // Use dynamic name
            className="object-cover w-full h-full"
          />
        </div>

        {/* Job Title and Details */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:truncate sm:text-xl sm:tracking-tight">
            {userData.name || "User"} {/* Use dynamic name */}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            {/* Add more content or details here as needed */}
          </div>
        </div>
      </div>

      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="sm:ml-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <CheckIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
            Follow
          </button>
        </span>

        {/* Dropdown */}
        <Menu as="div" className="relative ml-3 sm:hidden">
          <MenuButton className="inline-flex items-center rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400">
            More
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 ml-1.5 size-5 text-gray-400"
            />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <a
                href="/a"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                Edit
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="/a"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
              >
                View
              </a>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}
