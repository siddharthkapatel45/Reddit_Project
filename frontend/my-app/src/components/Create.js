import React, { useEffect, useState } from 'react';
import Navbar_OG from './Navbar_OG';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const response = await fetch('http://localhost:5000/createcomm/getcom');
        const data = await response.json();
        setCommunities(data.communities || []);
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    }
    fetchCommunities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !selectedCommunity || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('Community_name', selectedCommunity);
    formData.append('photo', image);
    formData.append('tags', tags); // Include tags

    try {
      const response = await fetch('http://localhost:5000/createpost', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Post created successfully!");
        navigate('/'); // Redirect to homepage or another route
      } else {
        alert("Error creating post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Error creating post");
    }
  };

  return (
    <>
      <Navbar_OG />
      <div className="my-20 container border-black m-auto p-8 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a Post</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title*"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-5 outline-none transition focus:border-primary active:border-primary mb-6"
          />

          <textarea
            rows="6"
            placeholder="Type your message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 p-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary mb-6"
          />

          <label htmlFor="community" className="block mb-2 text-sm font-medium text-gray-700">
            Add Community
          </label>
          <select
            id="community"
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="block w-full bg-transparent border border-gray-300 rounded-lg p-3 mb-6"
          >
            <option value="" disabled>Select a community</option>
            {communities.map((community, index) => (
              <option key={index} value={community}>{community}</option>
            ))}
          </select>

          <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-700">
            Add Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., react,frontend,webdev"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-5 outline-none transition mb-6"
          />

          <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-700">
            Image*
          </label>
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => setImagePreview(reader.result);
                reader.readAsDataURL(file);
              }
            }}
            className="w-full h-10 cursor-pointer rounded-md border border-stroke text-dark-6 outline-none transition mb-6"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mb-6 rounded-md max-h-60 mx-auto" />}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
