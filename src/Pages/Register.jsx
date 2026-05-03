import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Provider/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaGoogle, FaSpinner, FaUserPlus } from "react-icons/fa";

function Register() {
  const { createUser, updateUserprofile, GoogleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // 1. Create Firebase user
      const result = await createUser(data.email, data.password);

      // 2. Update Firebase user profile with name
      await updateUserprofile(data.name, "https://i.ibb.co.com/4pDNDk1/avatar.png");

      // 3. Save user info to database
      const userInfo = {
        name: data.name,
        email: data.email,
        photo: "https://i.ibb.co.com/4pDNDk1/avatar.png",
        role: "user",
        status: "active",
      };

      const dbRes = await axios.post("https://gadgetzone-server.onrender.com/users", userInfo);

      if (dbRes.data.insertedId || dbRes.data.acknowledged) {
        toast.success("Account created successfully!");
        reset();
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("User creation failed in database");
      }

    } catch (error) {
      const errorCode = error.code;
      let errorMessage = error.response?.data?.message || error.message || "Registration failed";
      
      if (errorCode === "auth/email-already-in-use") {
        errorMessage = "This email is already registered";
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSign = async () => {
    setGoogleLoading(true);
    try {
      const result = await GoogleLogin();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        role: "user",
        status: "active",
      };

      await axios.post("https://gadgetzone-server.onrender.com/users", userInfo);

      toast.success("Account created with Google successfully!");
      navigate("/");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google registration failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-teal-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-10 mt-12 space-y-8 bg-white border border-gray-100 shadow-xl rounded-2xl md:mt-28">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to get started
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-200 ${
                    errors.name ? "border-red-500 pr-10" : "border-gray-300"
                  }`}
                  placeholder="John Doe"
                  {...register("name", { 
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters"
                    }
                  })}
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-200 ${
                    errors.email ? "border-red-500 pr-10" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`appearance-none relative block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-all duration-200 ${
                    errors.password ? "border-red-500 pr-10" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    },
                    maxLength: {
                      value: 20,
                      message: "Password cannot exceed 20 characters"
                    },
                    pattern: {
                      value: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\W)(?!.* )/,
                      message: "Must include uppercase, lowercase, number, no special characters or spaces"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-md hover:shadow-lg ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 mr-2 -ml-1 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/account/login"
              className="font-medium text-teal-600 transition-colors hover:text-teal-500"
            >
              Sign in
            </Link>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSign}
              disabled={googleLoading}
              className={`w-full inline-flex justify-center items-center py-3 px-4 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                googleLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {googleLoading ? (
                <FaSpinner className="w-5 h-5 mr-2 -ml-1 animate-spin" />
              ) : (
                <FaGoogle className="w-5 h-5 mr-2 text-red-600" />
              )}
              {googleLoading ? "Creating account..." : "Sign up with Google"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
        toastClassName="rounded-lg shadow-md"
      />
    </div>
  );
}

export default Register;