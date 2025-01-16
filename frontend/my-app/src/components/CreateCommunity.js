import React, { useState } from 'react';
import Navbar_OG from './Navbar_OG';
// import Cookie from 'js-cookie';
import Cookies from 'js-cookie';
export default function CreateCommunity() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    topics: [],
    photo: null,
  });

  const [message, setMessage] = useState('');
  const topics = ['Sports', 'Art', 'Programming', 'Gaming', 'Travel', 'Music'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleTopicToggle = (topic) => {
    setFormData((prev) => {
      const updatedTopics = prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics: updatedTopics };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('topics', JSON.stringify(formData.topics));
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://localhost:5000/community', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('authToken')}`, // Replace with your token logic
        },
        body: form,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Community created successfully!');
      } else {
        setMessage(result.message || 'Failed to create community.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    }
  };

  return (
    <>
      <Navbar_OG />
      <div className="my-20 container mx-auto p-8 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create a Community</h1>

        {message && <p className="text-center mb-4 text-red-500">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Community Name*"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-transparent rounded-md border border-primary py-[10px] px-5 text-dark-5 outline-none transition focus:border-primary mb-6"
          />

          <textarea
            name="description"
            rows="6"
            placeholder="Description*"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-transparent rounded-md border border-stroke p-3 text-dark-6 outline-none transition focus:border-primary mb-6"
          />

          <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-700">
            Profile Image*
          </label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            className="w-full h-10 cursor-pointer rounded-md border border-stroke text-dark-6 outline-none transition mb-6"
          />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Topics of Interest</h3>
            <div className="flex flex-wrap gap-3">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-4 py-2 rounded-full border ${
                    formData.topics.includes(topic)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-md bg-gradient-to-br from-green-400 to-blue-600 text-white hover:from-green-500 hover:to-blue-700"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
