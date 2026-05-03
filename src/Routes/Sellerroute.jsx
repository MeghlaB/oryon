import React, { useContext } from 'react'


import { Navigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider'
import userSeller from '../Hooks/userSeller'

export default function sellerRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const [isseller, issellerLoading] = userSeller()
  const location = useLocation()

  // if (loading || issellerLoading) {
  //   return <span className="loading loading-spinner loading-lg"></span>
  // }
  
  if (loading || issellerLoading) {
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


  if (user && isseller) {
    return children
  }

  return (
    <Navigate to={'account/login'} state={{ from: location.pathname }}></Navigate>
  )
}