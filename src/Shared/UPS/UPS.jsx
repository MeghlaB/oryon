// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import { Link } from "react-router-dom";

// function UPS() {
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
//     processor: "",
//     ram: "",
//     ssd: "",
//   });

//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 500000,
//   });

//   // Extract processor, RAM, SSD info from key_features array
//   const extractSpecs = (keyFeatures) => {
//     let processor = "";
//     let ram = "";
//     let ssd = "";

//     keyFeatures.forEach((feature) => {
//       const lower = feature.toLowerCase();

//       if (lower.includes("processor")) {
//         // Extract after "Processor: "
//         processor = feature.replace(/processor:\s*/i, "").trim();
//         // Optionally trim to main name like "Ryzen 7"
//         if (processor.toLowerCase().includes("ryzen")) {
//           const match = processor.match(/ryzen \d+/i);
//           if (match) processor = match[0];
//         } else if (processor.toLowerCase().includes("core i")) {
//           const match = processor.match(/core i\d+/i);
//           if (match) processor = match[0];
//         } else if (processor.toLowerCase().includes("snapdragon")) {
//           const match = processor.match(/snapdragon \w+ ?\w*/i);
//           if (match) processor = match[0];
//         }
//       }

//       if (lower.includes("ram")) {
//         // RAM usually like "RAM: 16GB DDR5 6400MHz; Storage: 1TB SSD"
//         // Split by semicolon or comma
//         const parts = feature.split(/[;,]/);
//         parts.forEach((part) => {
//           if (part.toLowerCase().includes("ram")) {
//             const ramMatch = part.match(/\d+GB/i);
//             if (ramMatch) ram = ramMatch[0];
//           }
//           if (
//             part.toLowerCase().includes("storage") ||
//             part.toLowerCase().includes("ssd")
//           ) {
//             const ssdMatch = part.match(/\d+TB|\d+GB/i);
//             if (ssdMatch) ssd = ssdMatch[0];
//           }
//         });
//       }

//       // In case Storage/SSD info is in a separate string and ssd not found yet
//       if ((lower.includes("storage") || lower.includes("ssd")) && !ssd) {
//         const ssdMatch = feature.match(/\d+TB|\d+GB/i);
//         if (ssdMatch) ssd = ssdMatch[0];
//       }
//     });

//     return { processor, ram, ssd };
//   };

//   // Filter only laptops
//   const LaptopData = products.filter((product) => product.category === "UPS");

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

//   // Filtered laptops according to filters
//   const filteredData = LaptopData.filter((pc) => {
//     const priceNumber = Number(pc.price.toString().replace(/,/g, ""));

//     const { processor, ram, ssd } = extractSpecs(pc.key_features || []);

//     return (
//       (!filters.processor || processor.toLowerCase().includes(filters.processor.toLowerCase())) &&
//       (!filters.ram || ram === filters.ram) &&
//       (!filters.ssd || ssd === filters.ssd) &&
//       priceNumber >= priceRange.min &&
//       priceNumber <= priceRange.max
//     );
//   });

//   if (isLoading) {
//     return (
//       <p className="mt-10 text-center text-blue-500">Loading products...</p>
//     );
//   }

//   if (isError) {
//     return (
//       <p className="mt-10 text-center text-red-500">Error loading products.</p>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gray-100 mt-28">
//       <h1 className="mb-6 text-2xl font-bold text-center">UPS Catalog</h1>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
//         {/* Filter Sidebar */}
//         <div className="p-4 space-y-6 bg-white rounded shadow-md">
//           {/* Price Range */}
//           <div>
//             <h4 className="mb-2 font-bold">Price Range (৳)</h4>
//             <div className="flex items-center gap-2">
//               <input
//                 type="number"
//                 value={priceRange.min}
//                 onChange={(e) => handlePriceChange(e, "min")}
//                 className="w-full px-2 py-1 border rounded"
//                 min={0}
//               />
//               <span>to</span>
//               <input
//                 type="number"
//                 value={priceRange.max}
//                 onChange={(e) => handlePriceChange(e, "max")}
//                 className="w-full px-2 py-1 border rounded"
//                 min={0}
//               />
//             </div>
//           </div>

//           {/* Processor */}
//           <div>
//             <h4 className="mb-2 font-bold">Processor</h4>
//             {["Ryzen 5", "Ryzen 7", "Core i3", "Snapdragon X Plus"].map((item) => (
//               <div key={item}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={filters.processor === item}
//                     onChange={() => handleChange("processor", item)}
//                   />
//                   <span className="ml-2">{item}</span>
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* RAM */}
//           <div>
//             <h4 className="mb-2 font-bold">RAM</h4>
//             {["8GB", "16GB"].map((item) => (
//               <div key={item}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={filters.ram === item}
//                     onChange={() => handleChange("ram", item)}
//                   />
//                   <span className="ml-2">{item}</span>
//                 </label>
//               </div>
//             ))}
//           </div>

//           {/* SSD */}
//           <div>
//             <h4 className="mb-2 font-bold">SSD</h4>
//             {["256GB", "512GB", "1TB"].map((item) => (
//               <div key={item}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={filters.ssd === item}
//                     onChange={() => handleChange("ssd", item)}
//                   />
//                   <span className="ml-2">{item}</span>
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Products */}
//         <div className="md:col-span-3">
//           {filteredData.length === 0 ? (
//             <p className="font-semibold text-center text-red-500">
//               No Laptops found with selected filters.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//               {filteredData.map((pc) => {
//                 const { processor, ram, ssd } = extractSpecs(pc.key_features || []);
//                 return (
//                   <Link to={`/product/${pc._id}`}
//                     key={pc._id}
//                     className="p-4 bg-white border rounded-lg shadow-md"
//                   >
//                     <img
//                       src={pc.image || "https://via.placeholder.com/150"}
//                       alt={pc.title}
//                       className="object-cover w-full h-40 rounded"
//                     />
//                     <h2 className="mt-2 font-semibold">{pc.title}</h2>
//                     <p className="text-sm text-gray-600">
//                       Processor: {processor || "N/A"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       RAM: {ram || "N/A"} | SSD: {ssd || "N/A"}
//                     </p>
//                     <p className="mt-2 font-bold text-red-600">
//                       {Number(pc.price).toLocaleString()} ৳
//                     </p>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UPS;

// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import { Link } from "react-router-dom";

// function UPS() {
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
//     capacity: "",
//     type: "",
//     outputPower: "",
//   });

//   const [priceRange, setPriceRange] = useState({
//     min: 0,
//     max: 500000,
//   });

//   // Extract UPS specs from key_features array
//   const extractSpecs = (keyFeatures) => {
//     let capacity = "";
//     let type = "";
//     let outputPower = "";

//     keyFeatures.forEach((feature) => {
//       const lower = feature.toLowerCase();

//       if (lower.includes("va") || lower.includes("volt-amp")) {
//         const capacityMatch = feature.match(/\d+\s*VA/i);
//         if (capacityMatch) capacity = capacityMatch[0];
//       }

//       if (lower.includes("line-interactive") || lower.includes("online") || lower.includes("standby")) {
//         if (lower.includes("line-interactive")) {
//           type = "Line-Interactive";
//         } else if (lower.includes("online")) {
//           type = "Online";
//         } else if (lower.includes("standby")) {
//           type = "Standby";
//         }
//       }

//       if (lower.includes("watt") || lower.includes("output")) {
//         const powerMatch = feature.match(/\d+\s*W/i);
//         if (powerMatch) outputPower = powerMatch[0];
//       }
//     });

//     return { capacity, type, outputPower };
//   };

//   // Filter only UPS devices
//   const upsData = products.filter((product) => product.category === "UPS");

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

//   // Filtered UPS devices according to filters
//   const filteredData = upsData.filter((ups) => {
//     const priceNumber = Number(ups.price.toString().replace(/,/g, ""));
//     const { capacity, type, outputPower } = extractSpecs(ups.key_features || []);

//     return (
//       (!filters.capacity || capacity.includes(filters.capacity)) &&
//       (!filters.type || type === filters.type) &&
//       (!filters.outputPower || outputPower === filters.outputPower) &&
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
//         <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">UPS Catalog</h1>

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

//             {/* Capacity */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Capacity (VA)</h4>
//               <div className="space-y-2">
//                 {["600VA", "800VA", "1000VA", "1200VA", "1500VA", "2000VA", "3000VA"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`capacity-${item}`}
//                       type="checkbox"
//                       checked={filters.capacity === item}
//                       onChange={() => handleChange("capacity", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`capacity-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Type */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Type</h4>
//               <div className="space-y-2">
//                 {["Line-Interactive", "Online", "Standby"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`type-${item}`}
//                       type="checkbox"
//                       checked={filters.type === item}
//                       onChange={() => handleChange("type", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`type-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Output Power */}
//             <div className="mb-6">
//               <h4 className="mb-3 font-medium text-gray-700">Output Power (W)</h4>
//               <div className="space-y-2">
//                 {["300W", "400W", "500W", "600W", "800W", "1000W", "1500W"].map((item) => (
//                   <div key={item} className="flex items-center">
//                     <input
//                       id={`outputPower-${item}`}
//                       type="checkbox"
//                       checked={filters.outputPower === item}
//                       onChange={() => handleChange("outputPower", item)}
//                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                     <label htmlFor={`outputPower-${item}`} className="ml-2 text-gray-700">
//                       {item}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 setFilters({ capacity: "", type: "", outputPower: "" });
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
//                 <h3 className="mb-2 text-xl font-medium text-gray-700">No UPS Devices Found</h3>
//                 <p className="text-gray-500">Try adjusting your filters to see more results.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                 {filteredData.map((ups) => {
//                   const { capacity, type, outputPower } = extractSpecs(ups.key_features || []);
//                   return (
//                     <Link
//                       to={`/product/${ups._id}`}
//                       key={ups._id}
//                       className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
//                     >
//                       <div className="relative h-48 overflow-hidden">
//                         <img
//                           src={ups.image || "https://via.placeholder.com/300"}
//                           alt={ups.title}
//                           className="object-contain w-full h-full p-4"
//                         />
//                       </div>
//                       <div className="p-4">
//                         <h2 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1">{ups.title}</h2>
//                         <div className="mb-3 space-y-1 text-sm text-gray-600">
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Capacity:</span>
//                             {capacity || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Type:</span>
//                             {type || "N/A"}
//                           </p>
//                           <p className="flex items-center">
//                             <span className="mr-1 font-medium">Output Power:</span>
//                             {outputPower || "N/A"}
//                           </p>
//                         </div>
//                         <p className="text-xl font-bold text-red-600">
//                           {Number(ups.price).toLocaleString()} ৳
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

// export default UPS;

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaEye,
  FaTimes,
  FaBatteryFull,
  FaBolt,
  FaClock,
  FaPlug
} from "react-icons/fa";

function UPS() {
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

  // Capacity filter state
  const [selectedCapacities, setSelectedCapacities] = useState([]);

  // Type filter state
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Filter only UPS category products
  const upsProducts = products.filter((product) =>
    product.category === "UPS"
  );

  // Get unique brands for filtering
  const brands = [...new Set(upsProducts.map(product => {
    const title = product.title.toLowerCase();
    if (title.includes("apc")) return "APC";
    if (title.includes("cyberpower")) return "CyberPower";
    if (title.includes("eaton")) return "Eaton";
    if (title.includes("tripp lite") || title.includes("tripplite")) return "Tripp Lite";
    if (title.includes("minuteman")) return "Minuteman";
    if (title.includes("vertiv") || title.includes("liebert")) return "Vertiv";
    if (title.includes("numeric")) return "Numeric";
    if (title.includes("delta")) return "Delta";
    if (title.includes("samsung")) return "Samsung";
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

  // Handle capacity filter
  const handleCapacityFilter = (capacity) => {
    if (selectedCapacities.includes(capacity)) {
      setSelectedCapacities(selectedCapacities.filter(c => c !== capacity));
    } else {
      setSelectedCapacities([...selectedCapacities, capacity]);
    }
  };

  // Handle type filter
  const handleTypeFilter = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Extract UPS specs from product features
  const getUPSSpecs = (product) => {
    let capacity = "";
    let runtime = "";
    let type = "";
    let outlets = "";

    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes("va") ||
          lowerFeature.includes("kva") ||
          lowerFeature.includes("volt") ||
          lowerFeature.includes("watt")) && !capacity) {
          capacity = feature;
        } else if ((lowerFeature.includes("min") ||
          lowerFeature.includes("minute") ||
          lowerFeature.includes("runtime") ||
          lowerFeature.includes("backup")) && !runtime) {
          runtime = feature;
        } else if ((lowerFeature.includes("line-interactive") ||
          lowerFeature.includes("online") ||
          lowerFeature.includes("standby")) && !type) {
          type = feature;
        } else if ((lowerFeature.includes("outlet") ||
          lowerFeature.includes("socket") ||
          lowerFeature.includes("port")) && !outlets) {
          outlets = feature;
        }
      });
    }

    return { capacity, runtime, type, outlets };
  };

  // Filtered and sorted UPS products
  const filteredData = upsProducts
    .filter((item) => {
      const priceNumber = Number(item.price.toString().replace(/,/g, ""));
      const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;

      // Brand filter
      const title = item.title.toLowerCase();
      let brandMatch = true;
      if (selectedBrands.length > 0) {
        brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
      }

      // Capacity filter (simplified)
      let capacityMatch = true;
      if (selectedCapacities.length > 0) {
        const specs = getUPSSpecs(item);
        capacityMatch = selectedCapacities.some(capacity => specs.capacity.includes(capacity));
      }

      // Type filter (simplified)
      let typeMatch = true;
      if (selectedTypes.length > 0) {
        const specs = getUPSSpecs(item);
        typeMatch = selectedTypes.some(type => specs.type.includes(type));
      }

      return priceInRange && brandMatch && capacityMatch && typeMatch;
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
          <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaBatteryFull className="w-6 h-6 text-orange-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading UPS systems...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaBatteryFull className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load UPS products right now.
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
          <h1 className="mb-3 text-4xl font-bold text-gray-900">UPS Systems</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Reliable uninterruptible power supply systems to protect your equipment from power outages
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">UPS Systems</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg"
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
                        className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
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
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capacity Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Capacity</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['600VA', '1000VA', '1500VA', '2000VA', '3000VA', '5000VA+'].map((capacity) => (
                    <div key={capacity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`capacity-${capacity}`}
                        checked={selectedCapacities.includes(capacity)}
                        onChange={() => handleCapacityFilter(capacity)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor={`capacity-${capacity}`} className="ml-1 text-sm text-gray-700">
                        {capacity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">UPS Type</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Line Interactive', 'Online', 'Standby'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`type-${type}`}
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeFilter(type)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                        {type}
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-orange-600"
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
                  {filteredData.length} of {upsProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedCapacities.length > 0 || selectedTypes.length > 0 || priceRange.min > 0 || priceRange.max < 100000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCapacities([]);
                    setSelectedTypes([]);
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-orange-600 rounded-lg bg-orange-50 hover:bg-orange-100"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedCapacities.length > 0 || selectedTypes.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedCapacities.map(capacity => (
                    <span key={capacity} className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                      {capacity} ×
                    </span>
                  ))}
                  {selectedTypes.map(type => (
                    <span key={type} className="px-2 py-1 text-xs text-orange-800 bg-orange-100 rounded-full">
                      {type} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedCapacities([]);
                      setSelectedTypes([]);
                    }}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaBatteryFull className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No UPS systems found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCapacities([]);
                    setSelectedTypes([]);
                    setPriceRange({ min: 0, max: 100000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getUPSSpecs(item);

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
                            src={item.image || "https://via.placeholder.com/300x300?text=UPS"}
                            alt={item.title}
                            className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=UPS";
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
                          <span className="px-2 py-1 text-xs font-medium text-white bg-orange-600 rounded-md shadow-sm">
                            UPS
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-orange-600">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {specs.capacity && (
                              <li className="flex items-center">
                                <FaBolt className="w-3.5 h-3.5 mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{specs.capacity}</span>
                              </li>
                            )}
                            {specs.runtime && (
                              <li className="flex items-center">
                                <FaClock className="w-3.5 h-3.5 mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{specs.runtime}</span>
                              </li>
                            )}
                            {specs.type && (
                              <li className="flex items-center">
                                <FaBatteryFull className="w-3.5 h-3.5 mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{specs.type}</span>
                              </li>
                            )}
                            {specs.outlets && (
                              <li className="flex items-center">
                                <FaPlug className="w-3.5 h-3.5 mr-2 text-orange-500 flex-shrink-0" />
                                <span className="truncate">{specs.outlets}</span>
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
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-orange-600 rounded-lg hover:bg-orange-700 hover:shadow-md"
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

export default UPS;