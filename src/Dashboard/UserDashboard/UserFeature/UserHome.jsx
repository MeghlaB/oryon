import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";


const UserHome = () => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [recentCart, setRecentCart] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      setError(null);

      // Using Promise.all for parallel requests
      Promise.all([
        axios.get(`https://gadgetzone-server.onrender.com/carts?email=${user.email}`),
        axios.get(`https://gadgetzone-server.onrender.com/orders?email=${user.email}`),
      ])
        .then(([cartRes, ordersRes]) => {
          // Handle potential API response variations
          const cartData = Array.isArray(cartRes.data)
            ? cartRes.data
            : cartRes.data.items || cartRes.data.cartItems || [];
          const ordersData = Array.isArray(ordersRes.data)
            ? ordersRes.data
            : ordersRes.data.orders || ordersRes.data.items || [];

          setCartCount(cartData.length);
          setRecentCart(Array.isArray(cartData) ? cartData.slice(0, 5) : []);
          setOrderCount(ordersData.length);
          setRecentOrders(
            Array.isArray(ordersData) ? ordersData.slice(0, 5) : []
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError("Failed to load data. Please try again later.");
          // Set empty arrays to prevent map errors
          setRecentCart([]);
          setRecentOrders([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Format price with commas and decimals
  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Format date for orders
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge class based on status
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 text-center bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Something went wrong
          </h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header with User Info */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.photoURL || "https://via.placeholder.com/80"}
                alt="avatar"
                className="object-cover w-16 h-16 rounded-full ring-4 ring-gray-100"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.displayName || "User"}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center p-6 bg-white shadow-sm rounded-xl">
            <div className="p-3 mr-4 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cart Items</p>
              <h3 className="text-2xl font-bold text-gray-800">{cartCount}</h3>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white shadow-sm rounded-xl">
            <div className="p-3 mr-4 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{orderCount}</h3>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white shadow-sm rounded-xl">
            <div className="p-3 mr-4 bg-purple-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white shadow-sm rounded-xl">
            <div className="p-3 mr-4 bg-yellow-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-2xl font-bold text-gray-800">0</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Cart Items */}
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Cart Items
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {recentCart && recentCart.length > 0 ? (
                recentCart.map((item) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-200 rounded-md">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-contain w-8 h-8"
                          />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.name || "Unnamed Item"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="mt-2 text-gray-500">Your cart is empty</p>
                </div>
              )}
            </div>
            {recentCart && recentCart.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button className="text-sm font-medium text-primary hover:text-primary-dark">
                  View Full Cart →
                </button>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Orders
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
  {recentCart && recentCart.length > 0 ? (
    recentCart.map((item) => {
      // Safely extract product data
      
      const product = item.product || {};
    
      const image = product.image || item.image || "";
      const category = product.category || item.category || "Unnamed Category";
      const price = product.price || item.price || 0;
      const quantity = item.quantity || 1;

      return (
        <div
          key={item._id || item.id}
          className="flex items-center justify-between px-6 py-4"
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-200 rounded-md">
              {image ? (
                <img
                  src={image}
                  alt={category}
                  className="object-contain w-8 h-8"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{category}</p>
              <p className="text-sm text-gray-500">Qty: {quantity}</p>
            </div>
          </div>
          <span className="font-semibold text-gray-800">
            {formatPrice(price)}
          </span>
        </div>
      );
    })
  ) : (
    <div className="px-6 py-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
      <p className="mt-2 text-gray-500">Your cart is empty</p>
    </div>
  )}
</div>

            {recentOrders && recentOrders.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <button className="text-sm font-medium text-primary hover:text-primary-dark">
                  View Order History →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mb-2 bg-blue-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">New Order</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mb-2 bg-green-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">My Cart</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mb-2 bg-purple-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button className="flex flex-col items-center justify-center p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mb-2 bg-yellow-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
