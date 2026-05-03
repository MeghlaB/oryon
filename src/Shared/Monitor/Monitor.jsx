
// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import { Link } from "react-router-dom";

// function Monitor() {
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
//     refreshRate: "",
//     panelType: "",
//   });

//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 500000,
//   });

//   // Extract monitor specs from key_features array
//   const extractSpecs = (keyFeatures) => {
//     let size = "";
//     let resolution = "";
//     let refreshRate = "";
//     let panelType = "";

//     keyFeatures.forEach((feature) => {
//       const lower = feature.toLowerCase();

//       if (lower.includes("inch") || lower.includes('"')) {
//         const sizeMatch = feature.match(/\d+(\.\d+)?\s*(inch|")/i);
//         if (sizeMatch) size = sizeMatch[0];
//       }

//       if (lower.includes("resolution") || lower.includes("p")) {
//         if (lower.includes("1080") || lower.includes("full hd") || lower.includes("fhd")) {
//           resolution = "1080p (Full HD)";
//         } else if (lower.includes("1440") || lower.includes("qhd") || lower.includes("2k")) {
//           resolution = "1440p (QHD)";
//         } else if (lower.includes("2160") || lower.includes("4k") || lower.includes("uhd")) {
//           resolution = "2160p (4K UHD)";
//         } else if (lower.includes("3840")) {
//           resolution = "3840p (4K)";
//         }
//       }

//       if (lower.includes("hz") || lower.includes("refresh")) {
//         const refreshMatch = feature.match(/\d+\s*Hz/i);
//         if (refreshMatch) refreshRate = refreshMatch[0];
//       }

//       if (lower.includes("ips")) {
//         panelType = "IPS";
//       } else if (lower.includes("va")) {
//         panelType = "VA";
//       } else if (lower.includes("tn")) {
//         panelType = "TN";
//       } else if (lower.includes("oled")) {
//         panelType = "OLED";
//       }
//     });

//     return { size, resolution, refreshRate, panelType };
//   };

//   // Filter only monitors
//   const monitorData = products.filter((product) => product.category === "Monitor");

//   // Handle checkbox filter change
//   const handleChange = (type, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [type]: prev[type] === value ? "" : value,
//     }));
//   };

//   // Handle price inputs
//   const handlePriceChange = (e, type) => {
//     const value = Number(e.target.value);
//     setPriceRange((prev) => ({
//       ...prev,
//       [type]: value,
//     }));
//   };

//   // Filtered monitors according to filters
//   const filteredData = monitorData.filter((monitor) => {
//     const priceNumber = Number(monitor.price.toString().replace(/,/g, ""));
//     const { size, resolution, refreshRate, panelType } = extractSpecs(monitor.key_features || []);

//     return (
//       (!filters.size || size.includes(filters.size)) &&
//       (!filters.resolution || resolution === filters.resolution) &&
//       (!filters.refreshRate || refreshRate === filters.refreshRate) &&
//       (!filters.panelType || panelType === filters.panelType) &&
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

//   return (
//     <div className="min-h-screen px-4 py-8 mt-20 bg-gray-50 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl">
//         <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">Monitor Catalog</h1>

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

//             {/* Size */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Size</h4>
//               <div className="space-y-2">
//                 {["24 inch", "27 inch", "32 inch", "34 inch", "38 inch+"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`size-${item}`}
//                       type="checkbox"
//                       checked={filters.size === item}
//                       onChange={() => handleChange("size", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`size-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Resolution */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Resolution</h4>
//               <div className="space-y-2">
//                 {["1080p (Full HD)", "1440p (QHD)", "2160p (4K UHD)", "3840p (4K)"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`resolution-${item}`}
//                       type="checkbox"
//                       checked={filters.resolution === item}
//                       onChange={() => handleChange("resolution", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`resolution-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Refresh Rate */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Refresh Rate</h4>
//               <div className="space-y-2">
//                 {["60Hz", "75Hz", "120Hz", "144Hz", "165Hz", "240Hz", "360Hz"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`refreshRate-${item}`}
//                       type="checkbox"
//                       checked={filters.refreshRate === item}
//                       onChange={() => handleChange("refreshRate", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`refreshRate-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Panel Type */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Panel Type</h4>
//               <div className="space-y-2">
//                 {["IPS", "VA", "TN", "OLED"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`panelType-${item}`}
//                       type="checkbox"
//                       checked={filters.panelType === item}
//                       onChange={() => handleChange("panelType", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`panelType-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button 
//               onClick={() => {
//                 setFilters({ size: "", resolution: "", refreshRate: "", panelType: "" });
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
//                 <h3 className="mb-2 text-xl font-medium text-gray-700">No Monitors Found</h3>
//                 <p className="text-gray-500">Try adjusting your filters to see more results.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredData.map((monitor) => {
//                   const { size, resolution, refreshRate, panelType } = extractSpecs(monitor.key_features || []);
//                   return (
//                     <Link 
//                       to={`/product/${monitor._id}`}
//                       key={monitor._id}
//                       className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
//                     >
//                       <div className="relative h-48 overflow-hidden">
//                         <img
//                           src={monitor.image || "https://via.placeholder.com/300"}
//                           alt={monitor.title}
//                           className="object-contain w-full h-full p-4"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <h2 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1">{monitor.title}</h2>
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
//                             <span className="mr-1 font-medium">Refresh Rate:</span> 
//                             {refreshRate || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Panel Type:</span> 
//                             {panelType || "N/A"}
//                           </p>
//                         </div>
//                         <p className="text-xl font-bold text-red-600">
//                           {Number(monitor.price).toLocaleString()} ৳
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

// export default Monitor;

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaEye,
  FaTimes,
  FaDesktop,
  FaExpand,
  FaSyncAlt,
  FaLightbulb
} from "react-icons/fa";

function Monitors() {
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
    max: 300000,
  });

  // Sort option state
  const [sortOption, setSortOption] = useState("featured");

  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Brand filter state
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Size filter state
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Resolution filter state
  const [selectedResolutions, setSelectedResolutions] = useState([]);

  // Refresh rate filter state
  const [selectedRefreshRates, setSelectedRefreshRates] = useState([]);

  // Filter only monitor category products
  const monitorProducts = products.filter((product) =>
    product.category === "Monitor"
  );

  // Get unique brands for filtering
  const brands = [...new Set(monitorProducts.map(product => {
    const title = product.title.toLowerCase();
    if (title.includes("samsung")) return "Samsung";
    if (title.includes("lg")) return "LG";
    if (title.includes("dell")) return "Dell";
    if (title.includes("asus")) return "ASUS";
    if (title.includes("acer")) return "Acer";
    if (title.includes("hp")) return "HP";
    if (title.includes("lenovo")) return "Lenovo";
    if (title.includes("msi")) return "MSI";
    if (title.includes("gigabyte")) return "Gigabyte";
    if (title.includes("viewsonic")) return "ViewSonic";
    return null;
  }).filter(brand => brand))];

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

  // Handle size filter
  const handleSizeFilter = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
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

  // Handle refresh rate filter
  const handleRefreshRateFilter = (rate) => {
    if (selectedRefreshRates.includes(rate)) {
      setSelectedRefreshRates(selectedRefreshRates.filter(r => r !== rate));
    } else {
      setSelectedRefreshRates([...selectedRefreshRates, rate]);
    }
  };

  // Extract monitor specs from product features
  const getMonitorSpecs = (product) => {
    let size = "";
    let resolution = "";
    let refreshRate = "";
    let panelType = "";

    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes('"') || lowerFeature.includes("inch")) && !size) {
          size = feature;
        } else if ((lowerFeature.includes("resolution") ||
          lowerFeature.includes("hd") ||
          lowerFeature.includes("fhd") ||
          lowerFeature.includes("qhd") ||
          lowerFeature.includes("4k") ||
          lowerFeature.includes("ultra hd")) && !resolution) {
          resolution = feature;
        } else if ((lowerFeature.includes("hz") || lowerFeature.includes("refresh")) && !refreshRate) {
          refreshRate = feature;
        } else if ((lowerFeature.includes("ips") ||
          lowerFeature.includes("va") ||
          lowerFeature.includes("tn") ||
          lowerFeature.includes("oled") ||
          lowerFeature.includes("led")) && !panelType) {
          panelType = feature;
        }
      });
    }

    return { size, resolution, refreshRate, panelType };
  };

  // Filtered and sorted monitor products
  const filteredData = monitorProducts
    .filter((item) => {
      const priceNumber = Number(item.price.toString().replace(/,/g, ""));
      const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;

      // Brand filter
      const title = item.title.toLowerCase();
      let brandMatch = true;
      if (selectedBrands.length > 0) {
        brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
      }

      // Size filter (simplified)
      let sizeMatch = true;
      if (selectedSizes.length > 0) {
        const specs = getMonitorSpecs(item);
        sizeMatch = selectedSizes.some(size => specs.size.includes(size));
      }

      // Resolution filter (simplified)
      let resolutionMatch = true;
      if (selectedResolutions.length > 0) {
        const specs = getMonitorSpecs(item);
        resolutionMatch = selectedResolutions.some(res => specs.resolution.includes(res));
      }

      // Refresh rate filter (simplified)
      let refreshRateMatch = true;
      if (selectedRefreshRates.length > 0) {
        const specs = getMonitorSpecs(item);
        refreshRateMatch = selectedRefreshRates.some(rate => specs.refreshRate.includes(rate));
      }

      return priceInRange && brandMatch && sizeMatch && resolutionMatch && refreshRateMatch;
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
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaDesktop className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading monitors...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaDesktop className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load monitor products right now.
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
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Monitors</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Enhance your viewing experience with high-quality monitors
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Monitors</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg"
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
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['24"', '27"', '32"', '34"', '38"', '40"+'].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeFilter(size)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                <div className="grid grid-cols-1 gap-2">
                  {['1080p Full HD', '1440p QHD', '4K Ultra HD', 'UltraWide', '5K'].map((resolution) => (
                    <div key={resolution} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`resolution-${resolution}`}
                        checked={selectedResolutions.includes(resolution)}
                        onChange={() => handleResolutionFilter(resolution)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`resolution-${resolution}`} className="ml-2 text-sm text-gray-700">
                        {resolution}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Refresh Rate Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Refresh Rate</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['60Hz', '75Hz', '120Hz', '144Hz', '165Hz', '240Hz+'].map((rate) => (
                    <div key={rate} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rate-${rate}`}
                        checked={selectedRefreshRates.includes(rate)}
                        onChange={() => handleRefreshRateFilter(rate)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`rate-${rate}`} className="ml-1 text-sm text-gray-700">
                        {rate}
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      min={priceRange.min}
                      max={300000}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-blue-600"
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
                  {filteredData.length} of {monitorProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedResolutions.length > 0 || selectedRefreshRates.length > 0 || priceRange.min > 0 || priceRange.max < 300000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                    setSelectedResolutions([]);
                    setSelectedRefreshRates([]);
                    setPriceRange({ min: 0, max: 300000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedResolutions.length > 0 || selectedRefreshRates.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedSizes.map(size => (
                    <span key={size} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {size} ×
                    </span>
                  ))}
                  {selectedResolutions.map(resolution => (
                    <span key={resolution} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {resolution} ×
                    </span>
                  ))}
                  {selectedRefreshRates.map(rate => (
                    <span key={rate} className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {rate} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedSizes([]);
                      setSelectedResolutions([]);
                      setSelectedRefreshRates([]);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaDesktop className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No monitors found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                    setSelectedResolutions([]);
                    setSelectedRefreshRates([]);
                    setPriceRange({ min: 0, max: 300000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getMonitorSpecs(item);

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
                            src={item.image || "https://via.placeholder.com/300x300?text=Monitor"}
                            alt={item.title}
                            className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=Monitor";
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
                          <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md shadow-sm">
                            Monitor
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-blue-600">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {specs.size && (
                              <li className="flex items-center">
                                <FaExpand className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{specs.size}</span>
                              </li>
                            )}
                            {specs.resolution && (
                              <li className="flex items-center">
                                <FaDesktop className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{specs.resolution}</span>
                              </li>
                            )}
                            {specs.refreshRate && (
                              <li className="flex items-center">
                                <FaSyncAlt className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{specs.refreshRate}</span>
                              </li>
                            )}
                            {specs.panelType && (
                              <li className="flex items-center">
                                <FaLightbulb className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                <span className="truncate">{specs.panelType}</span>
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
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md"
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
    </div>
  );
}

export default Monitors;