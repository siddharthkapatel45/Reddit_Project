import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CommunityMembers() {
  const location = useLocation();
  const communityId = location.state?.community_id;

  const [members, setMembers] = useState([]);
  const [community, setCommunity] = useState({});
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState({});
  const [stats, setStats] = useState({ highestContributors: [], trendingTopics: [] });

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const communityResponse = await fetch(
          "https://reddit-project-ifyg.onrender.com/createcomm/getbyid",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ community_id: communityId }),
          }
        );

        if (!communityResponse.ok) {
          throw new Error("Failed to fetch community data");
        }

        const communityData = await communityResponse.json();
        setCommunity(communityData);

        const membersWithProfiles = await Promise.all(
          communityData.members.map(async (username) => {
            const profileResponse = await fetch(
              "https://reddit-project-ifyg.onrender.com/profile/getPersonByUsername",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
              }
            );

            if (!profileResponse.ok) {
              console.error(`Failed to fetch profile for ${username}`);
              return { username, profilePicture: "/default-profile.png" };
            }

            const profileData = await profileResponse.json();
            return {
              username: profileData.username,
              profilePicture: profileData.imgUrl
                ? `https://reddit-project-ifyg.onrender.com/${profileData.imgUrl}`
                : "/default-profile.png",
              role: profileData.role || "Member",
            };
          })
        );

        setMembers(membersWithProfiles);

        // Fetch community stats (contributors and trending topics)
        const statsResponse = await fetch("https://reddit-project-ifyg.onrender.com/createcomm/getStats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ community_id: communityId }),
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching community or members:", error.message);
        alert(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunityData();
    } else {
      alert("Community ID is missing!");
    }
  }, [communityId]);

  const handleFollow = async (username) => {
    try {
      const response = await fetch("https://reddit-project-ifyg.onrender.com/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        setFollowed((prev) => ({ ...prev, [username]: true }));
        alert(result.message);
      } else {
        alert(result.message || "Failed to follow the user");
      }
    } catch (error) {
      console.error("Error following user:", error.message);
      alert("Something went wrong while following the user");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading members...</p>;
  }

  // Data for Chart.js (Pie chart for trending topics)
  const topicData = {
    labels: stats.trendingTopics.map((topic) => topic.topic),
    datasets: [
      {
        data: stats.trendingTopics.map((topic) => topic.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  // Data for highest contributors (Bar chart)
  const contributorData = {
    labels: stats.highestContributors.map((contributor) => contributor.username),
    datasets: [
      {
        label: "Post Count",
        data: stats.highestContributors.map((contributor) => contributor.count),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="my-36 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md space-y-6">
      {/* Community Info Section */}
      <div className="flex items-center space-x-4 border-b pb-6">
        <img
          src={`https://reddit-project-ifyg.onrender.com/${community.imgUrl}`}
          alt={`${community.name} logo`}
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{community.name}</h1>
          <p className="text-gray-600 mt-2">{community.description}</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="space-y-8">
        <div className="flex justify-between">
          <div className="w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Trending Topics</h3>
            <Pie data={topicData} />
          </div>
          <div className="w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Highest Contributors</h3>
            <Pie data={contributorData} />
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Community Members
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600 font-medium">
                <th className="p-4">#</th>
                <th className="p-4">Username</th>
                <th className="p-4">Role</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Follow</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{member.username}</td>
                  <td className="p-4">{member.role}</td>
                  <td className="p-4">
                    <img
                      src={member.profilePicture}
                      alt={`${member.username}'s profile`}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleFollow(member.username)}
                      className="text-blue-600"
                    >
                      Follow
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
