
// import { useQuery } from "@tanstack/react-query";
// import React, { useContext, useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { MdOutlineShoppingCart, MdSecurity, MdLocalShipping } from "react-icons/md";
// import { FaStar, FaRegStar, FaCheck, FaShieldAlt } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { AuthContext } from "../../Provider/AuthProvider";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";

// const ProductDetails = () => {
//   const axiosPublic = useAxiosPublic();
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const {
//     isError,
//     isLoading,
//     data: product = {},
//   } = useQuery({
//     queryKey: ["products", id],
//     queryFn: async () => {
//       const res = await axiosPublic.get(`/products/${id}`);
//       return res.data[0];
//     },
//     enabled: !!id,
//   });

//   const handleBuyNow = () => {
//     if (!user) {
//       toast.warning("Please login to proceed with purchase");
//       return;
//     }
//     navigate(`/checkout/checkoders/${product?._id}`);
//   };

//   const handleCart = async () => {
//     if (!user) {
//       toast.warning("Please login to add to cart");
//       return;
//     }

//     const cartItems = {
//       productId: product._id,
//       title: product.title,
//       image: product.image,
//       price: product.price,
//       userEmail: user.email,
//       status: "pending",
//       quantity: 1,
//     };

//     try {
//       const res = await axiosPublic.post("/cart", cartItems);
//       const data = res.data;

//       if (data.acknowledged) {
//         toast.success("Product added to cart!");
//       } else if (data.message === "Product already in cart") {
//         toast.warning("This product is already in your cart.");
//       } else {
//         toast.error(data.message || "Failed to add to cart.");
//       }
//     } catch (error) {
//       toast.error("Something went wrong!");
//     }
//   };

//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   const targetDate = new Date();
//   targetDate.setDate(targetDate.getDate() + 3);

//   // Timer effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance <= 0) {
//         clearInterval(timer);
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       } else {
//         setTimeLeft({
//           days: Math.floor(distance / (1000 * 60 * 60 * 24)),
//           hours: Math.floor(
//             (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//           ),
//           minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
//           seconds: Math.floor((distance % (1000 * 60)) / 1000),
//         });
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Render star ratings
//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 1; i <= 5; i++) {
//       if (i <= fullStars) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else if (i === fullStars + 1 && hasHalfStar) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400" />);
//       }
//     }
//     return stars;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="relative w-16 h-16">
//           <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
//           <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-6 h-6 text-blue-600 animate-pulse"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M12 4v16m8-8H4m4-6h.01M16 6h.01M16 18h.01M8 18h.01"
//               />
//             </svg>
//           </div>
//         </div>
//         <p className="mt-4 font-medium text-gray-700 animate-pulse">
//           Loading product details...
//         </p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
//         <div className="p-4 bg-red-100 rounded-full shadow-md">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-12 h-12 text-red-600 animate-bounce"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 3v2m0 14v2m6-6h2m-14 0H4m12.364-7.364l1.414 1.414M6.222 17.778l1.414 1.414m0-12.728L6.222 6.222m10.142 10.142l-1.414 1.414"
//             />
//           </svg>
//         </div>
//         <h2 className="mt-4 text-xl font-bold text-red-600">
//           Oops! Something went wrong.
//         </h2>
//         <p className="max-w-sm mt-2 text-center text-gray-600">
//           We couldn't load the product details. Please try again later.
//         </p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-5 py-2 mt-6 font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-28">
//       <div className="max-w-6xl px-4 py-8 mx-auto">
//         {/* Breadcrumb Navigation */}
//         <nav className="flex mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
//           <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
//           <span className="mx-2">/</span>
//           <Link to="/products" className="transition-colors hover:text-blue-600">Products</Link>
//           <span className="mx-2">/</span>
//           <span className="text-gray-800 truncate">{product?.title}</span>
//         </nav>

//         <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
//           {/* Product Images */}
//           {/* Product Images */}
//           <div className="lg:sticky lg:top-32">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="overflow-hidden bg-white rounded-lg shadow-lg"
//             >
//               <img
//                 src={product?.image}
//                 alt={product?.title}
//                 className="object-contain w-full h-96"
//               />
//             </motion.div>

//             {/* Product badges */}
//             <div className="flex flex-wrap gap-2 mt-4">
//               {product?.status === "In Stock" ? (
//                 <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
//                   In Stock
//                 </span>
//               ) : (
//                 <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
//                   Out of Stock
//                 </span>
//               )}
//               {product?.product_code && (
//                 <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
//                   SKU: {product.product_code}
//                 </span>
//               )}
//             </div>
//           </div>


//           {/* Product Details */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="p-6 bg-white rounded-lg shadow-lg"
//           >
//             <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
//               {product?.title}
//             </h1>

//             <div className="flex items-center mt-2">
//               <div className="flex">
//                 {renderStars(product?.rating || 4.5)}
//               </div>
//               <span className="ml-2 text-sm text-gray-500">
//                 ({product?.reviews || 24} reviews)
//               </span>
//             </div>

//             <div className="mt-6 space-y-4">
//               <div className="flex items-center">
//                 <span className="text-3xl font-bold text-green-600">
//                   ৳{Number(product?.price).toLocaleString()}
//                 </span>
//                 {product?.regular_price && (
//                   <span className="ml-3 text-xl text-gray-400 line-through">
//                     ৳{Number(product?.regular_price).toLocaleString()}
//                   </span>
//                 )}
//                 {product?.regular_price && (
//                   <span className="px-2 py-1 ml-3 text-sm font-bold text-red-600 bg-red-100 rounded-md">
//                     Save ৳{Number(product?.regular_price - product?.price).toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {/* Key Features */}
//               {product?.key_features && product.key_features.length > 0 && (
//                 <div className="mt-6">
//                   <h3 className="mb-3 text-lg font-semibold text-gray-800">Key Features</h3>
//                   <ul className="space-y-2">
//                     {product.key_features.map((feature, index) => (
//                       <li key={index} className="flex items-start">
//                         <FaCheck className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-green-500" />
//                         <span className="text-gray-600">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-4 mt-8">
//                 <motion.button
//                   onClick={handleBuyNow}
//                   whileTap={{ scale: 0.95 }}
//                   disabled={product?.status !== "In Stock"}
//                   className={`px-8 py-3 font-semibold text-white rounded-lg shadow-md transition-all ${product?.status !== "In Stock"
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
//                     }`}
//                 >
//                   Buy Now
//                 </motion.button>

//                 <motion.button
//                   onClick={handleCart}
//                   whileTap={{ scale: 0.95 }}
//                   disabled={product?.status !== "In Stock"}
//                   className={`flex items-center px-6 py-3 font-semibold rounded-lg border shadow-md transition-all ${product?.status !== "In Stock"
//                     ? "text-gray-400 border-gray-300 cursor-not-allowed"
//                     : "text-blue-600 border-blue-300 hover:bg-blue-50 hover:shadow-lg"
//                     }`}
//                 >
//                   <MdOutlineShoppingCart size={20} className="mr-2" />
//                   Add to Cart
//                 </motion.button>
//               </div>

//               {/* Trust Badges */}
//               <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3">
//                 <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
//                   <MdLocalShipping className="w-6 h-6 mb-2 text-blue-600" />
//                   <span className="text-sm font-medium">Free Shipping</span>
//                 </div>
//                 <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
//                   <FaShieldAlt className="w-6 h-6 mb-2 text-blue-600" />
//                   <span className="text-sm font-medium">Warranty</span>
//                 </div>
//                 <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
//                   <MdSecurity className="w-6 h-6 mb-2 text-blue-600" />
//                   <span className="text-sm font-medium">Secure Payment</span>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Countdown Timer Section */}
//         {product?.regular_price && (
//           <motion.div
//             className="p-6 mt-12 bg-white rounded-lg shadow-lg"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5, duration: 0.5 }}
//           >
//             <div className="max-w-2xl mx-auto text-center">
//               <p className="mb-4 text-lg font-semibold text-red-500">
//                 🎯 Limited Time Offer - Ends In
//               </p>
//               <div className="flex flex-wrap justify-center gap-3">
//                 <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
//                   <span className="text-2xl font-bold">{timeLeft.days}</span>
//                   <span className="text-sm">Days</span>
//                 </div>
//                 <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
//                   <span className="text-2xl font-bold">{timeLeft.hours}</span>
//                   <span className="text-sm">Hours</span>
//                 </div>
//                 <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
//                   <span className="text-2xl font-bold">{timeLeft.minutes}</span>
//                   <span className="text-sm">Minutes</span>
//                 </div>
//                 <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
//                   <span className="text-2xl font-bold">{timeLeft.seconds}</span>
//                   <span className="text-sm">Seconds</span>
//                 </div>
//               </div>
//               <p className="mt-4 text-sm text-gray-500">
//                 This special discount won't last long. Order now to save big!
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineShoppingCart, MdSecurity, MdLocalShipping } from "react-icons/md";
import { FaStar, FaRegStar, FaCheck, FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const ProductDetails = () => {
  const axiosPublic = useAxiosPublic();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    isError,
    isLoading,
    data: product = {},
  } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products/${id}`);
      return res.data[0];
    },
    enabled: !!id,
  });

  const handleBuyNow = () => {
    if (!user) {
      toast.warning("Please login to proceed with purchase");
      return;
    }
    navigate(`/checkout/checkoders/${product?._id}`);
  };

  const handleCart = () => {
    if (!user) {
      toast.warning("Please login to add to cart");
      return;
    }

    // Generate a unique ID for the cart item
    const cartItemId = `${product._id}_${Date.now()}`;

    const cartItem = {
      _id: cartItemId,
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.price,
      userEmail: user.email,
      status: "pending",
      quantity: 1,
    };

    try {
      // Get existing cart items from localStorage
      const existingCart = localStorage.getItem(`cart_${user.email}`);
      let cartItems = existingCart ? JSON.parse(existingCart) : [];

      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(
        item => item.productId === product._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already exists
        // cartItems[existingItemIndex].quantity += 1;
        toast.warning("Product already exist into cart!");
      } else {
        // Add new item to cart
        cartItems.push(cartItem);
        toast.success("Product added to cart!");
      }

      // Save updated cart to localStorage
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));

    } catch (error) {
      toast.error("Something went wrong while adding to cart!");
      console.error("Error adding to cart:", error);
    }
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-blue-600 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4m4-6h.01M16 6h.01M16 18h.01M8 18h.01"
              />
            </svg>
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-red-600 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2m0 14v2m6-6h2m-14 0H4m12.364-7.364l1.414 1.414M6.222 17.778l1.414 1.414m0-12.728L6.222 6.222m10.142 10.142l-1.414 1.414"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Oops! Something went wrong.
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load the product details. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 mt-6 font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28">
      <div className="max-w-6xl px-4 py-8 mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="transition-colors hover:text-blue-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 truncate">{product?.title}</span>
        </nav>

        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden bg-white rounded-lg shadow-lg"
            >
              <img
                src={product?.image}
                alt={product?.title}
                className="object-contain w-full h-96"
              />
            </motion.div>

            {/* Product badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product?.status === "In Stock" ? (
                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
                  Out of Stock
                </span>
              )}
              {product?.product_code && (
                <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                  SKU: {product.product_code}
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-white rounded-lg shadow-lg"
          >
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              {product?.title}
            </h1>

            <div className="flex items-center mt-2">
              <div className="flex">
                {renderStars(product?.rating || 4.5)}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({product?.reviews || 24} reviews)
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-green-600">
                  ৳{Number(product?.price).toLocaleString()}
                </span>
                {product?.regular_price && (
                  <span className="ml-3 text-xl text-gray-400 line-through">
                    ৳{Number(product?.regular_price).toLocaleString()}
                  </span>
                )}
                {product?.regular_price && (
                  <span className="px-2 py-1 ml-3 text-sm font-bold text-red-600 bg-red-100 rounded-md">
                    Save ৳{Number(product?.regular_price - product?.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Key Features */}
              {product?.key_features && product.key_features.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">Key Features</h3>
                  <ul className="space-y-2">
                    {product.key_features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-green-500" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                <motion.button
                  onClick={handleBuyNow}
                  whileTap={{ scale: 0.95 }}
                  disabled={product?.status !== "In Stock"}
                  className={`px-8 py-3 font-semibold text-white rounded-lg shadow-md transition-all ${product?.status !== "In Stock"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                    }`}
                >
                  Buy Now
                </motion.button>

                <motion.button
                  onClick={handleCart}
                  whileTap={{ scale: 0.95 }}
                  disabled={product?.status !== "In Stock"}
                  className={`flex items-center px-6 py-3 font-semibold rounded-lg border shadow-md transition-all ${product?.status !== "In Stock"
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-300 hover:bg-blue-50 hover:shadow-lg"
                    }`}
                >
                  <MdOutlineShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3">
                <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
                  <MdLocalShipping className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
                  <FaShieldAlt className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Warranty</span>
                </div>
                <div className="flex flex-col items-center p-3 text-center rounded-lg bg-gray-50">
                  <MdSecurity className="w-6 h-6 mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Countdown Timer Section */}
        {product?.regular_price && (
          <motion.div
            className="p-6 mt-12 bg-white rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <p className="mb-4 text-lg font-semibold text-red-500">
                🎯 Limited Time Offer - Ends In
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
                  <span className="text-2xl font-bold">{timeLeft.days}</span>
                  <span className="text-sm">Days</span>
                </div>
                <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
                  <span className="text-2xl font-bold">{timeLeft.hours}</span>
                  <span className="text-sm">Hours</span>
                </div>
                <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
                  <span className="text-2xl font-bold">{timeLeft.minutes}</span>
                  <span className="text-sm">Minutes</span>
                </div>
                <div className="flex flex-col items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg min-w-[70px]">
                  <span className="text-2xl font-bold">{timeLeft.seconds}</span>
                  <span className="text-sm">Seconds</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                This special discount won't last long. Order now to save big!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
