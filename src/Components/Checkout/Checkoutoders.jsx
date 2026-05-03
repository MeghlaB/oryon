import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaShoppingCart, 
  FaUser, 
  FaLock 
} from "react-icons/fa";

import useAxiosPublic from "../../Hooks/UseAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";

const CheckoutOrders = () => {
  const { id } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);

  // Fetch product data
  const { isLoading, isError, data: product = {} } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/${id}`);
      return res.data[0];
    },
    enabled: !!id,
  });

  const quantity = watch("quantity", 1);
  const totalPrice = product?.price ? (Number(product.price) * Number(quantity)).toFixed(2) : 0;


  const onSubmit = async (data) => {
  setSubmitting(true);

  const orderData = {
    productId: id,
    productName: product?.name || "",
    productImage: product?.image || "",
    quantity: Number(data.quantity),
    unitPrice: Number(product?.price) || 0,
    totalPrice: Number(totalPrice),
    customerName: data.name,
    customerEmail: data.email,
    userEmail: user?.email || "",
    shippingAddress: {
      street: data.street,
      city: data.city,
      country: data.country,
    },
    phone: data.phone,
    orderDate: new Date().toISOString(),
    status: 'pending'
  };

  try {
    const response = await fetch("https://gadgetzone-server.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    // Redirect to SSLCommerz if URL exists
  if (result.url) {
      window.location.href = result.url; 
    } else {
      alert("Order placed successfully!");
    }
  } catch (error) {
    // console.error("Error submitting order:", error);
    alert("Failed to place order. Check your connection or server.");
  } finally {
    setSubmitting(false);
  }
};



  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
          <FaShoppingCart className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 font-medium text-gray-700 animate-pulse">Loading product details...</p>
    </div>
  );

  if (isLoading) return <LoadingAnimation />;
  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-red-600">Error loading product</h2>
        <p className="mb-4 text-gray-600">Could not load product details. Please try again.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 pb-12 bg-gray-50 md:mt-10 pt-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to={`/product/${id}`} className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" /> Back to Product
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Product Summary */}
          <div className="lg:w-2/5">
            <div className="sticky p-6 bg-white shadow-md rounded-xl top-32">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-800">
                <FaShoppingCart className="mr-2 text-green-600" /> Order Summary
              </h2>

              <div className="flex items-center p-4 mb-6 space-x-4 rounded-lg bg-gray-50">
                <img src={product?.image} alt={product?.name} className="object-contain w-20 h-20 rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-2">{product?.name}</h3>
                  <p className="text-lg font-bold text-green-600">৳{Number(product?.price).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-4 space-y-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">৳{Number(product?.price).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Quantity</span>
                  <input
                    {...register("quantity", { required: true, min: 1, max: 10, valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={1}
                    className="w-16 py-1 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between pt-3 text-lg font-bold border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-green-700">৳{Number(totalPrice).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center mt-6 text-sm text-gray-500">
                <FaLock className="mr-2 text-green-600" />
                <span>Your payment is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:w-3/5">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-md rounded-xl md:p-8" noValidate>
              <h2 className="flex items-center mb-6 text-xl font-semibold text-gray-800">
                <FaUser className="mr-2 text-blue-600" /> Customer Information
              </h2>

              <div className="space-y-6">
                <input {...register("name", { required: true })} placeholder="Full Name" className="w-full px-4 py-3 border rounded-md" />
                {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                <input {...register("email", { required: true })} placeholder="Email" className="w-full px-4 py-3 border rounded-md" />
                {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

                <input {...register("street", { required: true })} placeholder="Street" className="w-full px-4 py-3 border rounded-md" />
                <input {...register("city", { required: true })} placeholder="City" className="w-full px-4 py-3 border rounded-md" />
                <input {...register("country", { required: true })} placeholder="Country" className="w-full px-4 py-3 border rounded-md" />

                <input {...register("phone", { required: true })} placeholder="Phone" className="w-full px-4 py-3 border rounded-md" />
                {errors.phone && <p className="text-red-500 text-sm">Phone is required</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 mt-4 text-white rounded-md ${submitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {submitting ? "Processing..." : `Pay ৳${Number(totalPrice).toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrders;
