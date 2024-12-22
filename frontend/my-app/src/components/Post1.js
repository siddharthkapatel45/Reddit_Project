import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const Post1 = () => {
  const [posts, setPosts] = useState([]); // All posts
  const [tags, setTags] = useState(''); // For storing input tags
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered posts based on tags

  // Fetch all posts initially
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/createpost/getall");
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts || data); // Make sure data is an array
          setFilteredPosts(data.posts || data); // Display all posts initially
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []); // Runs only once when the component mounts

  // Fetch filtered posts based on tags
  const handleFilter = async () => {
    try {
      const response = await fetch(`http://localhost:5000/createpost/filter?tags=${tags}`);
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data.posts)) {  // Check if posts are in the data.posts array
          setFilteredPosts(data.posts);  // Update filtered posts with data.posts
        } else {
          alert("Invalid data format returned from the server");
        }
      } else {
        alert(data.message || "Failed to fetch filtered posts.");
      }
    } catch (error) {
      console.error("Error filtering posts:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  

  return (
    <section className="border-black w-3/4 m-auto">
      <div className="container">
        {/* Tag Filter Section */}
        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-700 text-white px-4 py-2 ml-2 rounded hover:bg-blue-800"
          >
            Filter
          </button>
        </div>

        {/* Display Posts */}
        <div className="-mx-4 flex flex-wrap flex-col">
          {Array.isArray(filteredPosts) && filteredPosts.map((post) => {
            const imageUrl = `http://localhost:5000/${post.imgUrl}`;
            return (
              <div key={post._id} className="w-3/4 px-4 border-black">
                <BlogCard
                  username={post.username}
                  date={new Date(post.createdAt).toLocaleDateString()}
                  CardTitle={post.title}
                  CardDescription={post.content}
                  image={imageUrl}
                  postid={post._id}
                  communityName={post.community}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Post1;
