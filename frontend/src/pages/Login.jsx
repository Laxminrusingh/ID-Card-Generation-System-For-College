import React, { useState } from "react";
import backgroundImg from "../assets/background.jpeg";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('https://icard-railways-ecor.onrender.com/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userId, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <motion.div className="flex items-center justify-center h-screen bg-gray-100 mt-12 overflow-hidden ">
      <form className="bg-blue-100 shadow-lg rounded-xl px-6 py-6 w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Admin Login
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter User ID"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition duration-200"
          >
            Login
          </motion.button>
        </div>
        <img src={backgroundImg} alt="Background" className="mt-4 rounded-md object-cover w-full h-40" />
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        <div className="mt-4 text-center">
          New user or admin? <Link to="/signup" className="text-blue-600 hover:underline">Create an account</Link>
        </div>
      </form>
    </motion.div>
  );
};

export default Login; 