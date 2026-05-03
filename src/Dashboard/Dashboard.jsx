import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ImCross, ImMenu } from 'react-icons/im';
import UserDashboard from './UserDashboard/UserDashboard';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import SellerDashboard from './SellerDashboard/SellerDashboard';
import userAdmin from '../Hooks/userAdmin';
import userSeller from '../Hooks/userSeller';
import { FaImage } from "react-icons/fa6";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = userAdmin();
  const [isseller] = userSeller();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        {/* Outer ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>

          {/* Inner circuit icon */}
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-600 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Circuit board icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4m4-6h.01M16 6h.01M16 18h.01M8 18h.01"
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Powering up your gadgets...
        </p>
      </div>
    );
  }



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 transform bg-gray-800 text-white transition-transform duration-300 w-80 min-h-screen p-4 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute text-white bg-red-600 btn btn-sm top-2 right-4"
        >
          <ImCross />
        </button>

        {/* Sidebar Content */}
        {isAdmin ? (
          <AdminDashboard />
        ) : isseller ? (
          <SellerDashboard />
        ) : (
          <UserDashboard />
        )}

        {/* This if for testing */}
        {/* <AdminDashboard/> */}
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Drawer Toggle Button */}
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className="text-white bg-green-600 btn drawer-button"
          >
            <ImMenu />
          </button>
        </div>

        {/* Outlet for Nested Routes */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
