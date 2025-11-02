import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      {/* Admin Login Top Left */}
      <div className="absolute top-6 left-6">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900"
          onClick={() => navigate('/admin-login')}
        >
          Admin Login
        </button>
      </div>
      {/* Main Image Centered */}
      <img
        src="/public/idcard-main.png"
        alt="ID Card Main"
        className="w-40 h-40 object-contain mb-8 drop-shadow-lg"
      />
      {/* Main Buttons */}
      <div className="flex flex-col items-center gap-6">
        <button
          className="bg-green-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-green-700 transition"
          onClick={() => navigate('/student-id-form')}
        >
          Apply ID Card for Student
        </button>
        <button
          className="bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/faculty-id-form')}
        >
          Apply ID Card for Faculty
        </button>
        <button
          className="bg-yellow-500 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-yellow-600 transition mt-4"
          onClick={() => navigate('/application-status')}
        >
          Check Status
        </button>
      </div>
    </div>
  );
};

export default HomePage;
