import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { Link } from "react-router-dom";
import {
  MdDelete,
  MdArrowBack,
  MdErrorOutline,
  MdRemoveShoppingCart,
  MdClearAll
} from "react-icons/md";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { RiLoader2Line } from "react-icons/ri";
import Swal from "sweetalert2";

const Mycarts = () => {
  const { user } = useContext(AuthContext);
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  // Load cart data from localStorage
  useEffect(() => {
    const loadCartData = () => {
      try {
        setIsLoading(true);
        if (user?.email) {
          const cartData = localStorage.getItem(`cart_${user.email}`);
          if (cartData) {
            setCarts(JSON.parse(cartData));
          }
        }
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadCartData();
  }, [user]);

  const deleteItem = (id) => {
    const updatedCarts = carts.filter(item => item._id !== id);
    setCarts(updatedCarts);

    // Update localStorage
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(updatedCarts));
    }

    Swal.fire({
      title: "Deleted!",
      text: "Item has been removed from your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "This item will be removed from your cart.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        // Simulate async operation
        setTimeout(() => {
          deleteItem(id);
          setDeletingId(null);
        }, 500);
      }
    });
  };

  const clearAllItems = () => {
    setCarts([]);

    // Update localStorage
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify([]));
    }

    Swal.fire({
      title: "Cart Cleared!",
      text: "All items have been removed from your cart.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleClearAll = () => {
    if (carts.length === 0) return;

    Swal.fire({
      title: "Clear Entire Cart?",
      text: `This will remove all ${carts.length} items from your cart. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear all",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setClearingAll(true);
        // Simulate async operation
        setTimeout(() => {
          clearAllItems();
          setClearingAll(false);
        }, 500);
      }
    });
  };

  // Calculate total price (price * quantity for each item)
  const totalPrice = carts.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  // Calculate total items (sum of all quantities)
  const totalItems = carts.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Calculate shipping cost (free if total price >= 20000, otherwise 150)
  const shippingCost = totalPrice >= 20000 ? 0 : 150;

  // Calculate tax (5% of total price)
  const taxAmount = totalPrice * 0.05;

  // Calculate final total (price + tax + shipping)
  const finalTotal = totalPrice + taxAmount + shippingCost;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center inset-2">
            <RiLoader2Line className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading your cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
        <div className="p-4 mb-6 bg-red-100 rounded-full shadow-md">
          <MdErrorOutline className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-red-600">
          Oops! Something went wrong.
        </h2>
        <p className="max-w-md mb-6 text-center text-gray-600">
          {error || "We couldn't load your cart. Please check your connection and try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg shadow hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center mb-4 text-indigo-600 transition-colors hover:text-indigo-800 md:mb-0"
            >
              <MdArrowBack className="mr-2" /> Back to Shopping
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-1 text-gray-500">{carts.length} item{carts.length !== 1 ? 's' : ''} in your cart</p>
          </div>

          {carts.length > 0 && (
            <div className="flex flex-col gap-4 mt-4 sm:flex-row sm:items-center md:mt-0">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">Total</p>
                <p className="text-2xl font-bold text-indigo-600">৳ {finalTotal.toLocaleString()}</p>
              </div>

              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="flex items-center justify-center px-4 py-3 text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearingAll ? (
                  <RiLoader2Line className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <MdClearAll className="w-5 h-5 mr-2" />
                )}
                Clear All
              </button>
            </div>
          )}
        </div>

        {carts.length === 0 ? (
          <div className="max-w-md p-8 mx-auto text-center bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full">
              <MdRemoveShoppingCart className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Your cart is empty</h3>
            <p className="mb-6 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <FaShoppingCart className="mr-2" /> Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {carts.map((item) => (
                <div key={item._id} className="overflow-hidden bg-white shadow-sm rounded-xl">
                  <div className="flex flex-col p-6 sm:flex-row">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-contain w-full h-48 border rounded-lg sm:w-40 sm:h-40"
                      />
                    </div>

                    <div className="flex-1 mt-4 sm:mt-0 sm:ml-6">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-lg font-medium text-gray-900 transition-colors hover:text-indigo-600 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-1 text-gray-500">৳ {item.price.toLocaleString()} each</p>

                      <div className="flex items-center mt-4">
                        <div className="flex items-center px-3 py-1 border rounded-lg">
                          <span className="text-gray-700">Qty: {item.quantity}</span>
                        </div>

                        <div className="flex items-center ml-auto">
                          <p className="mr-4 text-lg font-semibold text-gray-900">
                            ৳ {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id || clearingAll}
                            className="p-2 text-red-500 transition-colors rounded-full hover:bg-red-50 disabled:opacity-50"
                            title="Remove from cart"
                          >
                            {deletingId === item._id ? (
                              <RiLoader2Line className="w-5 h-5 animate-spin" />
                            ) : (
                              <MdDelete className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky p-6 bg-white shadow-sm rounded-xl top-24">
                <h3 className="pb-4 mb-6 text-xl font-semibold text-gray-900 border-b">Order Summary</h3>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="text-gray-900">৳ {totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="text-gray-900">৳ {taxAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span className="text-gray-900">৳ {shippingCost.toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 text-lg font-semibold border-t">
                  <span>Total</span>
                  <span className="text-indigo-600">৳ {finalTotal.toLocaleString()}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to={`/checkout/checkout-order`}
                    className="flex items-center justify-center w-full py-3 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <FaCheckCircle className="mr-2" /> Proceed to Checkout
                  </Link>

                  <Link
                    to="/"
                    className="flex items-center justify-center w-full py-2.5 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="flex items-start p-3 mt-6 text-sm text-indigo-700 rounded-lg bg-indigo-50">
                  <FaExclamationTriangle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Free delivery for orders over ৳ 20,000</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mycarts;