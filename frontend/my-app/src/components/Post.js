import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import BlogCard from './BlogCard'; // Import BlogCard component

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts made by the authenticated user
  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = Cookies.get('authToken'); // Get JWT token from cookies
        
        if (!token) {
          console.log('No token found!');
          return;
        }

        const response = await fetch('https://reddit-project-ifyg.onrender.com/createpost/getpost', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPosts(data.posts); // Set posts data from response
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      {/* <h2>User's Posts</h2> */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <BlogCard
            key={post._id}
            image={`https://reddit-project-ifyg.onrender.com/${post.imgUrl}`} // Image URL
            date={post.createdAt} // Post creation date
            CardTitle={post.title} // Post title
            CardDescription={post.content} // Post content
            username={post.author.username} // Post author's username
            communityName={post.community}
            postid={post._id} // Pass the community ID to BlogCard
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
