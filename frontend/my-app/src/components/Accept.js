import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";

export default function Accept() {
  const location = useLocation();
  const communityId = location.state?.community_id;

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:5000/community/getMembers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ community_id: communityId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        setMembers(data.members); // Assuming the API returns members' data
      } catch (error) {
        console.error("Error fetching members:", error.message);
        alert("Error fetching members");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchMembers();
    } else {
      alert("Community ID is missing!");
    }
  }, [communityId]);

  const handleAccept = async (username) => {
    try {
      const response = await fetch("http://localhost:5000/community/acceptMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ community_id: communityId, username }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        // You can refresh or update the list of members after accepting them.
      } else {
        alert(result.message || "Failed to accept the member");
      }
    } catch (error) {
      console.error("Error accepting member:", error.message);
      alert("Something went wrong while accepting the member");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading members...</p>;
  }

  return (
    <div className="my-36 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Community Members
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-medium">
              <th className="p-4">#</th>
              <th className="p-4">Username</th>
              <th className="p-4">Profile</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{member.username}</td>
                <td className="p-4">
                  <img
                    src={member.profilePicture || "/default-profile.png"}
                    alt={`${member.username}'s profile`}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleAccept(member.username)}
                    className="py-2 px-6 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                  >
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
