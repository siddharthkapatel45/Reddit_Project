import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Comment() {
  const [comments, setComments] = useState([]);
  const [voteStatus, setVoteStatus] = useState({});
  const [message, setMessage] = useState(null);
const [myimage,setimage]=useState('./sidd.jpg');
  // Fetch comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = Cookies.get('authToken'); // Assuming JWT token is stored in cookies
        const response = await axios.get('http://localhost:5000/comment/allcomment', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const response1 = await axios.get('http://localhost:5000/profile/getuname', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setimage("http://localhost:5000/" + response1.data);

        const fetchedComments = response.data;

        // Group comments by parent and initialize vote status
        const groupedComments = fetchedComments.reduce((acc, comment) => {
          if (!comment.parentComment) {
            // It's a parent comment
            acc[comment._id] = { ...comment, replies: [] };
          } else {
            // It's a reply
            if (!acc[comment.parentComment]) {
              // If parent comment is not in acc, skip it
              return acc;
            }
            acc[comment.parentComment].replies.push(comment);
          }
          return acc;
        }, {});

        setComments(Object.values(groupedComments));
        setVoteStatus(
          fetchedComments.reduce((acc, comment) => {
            acc[comment._id] = { upvoted: false, downvoted: false };
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const handleUpvote = (commentId) => {
    setVoteStatus((prevStatus) => ({
      ...prevStatus,
      [commentId]: { upvoted: true, downvoted: false },
    }));
    setMessage('Upvoting successful!');
    setTimeout(() => setMessage(null), 1500);
  };
  console.log(myimage);

  const handleDownvote = (commentId) => {
    setVoteStatus((prevStatus) => ({
      ...prevStatus,
      [commentId]: { upvoted: false, downvoted: true },
    }));
    setMessage('Downvoting successful!');
    setTimeout(() => setMessage(null), 1500);
  };
  return (
    
    <ul role="list" className="divide-y divide-gray-100">
      {comments.map((comment) => (
        
        <li key={comment._id} className="p-4">
          {/* Parent comment */}
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-3 items-center">
              <img
                alt="Author profile"
                src={comment.imgUrl || './default-profile.jpg'} // Replace with actual image URL or fallback to a default image
                className="border border-white w-5 h-5 rounded-full bg-gray-50"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900">Author: {comment.authorName || 'Unknown'}</p>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>

            {/* Upvote and Downvote */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleUpvote(comment._id)}
                disabled={voteStatus[comment._id]?.upvoted}
                className={`cursor-pointer ${
                  voteStatus[comment._id]?.upvoted ? 'text-green-300' : 'text-green-500'
                }`}
              >
                <FaThumbsUp />
              </button>
              <button
                onClick={() => handleDownvote(comment._id)}
                disabled={voteStatus[comment._id]?.downvoted}
                className={`cursor-pointer ${
                  voteStatus[comment._id]?.downvoted ? 'text-red-300' : 'text-red-500'
                }`}
              >
                <FaThumbsDown />
              </button>
            </div>
          </div>

          {/* Replies */}
          {comment.replies.length > 0 && (
            <ul className="ml-6 border-l pl-4 mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <li key={reply._id}>
                  <div className="flex gap-x-3 items-center">
                    <img
                      alt="Author profile"
                      src={{myimage} || './default-profile.jpg'}
                      className="border border-white w-5 h-5 rounded-full bg-gray-50"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-gray-900">Author: {reply.authorName || 'Unknown'}</p>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
      {/* Success message */}
      {message && (
        <div className="mt-4 text-sm text-green-600 font-semibold">
          {message}
        </div>
      )}
    </ul>
  );
}
