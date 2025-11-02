import React, { useState } from 'react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="h-16">
        <NavBar onMenuToggle={toggleMobileMenu} />
      </div>

      {/* Main layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 text-white">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={toggleMobileMenu}></div>
            <div className="relative w-64 bg-white shadow-lg">
              <Sidebar onClose={toggleMobileMenu} />
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-blue-50 p-2 md:p-6">
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
