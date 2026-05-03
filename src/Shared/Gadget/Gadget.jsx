// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import { Link } from "react-router-dom";
// import { 
//   FaFilter, 
//   FaMoneyBillWave, 
//   FaSearchDollar, 
//   FaShoppingCart, 
//   FaEye,
//   FaStar,
//   FaRegStar,
//   FaHeart,
//   FaShippingFast,
//   FaTimes,
//   FaChevronDown,
//   FaChevronUp,
//   FaMobile,
//   FaLaptop,
//   FaTabletAlt,
//   FaCamera,
//   FaHeadphones,
//   FaMicrochip
// } from "react-icons/fa";

// function Gadgets() {
//   const axiosPublic = useAxiosPublic();

//   const {
//     isLoading,
//     isError,
//     data: products = [],
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await axiosPublic.get("/products");
//       return res.data;
//     },
//   });

//   // Price range state
//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 500000,
//   });

//   // Sort option state
//   const [sortOption, setSortOption] = useState("featured");

//   // Mobile filter visibility
//   const [showFilters, setShowFilters] = useState(false);

//   // Filter only gadget products
//   const gadgetProducts = products.filter((product) => 
//     product.category === "Gadgets" || 
//     product.category === "Electronics" ||
//     product.subcategory === "Gadgets" ||
//     product.title.toLowerCase().includes("smart") ||
//     product.key_features?.some(feature => 
//       typeof feature === 'string' && (
//         feature.toLowerCase().includes("smart") ||
//         feature.toLowerCase().includes("wireless") ||
//         feature.toLowerCase().includes("bluetooth") ||
//         feature.toLowerCase().includes("portable")
//       )
//     )
//   );

//   // Handle price inputs
//   const handlePriceChange = (e, type) => {
//     const value = Number(e.target.value);
//     setPriceRange((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   // Handle sort option change
//   const handleSortChange = (option) => {
//     setSortOption(option);
//   };

//   // Filtered and sorted gadget products
//   const filteredData = gadgetProducts
//     .filter((item) => {
//       const priceNumber = Number(item.price.toString().replace(/,/g, ""));
//       return priceNumber >= priceRange.min && priceNumber <= priceRange.max;
//     })
//     .sort((a, b) => {
//       const priceA = Number(a.price.toString().replace(/,/g, ""));
//       const priceB = Number(b.price.toString().replace(/,/g, ""));

//       switch (sortOption) {
//         case "price-low":
//           return priceA - priceB;
//         case "price-high":
//           return priceB - priceA;
//         case "discount":
//           const discountA = a.discount ? parseInt(a.discount) : 0;
//           const discountB = b.discount ? parseInt(b.discount) : 0;
//           return discountB - discountA;
//         default:
//           return 0;
//       }
//     });

//   // Extract key features for display
//   const extractKeyFeatures = (keyFeatures) => {
//     if (!keyFeatures || !Array.isArray(keyFeatures)) return [];

//     return keyFeatures.slice(0, 3); // Show only first 3 features
//   };

//   // Calculate discount percentage if not provided
//   const calculateDiscount = (product) => {
//     if (product.discount) return product.discount;

//     if (product.previous_price && product.price) {
//       const currentPrice = Number(product.price.toString().replace(/,/g, ""));
//       const previousPrice = Number(product.previous_price.toString().replace(/,/g, ""));

//       if (previousPrice > currentPrice) {
//         const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
//         return `${discount}% OFF`;
//       }
//     }

//     return null;
//   };

//   // Get appropriate icon based on product type
//   const getProductIcon = (product) => {
//     if (product.title.toLowerCase().includes("phone") || product.title.toLowerCase().includes("mobile")) 
//       return <FaMobile className="text-blue-500" />;
//     if (product.title.toLowerCase().includes("laptop") || product.title.toLowerCase().includes("notebook")) 
//       return <FaLaptop className="text-purple-500" />;
//     if (product.title.toLowerCase().includes("tablet") || product.title.toLowerCase().includes("ipad")) 
//       return <FaTabletAlt className="text-green-500" />;
//     if (product.title.toLowerCase().includes("camera")) 
//       return <FaCamera className="text-red-500" />;
//     if (product.title.toLowerCase().includes("headset") || product.title.toLowerCase().includes("headphone")) 
//       return <FaHeadphones className="text-yellow-500" />;
//     if (product.title.toLowerCase().includes("processor") || product.title.toLowerCase().includes("chip")) 
//       return <FaMicrochip className="text-teal-500" />;

//     return <FaMobile className="text-gray-500" />;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//         <div className="relative w-16 h-16">
//           <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
//           <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
//             <FaMobile className="w-6 h-6 text-teal-600 animate-pulse" />
//           </div>
//         </div>
//         <p className="mt-4 font-medium text-gray-700 animate-pulse">
//           Loading cool gadgets...
//         </p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//         <div className="p-4 bg-red-100 rounded-full shadow-md">
//           <FaMobile className="w-12 h-12 text-red-600 animate-bounce" />
//         </div>
//         <h2 className="mt-4 text-xl font-bold text-red-600">
//           Connection Error
//         </h2>
//         <p className="max-w-sm mt-2 text-center text-gray-600">
//           We couldn't load your gadget products right now.
//           Please check your connection or try again.
//         </p>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-5 py-2 mt-6 font-medium text-white transition-colors bg-red-600 rounded-lg shadow hover:bg-red-700"
//         >
//           Retry Connection
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gray-50 mt-28">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-10 text-center">
//           <h1 className="mb-3 text-4xl font-bold text-gray-900">Smart Gadgets</h1>
//           <p className="max-w-2xl mx-auto text-gray-600">
//             Discover the latest innovative gadgets to enhance your digital lifestyle
//           </p>
//         </div>

//         {/* Mobile Filter Toggle */}
//         <div className="flex items-center justify-between mb-6 lg:hidden">
//           <h2 className="text-xl font-semibold text-gray-800">Gadgets</h2>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg"
//           >
//             <FaFilter className="mr-2" />
//             {showFilters ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row">
//           {/* Left Sidebar - Sorting & Filters */}
//           <div className={`lg:w-1/4 lg:pr-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
//             <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
//               <div className="flex items-center justify-between mb-5">
//                 <h2 className="text-lg font-semibold text-gray-800">Sort & Filter</h2>
//                 <button 
//                   onClick={() => setShowFilters(false)} 
//                   className="p-1 text-gray-500 lg:hidden hover:text-gray-700"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               {/* Sort Options */}
//               <div className="mb-6">
//                 <h3 className="mb-3 font-medium text-gray-700">Sort By</h3>
//                 <div className="space-y-2">
//                   {[
//                     { value: "featured", label: "Featured" },
//                     { value: "price-low", label: "Price: Low to High" },
//                     { value: "price-high", label: "Price: High to Low" },
//                     { value: "discount", label: "Best Discount" }
//                   ].map((option) => (
//                     <div key={option.value} className="flex items-center">
//                       <input
//                         type="radio"
//                         id={`sort-${option.value}`}
//                         name="sortOption"
//                         checked={sortOption === option.value}
//                         onChange={() => handleSortChange(option.value)}
//                         className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
//                       />
//                       <label htmlFor={`sort-${option.value}`} className="ml-2 text-sm text-gray-700">
//                         {option.label}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range Filter */}
//               <div className="mb-6">
//                 <h3 className="mb-3 font-medium text-gray-700">Price Range</h3>
//                 <div className="space-y-3">
//                   <div className="flex flex-col">
//                     <label className="mb-1 text-sm text-gray-600">Min Price (৳)</label>
//                     <input
//                       type="number"
//                       value={priceRange.min}
//                       onChange={(e) => handlePriceChange(e, "min")}
//                       className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
//                       min={0}
//                       max={priceRange.max}
//                     />
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="mb-1 text-sm text-gray-600">Max Price (৳)</label>
//                     <input
//                       type="number"
//                       value={priceRange.max}
//                       onChange={(e) => handlePriceChange(e, "max")}
//                       className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
//                       min={priceRange.min}
//                       max={500000}
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-3">
//                   <input
//                     type="range"
//                     min="0"
//                     max="500000"
//                     value={priceRange.max}
//                     onChange={(e) => setPriceRange(prev => ({
//                       ...prev,
//                       max: Number(e.target.value)
//                     }))}
//                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-teal-600"
//                   />
//                   <div className="flex justify-between mt-1 text-xs text-gray-500">
//                     <span>0৳</span>
//                     <span>{priceRange.max.toLocaleString()}৳</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Results Count */}
//               <div className="p-3 text-sm text-center rounded-lg bg-gray-50">
//                 <span className="font-medium text-gray-700">
//                   {filteredData.length} of {gadgetProducts.length} products
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid */}
//           <div className="lg:w-3/4">
//             {/* Mobile Sort Options */}
//             <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
//               <h3 className="mb-2 text-sm font-medium text-gray-700">Sort By</h3>
//               <select
//                 value={sortOption}
//                 onChange={(e) => handleSortChange(e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
//               >
//                 <option value="featured">Featured</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="discount">Best Discount</option>
//               </select>
//             </div>

//             {/* Products Grid */}
//             {filteredData.length === 0 ? (
//               <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
//                 <FaMobile className="w-20 h-20 mx-auto mb-4 text-gray-300" />
//                 <h3 className="mt-4 text-xl font-medium text-gray-900">No gadgets found</h3>
//                 <p className="mt-2 mb-6 text-gray-500">
//                   Try adjusting your price range to see more products.
//                 </p>
//                 <button 
//                   onClick={() => setPriceRange({ min: 0, max: 500000 })}
//                   className="px-6 py-2 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredData.map((item) => {
//                   const discount = calculateDiscount(item);
//                   const keyFeatures = extractKeyFeatures(item.key_features);

//                   return (
//                     <div
//                       key={item._id}
//                       className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-xl hover:-translate-y-1"
//                     >
//                       {/* Product Image Container */}
//                       <div className="relative overflow-hidden bg-gray-50">
//                         <div className="flex items-center justify-center h-48">
//                           {/* Responsive Image with fallback */}
//                           <img
//                             src={item.image || "https://via.placeholder.com/300x300?text=Gadget"}
//                             alt={item.title}
//                             className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
//                             onError={(e) => {
//                               e.target.src = "https://via.placeholder.com/300x300?text=Gadget";
//                             }}
//                           />
//                         </div>

//                         {/* Discount Badge */}
//                         {discount && (
//                           <div className="absolute top-3 left-3">
//                             <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-sm">
//                               {discount}
//                             </span>
//                           </div>
//                         )}

//                         {/* Category Badge */}
//                         <div className="absolute top-3 right-3">
//                           <span className="px-2 py-1 text-xs font-medium text-white bg-teal-600 rounded-md shadow-sm">
//                             {item.category || "Gadget"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Product Info */}
//                       <div className="p-5">
//                         {/* Title */}
//                         <Link to={`/product/${item._id}`} className="block mb-3 group">
//                           <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-teal-600">
//                             {item.title}
//                           </h3>
//                         </Link>

//                         {/* Key Features */}
//                         <div className="mb-4">
//                           <ul className="space-y-2 text-sm text-gray-700">
//                             {item.key_features && item.key_features.slice(0, 3).map((feature, index) => (
//                               <li key={index} className="flex items-center">
//                                 <FaMobile className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
//                                 <span className="truncate">{feature}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>

//                         {/* Price Section */}
//                         <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                           <div className="flex flex-col">
//                             <span className="text-lg font-bold text-gray-900">
//                               ৳{Number(item.price).toLocaleString()}
//                             </span>
//                             {item.previous_price && (
//                               <span className="text-sm text-gray-500 line-through">
//                                 ৳{Number(item.previous_price).toLocaleString()}
//                               </span>
//                             )}
//                           </div>

//                           <Link
//                             to={`/product/${item._id}`}
//                             className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-teal-600 rounded-lg hover:bg-teal-700 hover:shadow-md"
//                           >
//                             <FaEye className="w-3.5 h-3.5 mr-1.5" />
//                             Details
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Gadgets;
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaEye,
  FaTimes,
  FaMobile,
  FaHeadphones,

  FaMicrochip,
  FaBatteryFull,
  FaBluetooth,
  FaWifi
} from "react-icons/fa";
import { FaWatchmanMonitoring } from "react-icons/fa6";

function Gadgets() {
  const axiosPublic = useAxiosPublic();

  const {
    isLoading,
    isError,
    data: products = [],
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  // Price range state
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100000,
  });

  // Sort option state
  const [sortOption, setSortOption] = useState("featured");

  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Brand filter state
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Category filter state
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Connectivity filter state
  const [selectedConnectivity, setSelectedConnectivity] = useState([]);

  // Filter only gadget category products
  const gadgetProducts = useMemo(() =>
    products.filter((product) => product.category === "Gadget"),
    [products]
  );

  // Get unique brands for filtering
  const brands = useMemo(() => {
    const brandSet = new Set();

    gadgetProducts.forEach(product => {
      const title = product.title.toLowerCase();
      if (title.includes("samsung")) brandSet.add("Samsung");
      else if (title.includes("apple")) brandSet.add("Apple");
      else if (title.includes("xiaomi") || title.includes("mi")) brandSet.add("Xiaomi");
      else if (title.includes("sony")) brandSet.add("Sony");
      else if (title.includes("huawei")) brandSet.add("Huawei");
      else if (title.includes("oneplus")) brandSet.add("OnePlus");
      else if (title.includes("google")) brandSet.add("Google");
      else if (title.includes("oppo")) brandSet.add("Oppo");
      else if (title.includes("vivo")) brandSet.add("Vivo");
      else if (title.includes("realme")) brandSet.add("Realme");
      else if (product.brand) brandSet.add(product.brand);
    });

    return Array.from(brandSet).sort();
  }, [gadgetProducts]);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const categorySet = new Set();

    gadgetProducts.forEach(product => {
      const title = product.title.toLowerCase();
      if (title.includes("smartwatch") || title.includes("watch")) categorySet.add("Smartwatch");
      else if (title.includes("headphone") || title.includes("earphone")) categorySet.add("Headphones");
      else if (title.includes("tracker") || title.includes("fitness")) categorySet.add("Fitness Tracker");
      else if (title.includes("speaker")) categorySet.add("Speaker");
      else if (title.includes("drone")) categorySet.add("Drone");
      else if (title.includes("vr") || title.includes("virtual")) categorySet.add("VR Headset");
      else if (title.includes("smart home") || title.includes("hub")) categorySet.add("Smart Home");
      else categorySet.add("Gadget");
    });

    return Array.from(categorySet).sort();
  }, [gadgetProducts]);

  // Handle price inputs
  const handlePriceChange = (e, type) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle brand filter
  const handleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle connectivity filter
  const handleConnectivityFilter = (connectivity) => {
    if (selectedConnectivity.includes(connectivity)) {
      setSelectedConnectivity(selectedConnectivity.filter(c => c !== connectivity));
    } else {
      setSelectedConnectivity([...selectedConnectivity, connectivity]);
    }
  };

  // Extract gadget specs from product features
  const getGadgetSpecs = (product) => {
    let type = "";
    let connectivity = "";
    let battery = "";
    let features = "";

    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes("bluetooth") ||
          lowerFeature.includes("wifi") ||
          lowerFeature.includes("wireless") ||
          lowerFeature.includes("nfc")) && !connectivity) {
          connectivity = feature;
        } else if ((lowerFeature.includes("battery") ||
          lowerFeature.includes("mah") ||
          lowerFeature.includes("hour")) && !battery) {
          battery = feature;
        } else if ((lowerFeature.includes("water") ||
          lowerFeature.includes("resistant") ||
          lowerFeature.includes("heart") ||
          lowerFeature.includes("gps")) && !features) {
          features = feature;
        }
      });
    }

    // Determine type based on title
    const title = product.title.toLowerCase();
    if (title.includes("smartwatch") || title.includes("watch")) type = "Smartwatch";
    else if (title.includes("headphone") || title.includes("earphone")) type = "Headphones";
    else if (title.includes("tracker") || title.includes("fitness")) type = "Fitness Tracker";
    else if (title.includes("speaker")) type = "Speaker";
    else if (title.includes("drone")) type = "Drone";
    else if (title.includes("vr") || title.includes("virtual")) type = "VR Headset";
    else if (title.includes("smart home") || title.includes("hub")) type = "Smart Home";
    else type = "Gadget";

    return { type, connectivity, battery, features };
  };

  // Filtered and sorted gadget products
  const filteredData = useMemo(() => {
    return gadgetProducts
      .filter((item) => {
        const priceNumber = Number(item.price.toString().replace(/,/g, ""));
        const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;

        // Brand filter
        const title = item.title.toLowerCase();
        let brandMatch = true;
        if (selectedBrands.length > 0) {
          brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
        }

        // Category filter
        let categoryMatch = true;
        if (selectedCategories.length > 0) {
          const specs = getGadgetSpecs(item);
          categoryMatch = selectedCategories.some(category => specs.type.includes(category));
        }

        // Connectivity filter
        let connectivityMatch = true;
        if (selectedConnectivity.length > 0) {
          const specs = getGadgetSpecs(item);
          connectivityMatch = selectedConnectivity.some(conn =>
            specs.connectivity && specs.connectivity.toLowerCase().includes(conn.toLowerCase())
          );
        }

        return priceInRange && brandMatch && categoryMatch && connectivityMatch;
      })
      .sort((a, b) => {
        const priceA = Number(a.price.toString().replace(/,/g, ""));
        const priceB = Number(b.price.toString().replace(/,/g, ""));

        switch (sortOption) {
          case "price-low":
            return priceA - priceB;
          case "price-high":
            return priceB - priceA;
          case "discount":
            const discountA = a.discount ? parseInt(a.discount) : 0;
            const discountB = b.discount ? parseInt(b.discount) : 0;
            return discountB - discountA;
          default:
            return 0;
        }
      });
  }, [gadgetProducts, priceRange, selectedBrands, selectedCategories, selectedConnectivity, sortOption]);

  // Calculate discount percentage if not provided
  const calculateDiscount = (product) => {
    if (product.discount) return product.discount;

    if (product.previous_price && product.price) {
      const currentPrice = Number(product.price.toString().replace(/,/g, ""));
      const previousPrice = Number(product.previous_price.toString().replace(/,/g, ""));

      if (previousPrice > currentPrice) {
        const discount = Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
        return `${discount}% OFF`;
      }
    }

    return null;
  };

  // Get appropriate icon for gadget type
  const getGadgetIcon = (type) => {
    switch (type) {
      case "Smartwatch": return <FaWatchmanMonitoring className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "Headphones": return <FaHeadphones className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "Fitness Tracker": return <FaMobile className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "Speaker": return <FaVolumeUp className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "Drone": return <FaMicrochip className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "VR Headset": return <FaMicrochip className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      case "Smart Home": return <FaWifi className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
      default: return <FaMobile className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaMobile className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading gadgets...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaMobile className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load gadget products right now.
          Please check your connection or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 mt-6 font-medium text-white transition-colors bg-red-600 rounded-lg shadow hover:bg-red-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 mt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Gadgets</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover innovative gadgets to enhance your digital lifestyle
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Gadgets</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg"
          >
            <FaFilter className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Sorting & Filters */}
          <div className={`lg:w-1/4 lg:pr-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Sort & Filter</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 text-gray-500 lg:hidden hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "discount", label: "Best Discount" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`sort-${option.value}`}
                        name="sortOption"
                        checked={sortOption === option.value}
                        onChange={() => handleSortChange(option.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor={`sort-${option.value}`} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-700">Brand</h3>
                  <div className="space-y-2 overflow-y-auto max-h-40">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandFilter(brand)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-700">Category</h3>
                  <div className="space-y-2 overflow-y-auto max-h-40">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryFilter(category)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connectivity Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Connectivity</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Bluetooth', 'Wi-Fi', 'Wireless', 'NFC'].map((connectivity) => (
                    <div key={connectivity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`connectivity-${connectivity}`}
                        checked={selectedConnectivity.includes(connectivity)}
                        onChange={() => handleConnectivityFilter(connectivity)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`connectivity-${connectivity}`} className="ml-1 text-sm text-gray-700">
                        {connectivity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-600">Min Price (৳)</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min={0}
                      max={priceRange.max}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm text-gray-600">Max Price (৳)</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      min={priceRange.min}
                      max={100000}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-indigo-600"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>0৳</span>
                    <span>{priceRange.max.toLocaleString()}৳</span>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="p-3 text-sm text-center rounded-lg bg-gray-50">
                <span className="font-medium text-gray-700">
                  {filteredData.length} of {gadgetProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedConnectivity.length > 0 || priceRange.min > 0 || priceRange.max < 100000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setSelectedConnectivity([]);
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-indigo-600 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Mobile Sort Options */}
            <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Sort By</h3>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedCategories.length > 0 || selectedConnectivity.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedCategories.map(category => (
                    <span key={category} className="px-2 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full">
                      {category} ×
                    </span>
                  ))}
                  {selectedConnectivity.map(connectivity => (
                    <span key={connectivity} className="px-2 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full">
                      {connectivity} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCategories([]);
                      setSelectedConnectivity([]);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaMobile className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No gadgets found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setSelectedConnectivity([]);
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getGadgetSpecs(item);

                  return (
                    <div
                      key={item._id}
                      className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-2xl hover:-translate-y-2"
                    >
                      {/* Product Image Container */}
                      <div className="relative h-48 overflow-hidden from-gray-50 to-gray-100">
                        {/* Responsive Image Container */}
                        <div className="relative flex items-center justify-center w-full h-full p-4">
                          <img
                            src={item.image || "https://via.placeholder.com/300x300?text=Gadget"}
                            alt={item.title}
                            className="object-contain max-w-full max-h-full transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=Gadget";
                              e.target.className = "object-cover w-full h-full transition-transform duration-500 group-hover:scale-105";
                            }}
                            style={{ maxHeight: "180px", maxWidth: "100%" }}
                          />
                        </div>

                        {/* Badge Container */}
                        <div className="absolute flex items-start justify-between top-3 left-3 right-3">
                          {/* Discount Badge */}
                          {discount && (
                            <span className="px-2.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-md">
                              {discount}
                            </span>
                          )}

                          {/* Category Badge */}
                          <span className="px-2.5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-md">
                            Gadget
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-indigo-600 min-h-[2.5rem]">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center">
                              {getGadgetIcon(specs.type)}
                              <span className="font-medium truncate">{specs.type}</span>
                            </li>
                            {specs.connectivity && (
                              <li className="flex items-center">
                                <FaBluetooth className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />
                                <span className="text-gray-600 truncate">{specs.connectivity}</span>
                              </li>
                            )}
                            {specs.battery && (
                              <li className="flex items-center">
                                <FaBatteryFull className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />
                                <span className="text-gray-600 truncate">{specs.battery}</span>
                              </li>
                            )}
                            {specs.features && (
                              <li className="flex items-center">
                                <FaMicrochip className="w-3.5 h-3.5 mr-2 text-indigo-500 flex-shrink-0" />
                                <span className="text-gray-600 truncate">{specs.features}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                              ৳{Number(item.price).toLocaleString()}
                            </span>
                            {item.previous_price && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳{Number(item.previous_price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/product/${item._id}`}
                            className="flex items-center px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:shadow-md transform hover:scale-105"
                          >
                            <FaEye className="w-4 h-4 mr-1.5" />
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gadgets;