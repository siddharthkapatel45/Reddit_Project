import { useState, React } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Edit_Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    mature: false,
    photo: null, // For image upload
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleMatureToggle = () => {
    setFormData((prev) => ({ ...prev, mature: !prev.mature }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the form data for submission
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('desc', formData.description);
    data.append('mature', formData.mature);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      const token = Cookies.get('authToken');
      // Retrieve JWT token from localStorage or another source
      const response = await axios.post('http://localhost:5000/profile/edit', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("error");
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.log("error");

      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className="my-20 container m-auto">
      <div className="px-4 sm:px-0">
        <h3 className="font-semibold text-gray-900 text-4xl">Settings</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit your profile</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {/* Full Name */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Full Name</dt>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="David John"
              className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-4"
            />
          </div>

          {/* Email */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Email Address</dt>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="info@yourmail.com"
              className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-4"
            />
          </div>

          {/* Description */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Description</dt>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe yourself..."
              className="w-full bg-transparent rounded-md border border-gray-300 py-2 px-4"
            />
          </div>

          {/* Upload Avatar */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Your Avatar</dt>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full rounded-md border border-gray-300 p-3"
            />
          </div>

          {/* Mature Toggle */}
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-gray-900">Mark as Mature (18+)</dt>
            <button
              type="button"
              onClick={handleMatureToggle}
              className={`flex items-center justify-between w-16 h-8 rounded-full px-1 py-1 cursor-pointer transition-colors duration-300 ${
                formData.mature ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  formData.mature ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
              <span className="text-white text-xs font-semibold">{formData.mature ? 'On' : 'Off'}</span>
            </button>
          </div>
        </dl>

        {/* Submit Button */}
        <div className="w-full h-full flex items-center justify-center">
          <button
            type="submit"
            className="border rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            Submit
          </button>
        </div>

        {/* Success/Error Message */}
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
}
