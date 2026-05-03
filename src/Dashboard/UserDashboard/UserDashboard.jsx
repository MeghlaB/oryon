import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ChevronDown, 
  ChevronRight,
  ShoppingCart,
  User,
  Heart,
  CreditCard,
  Bell,
  Settings,
  Star,
  History
} from 'lucide-react';
import { 
  MdOutlineDashboard 
} from 'react-icons/md';
import { 
  FaSignOutAlt 
} from 'react-icons/fa';

function UserDashboard() {
  const location = useLocation();
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen text-white bg-gray-900">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <MdOutlineDashboard className="text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold">User Portal</h1>
            <p className="text-xs text-gray-400">Welcome, John!</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {/* Dashboard Home */}
          <Link 
            to="/dashboard/user-home" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveLink('/dashboard/user-home') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          {/* My Carts */}
          <Link 
            to="/dashboard/my-carts" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveLink('/dashboard/my-carts') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
          >
            <ShoppingCart size={20} />
            <span>My Carts</span>
          </Link>

          {/* Orders Section with dropdown */}
          <div>
            <button 
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${(isActiveLink('/dashboard/orders') || isActiveLink('/dashboard/order-history')) ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span>Orders</span>
              </div>
              {isOrdersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isOrdersOpen && (
              <div className="mt-1 space-y-1 pl-9">
                <Link 
                  to="/dashboard/current-orders" 
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActiveLink('/dashboard/current-orders') ? 'text-blue-400' : 'hover:text-gray-300'}`}
                >
                  <ShoppingCart size={16} />
                  <span>Current Orders</span>
                </Link>
                <Link 
                  to="/dashboard/order-history" 
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActiveLink('/dashboard/order-history') ? 'text-blue-400' : 'hover:text-gray-300'}`}
                >
                  <History size={16} />
                  <span>Order History</span>
                </Link>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link 
            to="/dashboard/wishlist" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveLink('/dashboard/wishlist') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
          >
            <Heart size={20} />
            <span>Wishlist</span>
          </Link>

          {/* Reviews */}
          <Link 
            to="/dashboard/reviews" 
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveLink('/dashboard/reviews') ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}
          >
            <Star size={20} />
            <span>My Reviews</span>
          </Link>

          {/* Account Section with dropdown */}
          <div>
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${(isActiveLink('/dashboard/user-profile') || isActiveLink('/dashboard/settings')) ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                <User size={20} />
                <span>My Account</span>
              </div>
              {isAccountOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {isAccountOpen && (
              <div className="mt-1 space-y-1 pl-9">
                <Link 
                  to="/dashboard/user-profile" 
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActiveLink('/dashboard/user-profile') ? 'text-blue-400' : 'hover:text-gray-300'}`}
                >
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/dashboard/notifications" 
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActiveLink('/dashboard/notifications') ? 'text-blue-400' : 'hover:text-gray-300'}`}
                >
                  <Bell size={16} />
                  <span>Notifications</span>
                </Link>
                <Link 
                  to="/dashboard/settings" 
                  className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${isActiveLink('/dashboard/settings') ? 'text-blue-400' : 'hover:text-gray-300'}`}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <Link 
          to="/" 
          className="flex items-center gap-3 p-3 transition-colors rounded-lg hover:bg-gray-800"
        >
          <Home size={20} />
          <span>Go to Homepage</span>
        </Link>
        
        <button className="flex items-center w-full gap-3 p-3 text-red-400 transition-colors rounded-lg hover:bg-gray-800 hover:text-red-300">
          <FaSignOutAlt size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default UserDashboard;