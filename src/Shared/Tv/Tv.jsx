// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import { Link } from "react-router-dom";

// function TV() {
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

//   // Filter states
//   const [filters, setFilters] = useState({
//     size: "",
//     resolution: "",
//     displayType: "",
//     smartTv: "",
//   });

//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 500000,
//   });

//   // State for dropdown visibility
//   const [openDropdown, setOpenDropdown] = useState(null);

//   // Extract TV specs from key_features array
//   const extractSpecs = (keyFeatures) => {
//     let size = "";
//     let resolution = "";
//     let displayType = "";
//     let smartTv = "";

//     keyFeatures.forEach((feature) => {
//       const lower = feature.toLowerCase();

//       if (lower.includes("inch") || lower.includes('"')) {
//         const sizeMatch = feature.match(/\d+(\.\d+)?\s*(inch|")/i);
//         if (sizeMatch) size = sizeMatch[0];
//       }

//       if (lower.includes("resolution") || lower.includes("p") || lower.includes("hd") || lower.includes("uhd") || lower.includes("4k") || lower.includes("8k")) {
//         if (lower.includes("1080") || lower.includes("full hd") || lower.includes("fhd")) {
//           resolution = "1080p (Full HD)";
//         } else if (lower.includes("1440") || lower.includes("qhd") || lower.includes("2k")) {
//           resolution = "1440p (QHD)";
//         } else if (lower.includes("2160") || lower.includes("4k") || lower.includes("uhd")) {
//           resolution = "2160p (4K UHD)";
//         } else if (lower.includes("4320") || lower.includes("8k")) {
//           resolution = "4320p (8K)";
//         } else if (lower.includes("720") || lower.includes("hd")) {
//           resolution = "720p (HD)";
//         }
//       }

//       if (lower.includes("led") || lower.includes("oled") || lower.includes("qled") || lower.includes("microled") || lower.includes("plasma") || lower.includes("lcd")) {
//         if (lower.includes("oled")) {
//           displayType = "OLED";
//         } else if (lower.includes("qled")) {
//           displayType = "QLED";
//         } else if (lower.includes("microled")) {
//           displayType = "MicroLED";
//         } else if (lower.includes("plasma")) {
//           displayType = "Plasma";
//         } else if (lower.includes("led")) {
//           displayType = "LED";
//         } else if (lower.includes("lcd")) {
//           displayType = "LCD";
//         }
//       }

//       if (lower.includes("smart") || lower.includes("android") || lower.includes("webos") || lower.includes("tizen")) {
//         smartTv = "Smart TV";
//         if (lower.includes("android")) {
//           smartTv = "Android TV";
//         } else if (lower.includes("webos")) {
//           smartTv = "webOS TV";
//         } else if (lower.includes("tizen")) {
//           smartTv = "Tizen TV";
//         }
//       }
//     });

//     return { size, resolution, displayType, smartTv };
//   };

//   // Filter only TVs
//   const tvData = products.filter((product) => product.category === "TV");

//   // Handle dropdown filter change
//   const handleFilterChange = (type, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [type]: prev[type] === value ? "" : value,
//     }));
//     setOpenDropdown(null); // Close dropdown after selection
//   };

//   // Handle price inputs
//   const handlePriceChange = (e, type) => {
//     const value = Number(e.target.value);
//     setPriceRange((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   // Toggle dropdown
//   const toggleDropdown = (dropdown) => {
//     setOpenDropdown(openDropdown === dropdown ? null : dropdown);
//   };

//   // Filtered TVs according to filters
//   const filteredData = tvData.filter((tv) => {
//     const priceNumber = Number(tv.price.toString().replace(/,/g, ""));
//     const { size, resolution, displayType, smartTv } = extractSpecs(tv.key_features || []);

//     return (
//       (!filters.size || size.includes(filters.size)) &&
//       (!filters.resolution || resolution === filters.resolution) &&
//       (!filters.displayType || displayType === filters.displayType) &&
//       (!filters.smartTv || smartTv === filters.smartTv) &&
//       priceNumber >= priceRange.min &&
//       priceNumber <= priceRange.max
//     );
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-16 h-16 border-t-4 border-blue-500 border-opacity-75 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-xl text-red-500">Error loading products. Please try again later.</p>
//       </div>
//     );
//   }

//   // Filter options
//   const filterOptions = {
//     size: ["32 inch", "40 inch", "43 inch", "50 inch", "55 inch", "65 inch", "75 inch", "85 inch", "98 inch"],
//     resolution: ["720p (HD)", "1080p (Full HD)", "1440p (QHD)", "2160p (4K UHD)", "4320p (8K)"],
//     displayType: ["LED", "OLED", "QLED", "MicroLED", "LCD", "Plasma"],
//     smartTv: ["Smart TV", "Android TV", "webOS TV", "Tizen TV"]
//   };

//   return (
//     <div className="min-h-screen px-4 py-8 mt-20 bg-gray-50 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">TV Catalog</h1>

//         <div className="flex flex-col gap-8 md:flex-row">
//           {/* Filter Sidebar */}
//           <div className="w-full p-6 bg-white rounded-lg shadow-md md:w-1/4 h-fit">
//             <h2 className="pb-2 mb-6 text-xl font-semibold text-gray-800 border-b">Filters</h2>

//             {/* Price Range */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Price Range (৳)</h4>
//               <div className="flex flex-col space-y-3">
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={priceRange.min}
//                     onChange={(e) => handlePriceChange(e, "min")}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min={0}
//                     placeholder="Min"
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="number"
//                     value={priceRange.max}
//                     onChange={(e) => handlePriceChange(e, "max")}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min={0}
//                     placeholder="Max"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Size Dropdown */}
//             <div className="relative mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Size</h4>
//               <button
//                 onClick={() => toggleDropdown("size")}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <span>{filters.size || "Select size"}</span>
//                 <svg className={`h-5 w-5 transform transition-transform ${openDropdown === "size" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               {openDropdown === "size" && (
//                 <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
//                   {filterOptions.size.map((item) => (
//                     <div
//                       key={item}
//                       onClick={() => handleFilterChange("size", item)}
//                       className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${filters.size === item ? "bg-blue-100 text-blue-800" : ""}`}
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Resolution Dropdown */}
//             <div className="relative mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Resolution</h4>
//               <button
//                 onClick={() => toggleDropdown("resolution")}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <span>{filters.resolution || "Select resolution"}</span>
//                 <svg className={`h-5 w-5 transform transition-transform ${openDropdown === "resolution" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               {openDropdown === "resolution" && (
//                 <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
//                   {filterOptions.resolution.map((item) => (
//                     <div
//                       key={item}
//                       onClick={() => handleFilterChange("resolution", item)}
//                       className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${filters.resolution === item ? "bg-blue-100 text-blue-800" : ""}`}
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Display Type Dropdown */}
//             <div className="relative mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Display Type</h4>
//               <button
//                 onClick={() => toggleDropdown("displayType")}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <span>{filters.displayType || "Select display type"}</span>
//                 <svg className={`h-5 w-5 transform transition-transform ${openDropdown === "displayType" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               {openDropdown === "displayType" && (
//                 <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
//                   {filterOptions.displayType.map((item) => (
//                     <div
//                       key={item}
//                       onClick={() => handleFilterChange("displayType", item)}
//                       className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${filters.displayType === item ? "bg-blue-100 text-blue-800" : ""}`}
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Smart TV Dropdown */}
//             <div className="relative mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Smart TV</h4>
//               <button
//                 onClick={() => toggleDropdown("smartTv")}
//                 className="flex items-center justify-between w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <span>{filters.smartTv || "Select smart TV type"}</span>
//                 <svg className={`h-5 w-5 transform transition-transform ${openDropdown === "smartTv" ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="CurrentColor">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               {openDropdown === "smartTv" && (
//                 <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
//                   {filterOptions.smartTv.map((item) => (
//                     <div
//                       key={item}
//                       onClick={() => handleFilterChange("smartTv", item)}
//                       className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${filters.smartTv === item ? "bg-blue-100 text-blue-800" : ""}`}
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button 
//               onClick={() => {
//                 setFilters({ size: "", resolution: "", displayType: "", smartTv: "" });
//                 setPriceRange({ min: 0, max: 500000 });
//               }}
//               className="w-full px-4 py-2 text-gray-800 transition duration-200 bg-gray-200 rounded-md hover:bg-gray-300"
//             >
//               Clear Filters
//             </button>
//           </div>

//           {/* Products */}
//           <div className="w-full md:w-3/4">
//             {filteredData.length === 0 ? (
//               <div className="p-8 text-center bg-white rounded-lg shadow-md">
//                 <h3 className="mb-2 text-xl font-medium text-gray-700">No TVs Found</h3>
//                 <p className="text-gray-500">Try adjusting your filters to see more results.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredData.map((tv) => {
//                   const { size, resolution, displayType, smartTv } = extractSpecs(tv.key_features || []);
//                   return (
//                     <Link 
//                       to={`/product/${tv._id}`}
//                       key={tv._id}
//                       className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
//                     >
//                       <div className="relative h-48 overflow-hidden">
//                         <img
//                           src={tv.image || "https://via.placeholder.com/300"}
//                           alt={tv.title}
//                           className="object-contain w-full h-full p-4"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <h2 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1">{tv.title}</h2>
//                         <div className="mb-3 space-y-1 text-sm text-gray-600">
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Size:</span> 
//                             {size || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Resolution:</span> 
//                             {resolution || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Display Type:</span> 
//                             {displayType || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Smart TV:</span> 
//                             {smartTv || "N/A"}
//                           </p>
//                         </div>
//                         <p className="text-xl font-bold text-red-600">
//                           {Number(tv.price).toLocaleString()} ৳
//                         </p>
//                         <button className="w-full px-4 py-2 mt-4 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700">
//                           View Details
//                         </button>
//                       </div>
//                     </Link>
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

// export default TV;

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaEye,
  FaTimes,
  FaTv,
  FaExpand,
  FaMicrochip,
  FaVolumeUp,
  FaBolt
} from "react-icons/fa";
// import { FaHd } from "react-icons/fa6"; 

function TV() {
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
    max: 500000,
  });

  // Sort option state
  const [sortOption, setSortOption] = useState("featured");

  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Brand filter state
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Screen size filter state
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);

  // Resolution filter state
  const [selectedResolutions, setSelectedResolutions] = useState([]);

  // Filter only TV category products
  const tvProducts = useMemo(() =>
    products.filter((product) => product.category === "TV"),
    [products]
  );

  // Get unique brands for filtering
  const brands = useMemo(() => {
    const brandSet = new Set();

    tvProducts.forEach(product => {
      const title = product.title.toLowerCase();
      if (title.includes("samsung")) brandSet.add("Samsung");
      else if (title.includes("lg")) brandSet.add("LG");
      else if (title.includes("sony")) brandSet.add("Sony");
      else if (title.includes("tcl")) brandSet.add("TCL");
      else if (title.includes("xiaomi") || title.includes("mi")) brandSet.add("Xiaomi");
      else if (title.includes("panasonic")) brandSet.add("Panasonic");
      else if (title.includes("philips")) brandSet.add("Philips");
      else if (title.includes("hisense")) brandSet.add("Hisense");
      else if (title.includes("sharp")) brandSet.add("Sharp");
      else if (product.brand) brandSet.add(product.brand);
    });

    return Array.from(brandSet).sort();
  }, [tvProducts]);

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

  // Handle screen size filter
  const handleScreenSizeFilter = (size) => {
    if (selectedScreenSizes.includes(size)) {
      setSelectedScreenSizes(selectedScreenSizes.filter(s => s !== size));
    } else {
      setSelectedScreenSizes([...selectedScreenSizes, size]);
    }
  };

  // Handle resolution filter
  const handleResolutionFilter = (resolution) => {
    if (selectedResolutions.includes(resolution)) {
      setSelectedResolutions(selectedResolutions.filter(r => r !== resolution));
    } else {
      setSelectedResolutions([...selectedResolutions, resolution]);
    }
  };

  // Extract TV specs from product features
  const getTVSpecs = (product) => {
    let screenSize = "";
    let resolution = "";
    let smartTv = "";
    let connectivity = "";
    let sound = "";

    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes('"') ||
          lowerFeature.includes("inch") ||
          lowerFeature.includes("display") ||
          lowerFeature.includes("screen")) && !screenSize) {
          screenSize = feature;
        } else if ((lowerFeature.includes("4k") ||
          lowerFeature.includes("uhd") ||
          lowerFeature.includes("fhd") ||
          lowerFeature.includes("hd") ||
          lowerFeature.includes("8k")) && !resolution) {
          resolution = feature;
        } else if ((lowerFeature.includes("smart") ||
          lowerFeature.includes("android") ||
          lowerFeature.includes("webos") ||
          lowerFeature.includes("tizen")) && !smartTv) {
          smartTv = feature;
        } else if ((lowerFeature.includes("wifi") ||
          lowerFeature.includes("bluetooth") ||
          lowerFeature.includes("hdmi") ||
          lowerFeature.includes("usb")) && !connectivity) {
          connectivity = feature;
        } else if ((lowerFeature.includes("sound") ||
          lowerFeature.includes("audio") ||
          lowerFeature.includes("dolby") ||
          lowerFeature.includes("speaker")) && !sound) {
          sound = feature;
        }
      });
    }

    return { screenSize, resolution, smartTv, connectivity, sound };
  };

  // Filtered and sorted TV products
  const filteredData = useMemo(() => {
    return tvProducts
      .filter((item) => {
        const priceNumber = Number(item.price.toString().replace(/,/g, ""));
        const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;

        // Brand filter
        const title = item.title.toLowerCase();
        let brandMatch = true;
        if (selectedBrands.length > 0) {
          brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
        }

        // Screen size filter
        let screenSizeMatch = true;
        if (selectedScreenSizes.length > 0) {
          const specs = getTVSpecs(item);
          screenSizeMatch = selectedScreenSizes.some(size => specs.screenSize.includes(size));
        }

        // Resolution filter
        let resolutionMatch = true;
        if (selectedResolutions.length > 0) {
          const specs = getTVSpecs(item);
          resolutionMatch = selectedResolutions.some(res => specs.resolution.includes(res));
        }

        return priceInRange && brandMatch && screenSizeMatch && resolutionMatch;
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
  }, [tvProducts, priceRange, selectedBrands, selectedScreenSizes, selectedResolutions, sortOption]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaTv className="w-6 h-6 text-teal-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading TVs...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaTv className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load TV products right now.
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
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Televisions</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover stunning TVs for immersive entertainment experiences
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">TVs</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-teal-600 rounded-lg"
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
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
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
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screen Size Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Screen Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"'].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={selectedScreenSizes.includes(size)}
                        onChange={() => handleScreenSizeFilter(size)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor={`size-${size}`} className="ml-1 text-sm text-gray-700">
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Resolution</h3>
                <div className="space-y-2">
                  {['HD', 'FHD', '4K UHD', '8K UHD', 'QLED', 'OLED'].map((resolution) => (
                    <div key={resolution} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`resolution-${resolution}`}
                        checked={selectedResolutions.includes(resolution)}
                        onChange={() => handleResolutionFilter(resolution)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <label htmlFor={`resolution-${resolution}`} className="ml-2 text-sm text-gray-700">
                        {resolution}
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      min={priceRange.min}
                      max={500000}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-teal-600"
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
                  {filteredData.length} of {tvProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedScreenSizes.length > 0 || selectedResolutions.length > 0 || priceRange.min > 0 || priceRange.max < 500000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedScreenSizes([]);
                    setSelectedResolutions([]);
                    setPriceRange({ min: 0, max: 500000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-teal-600 rounded-lg bg-teal-50 hover:bg-teal-100"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedScreenSizes.length > 0 || selectedResolutions.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedScreenSizes.map(size => (
                    <span key={size} className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
                      {size} ×
                    </span>
                  ))}
                  {selectedResolutions.map(resolution => (
                    <span key={resolution} className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
                      {resolution} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedScreenSizes([]);
                      setSelectedResolutions([]);
                    }}
                    className="text-xs text-teal-600 hover:text-teal-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaTv className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No TVs found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedScreenSizes([]);
                    setSelectedResolutions([]);
                    setPriceRange({ min: 0, max: 500000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getTVSpecs(item);

                  return (
                    <div
                      key={item._id}
                      className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Product Image Container */}
                      <div className="relative overflow-hidden bg-gray-50">
                        <div className="flex items-center justify-center h-48">
                          {/* Responsive Image with fallback */}
                          <img
                            src={item.image || "https://via.placeholder.com/300x300?text=TV"}
                            alt={item.title}
                            className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=TV";
                            }}
                          />
                        </div>

                        {/* Discount Badge */}
                        {discount && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md shadow-sm">
                              {discount}
                            </span>
                          </div>
                        )}

                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 text-xs font-medium text-white bg-teal-600 rounded-md shadow-sm">
                            TV
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-teal-600">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {specs.screenSize && (
                              <li className="flex items-center">
                                <FaExpand className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
                                <span className="truncate">{specs.screenSize}</span>
                              </li>
                            )}
                            {/* {specs.resolution && (
                              <li className="flex items-center">
                                <FaHd className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
                                <span className="truncate">{specs.resolution}</span>
                              </li>
                            )} */}
                            {specs.smartTv && (
                              <li className="flex items-center">
                                <FaMicrochip className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
                                <span className="truncate">{specs.smartTv}</span>
                              </li>
                            )}
                            {specs.connectivity && (
                              <li className="flex items-center">
                                <FaBolt className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
                                <span className="truncate">{specs.connectivity}</span>
                              </li>
                            )}
                            {specs.sound && (
                              <li className="flex items-center">
                                <FaVolumeUp className="w-3.5 h-3.5 mr-2 text-teal-500 flex-shrink-0" />
                                <span className="truncate">{specs.sound}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-teal-600 rounded-lg hover:bg-teal-700 hover:shadow-md"
                          >
                            <FaEye className="w-3.5 h-3.5 mr-1.5" />
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
    </div >
  );
}

export default TV;