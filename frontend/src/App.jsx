import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import StudentIDForm from './pages/StudentIDForm';
import FacultyIdForm from './pages/FacultyIdForm';
import ApplicationStatus from './pages/ApplicationStatus';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="h-16">
        <NavBar />
      </div>

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 text-white">
          <Sidebar />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-blue-50 p-6">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/apply-ng" element={<StudentIDForm />} />
            <Route path="/apply-gaz" element={<FacultyIdForm />} />
            <Route path="/status" element={<ApplicationStatus />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
