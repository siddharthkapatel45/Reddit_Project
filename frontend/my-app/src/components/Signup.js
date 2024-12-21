import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function Signup() {
  // States to handle form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // States to handle error messages
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const navigate = useNavigate(); // Initialize the navigation hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const userData = { name, username, email, password };

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json(); // Expecting JSON response from the API

      if (response.status === 409) {
        // Conflict: Either email or username exists
        if (data.message.includes("email")) {
          alert(data.message);
        } else if (data.message.includes("username")) {
          alert(data.message);
        }
      } else if (response.status === 400) {
        alert(data.message);
      } else if (response.status === 201) {
        // Success: User created
        alert("Signup successful!");
        // Reset form and errors
        setName("");
        setEmail("");
        setUsername("");
        setPassword("");
        setEmailError("");
        setUsernameError("");
        // Redirect to login page
        navigate("/login");
      } else {
        // Generic error
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    emailError ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                    emailError ? "focus:ring-red-500" : "focus:ring-indigo-600"
                  } sm:text-sm/6`}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="uname"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="uname"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    usernameError ? "ring-red-500" : "ring-gray-300"
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset ${
                    usernameError
                      ? "focus:ring-red-500"
                      : "focus:ring-indigo-600"
                  } sm:text-sm/6`}
                />
                {usernameError && (
                  <p className="mt-1 text-sm text-red-600">{usernameError}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already registered?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
