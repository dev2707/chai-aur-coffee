import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/users/login", formData);
      setToken(response.data.token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Error: " + (error.response?.data || "Server error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Log In
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline" >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
