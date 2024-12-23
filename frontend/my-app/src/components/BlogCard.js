import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ image, date, CardTitle, CardDescription, username, communityName, postid }) => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [name1, setName] = useState('sidd');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [parentComment, setParentComment] = useState(null);

  // Handle joining community
  const handleJoin = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      alert('Please log in to join the community!');
      return;
    }

    try {
      const response = await fetch('https://reddit-project-ifyg.onrender.com/createcomm/joincom', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comname: communityName }),
      });

      const data = await response.json();
      if (response.ok) {
        setJoined(true);
        alert('Successfully joined the community!');
      } else {
        alert(data.message || 'Failed to join the community');
      }
    } catch (error) {
      console.error('Error joining the community:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  // Fetch community details
  const fetchCommunityDetails = async (communityName) => {
    try {
      const response = await fetch('https://reddit-project-ifyg.onrender.com/createcomm/getbyid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ community_id: communityName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch community details');
      }

      const data = await response.json();
      setName(data.name);
    } catch (error) {
      console.error('Error fetching community details:', error.message);
      alert(error.message || 'Something went wrong');
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    const token = Cookies.get('authToken'); // Retrieve token inside the function
    if (!token) {
      alert('You must be logged in to view comments.');
      return;
    }

    try {
      const response = await fetch(`https://reddit-project-ifyg.onrender.com/comment/${postid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments);
      } else {
        console.error(data.message || 'Failed to fetch comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  // Handle adding a comment
  const handleAddComment = async () => {
    const token = Cookies.get('authToken');
    if (!token) {
      alert('Please log in to comment!');
      return;
    }

    try {
      const response = await fetch('https://reddit-project-ifyg.onrender.com/comment/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          pid: postid,
          parentComment: parentComment ? parentComment._id : null, // Include parent comment if replying
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data.comment]);
        setNewComment('');
        setParentComment(null); // Reset parent comment
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
      alert('Something went wrong. Please try again later.');
    }
  };
  
  // Handle replying to a comment
  const handleReply = (comment) => {
    setParentComment(comment); // Set the parent comment when replying
    setNewComment(`@ `); // Optionally pre-fill the input with the username
  };

  useEffect(() => {
    fetchCommunityDetails(communityName);
    fetchComments();
  }, [communityName]);

  return (
    <div className="p-4 border rounded shadow-sm mb-10 w-full relative">
      <div className="mb-2">
        <a
          href="/"
          className="text-blue-600 font-semibold hover:text-blue-800 text-xs uppercase tracking-wider"
          onClick={(e) => {
            e.preventDefault();
            navigate('/community-names', { state: { community_id: communityName } });
          }}
        >
          {name1}
        </a>
        <a href="/" className="text-blue-500 hover:underline text-xs">{username}</a>
        <h3 className="font-bold text-xl mb-2">{CardTitle}</h3>
        <div className="overflow-hidden rounded mb-2">
          <img src={image} alt={CardTitle} className="w-full" />
        </div>
        <p className="text-sm text-body-color dark:text-dark-6">{CardDescription}</p>
        <p className="text-xs text-gray-500 mt-2">{new Date(date).toLocaleDateString()}</p>
      </div>

      <button
        onClick={handleJoin}
        className={`text-white ${joined ? 'bg-green-500' : 'bg-blue-700'} hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center`}
        disabled={joined}
      >
        {joined ? 'Joined' : 'Join'}
      </button>

      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Comments</h4>
        <div className="mb-4">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="border-b py-2">
                <p className="text-sm">{comment.content}</p>
                <button
                  onClick={() => handleReply(comment)} // Reply button
                  className="text-blue-600 text-xs mt-1"
                >
                  Reply
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
