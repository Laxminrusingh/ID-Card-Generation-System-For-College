import React, { useState } from 'react';
import backgroundImg from "../assets/background.jpeg";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    email: '',
    name: '',
    userId: '',
    rlNo: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // For now, use userId as username for backend
      const res = await fetch('https://icard-railways-ecor.onrender.com/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.userId,
          password: form.password,
          email: form.email,
          name: form.name,
          rlNo: form.rlNo
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        setMessage('Signup successful! Redirecting to admin dashboard...');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <motion.div className="flex items-center justify-center h-screen bg-gray-100 mt-12 overflow-hidden ">
      <form onSubmit={handleSubmit} className="bg-blue-100 shadow-lg rounded-xl px-6 py-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Sign Up</h2>
        <div className="flex flex-col gap-4">
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          <input name="userId" value={form.userId} onChange={handleChange} placeholder="User ID" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          <input name="rlNo" value={form.rlNo} onChange={handleChange} placeholder="RL No." className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition duration-200"
          >
            Sign Up
          </motion.button>
        </div>
        <img src={backgroundImg} alt="Background" className="mt-4 rounded-md object-cover w-full h-40" />
        {message && <div className="text-green-600 mt-4 text-center">{message}</div>}
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        <div className="mt-4 text-center">
          Already have an account? <Link to="/" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </motion.div>
  );
};

export default Signup; 