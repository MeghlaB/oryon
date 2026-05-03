
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { 
  FaFilter, 
  FaEye,
  FaTimes,
  FaLaptop,
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBatteryFull
} from "react-icons/fa";

function Laptops() {
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
  
  // RAM filter state
  const [selectedRAM, setSelectedRAM] = useState([]);
  
  // Storage filter state
  const [selectedStorage, setSelectedStorage] = useState([]);
  
  // Processor filter state
  const [selectedProcessors, setSelectedProcessors] = useState([]);

  // Filter only laptop category products
  const laptopProducts = products.filter((product) => 
    product.category === "Laptop"
  );

  // Get unique brands for filtering
  const brands = [...new Set(laptopProducts.map(product => {
    const title = product.title.toLowerCase();
    if (title.includes("dell")) return "Dell";
    if (title.includes("hp")) return "HP";
    if (title.includes("lenovo")) return "Lenovo";
    if (title.includes("asus")) return "ASUS";
    if (title.includes("acer")) return "Acer";
    if (title.includes("apple") || title.includes("macbook")) return "Apple";
    if (title.includes("msi")) return "MSI";
    if (title.includes("samsung")) return "Samsung";
    if (title.includes("xiaomi") || title.includes("mi")) return "Xiaomi";
    if (title.includes("huawei")) return "Huawei";
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

  // Handle RAM filter
  const handleRAMFilter = (ram) => {
    if (selectedRAM.includes(ram)) {
      setSelectedRAM(selectedRAM.filter(r => r !== ram));
    } else {
      setSelectedRAM([...selectedRAM, ram]);
    }
  };

  // Handle storage filter
  const handleStorageFilter = (storage) => {
    if (selectedStorage.includes(storage)) {
      setSelectedStorage(selectedStorage.filter(s => s !== storage));
    } else {
      setSelectedStorage([...selectedStorage, storage]);
    }
  };

  // Handle processor filter
  const handleProcessorFilter = (processor) => {
    if (selectedProcessors.includes(processor)) {
      setSelectedProcessors(selectedProcessors.filter(p => p !== processor));
    } else {
      setSelectedProcessors([...selectedProcessors, processor]);
    }
  };

  // Extract laptop specs from product features
  const getLaptopSpecs = (product) => {
    let processor = "";
    let ram = "";
    let storage = "";
    let graphics = "";
    
    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes("intel") || 
             lowerFeature.includes("amd") || 
             lowerFeature.includes("ryzen") || 
             lowerFeature.includes("core") || 
             lowerFeature.includes("i3") || 
             lowerFeature.includes("i5") || 
             lowerFeature.includes("i7") || 
             lowerFeature.includes("i9")) && !processor) {
          processor = feature;
        } else if ((lowerFeature.includes("ram") || lowerFeature.includes("gb ram") || lowerFeature.includes("ddr")) && !ram) {
          ram = feature;
        } else if ((lowerFeature.includes("ssd") || 
                   lowerFeature.includes("hdd") || 
                   lowerFeature.includes("storage") || 
                   lowerFeature.includes("tb") || 
                   lowerFeature.includes("gb ")) && !storage) {
          storage = feature;
        } else if ((lowerFeature.includes("graphics") || 
                   lowerFeature.includes("nvidia") || 
                   lowerFeature.includes("geforce") || 
                   lowerFeature.includes("rtx") || 
                   lowerFeature.includes("gtx") || 
                   lowerFeature.includes("radeon")) && !graphics) {
          graphics = feature;
        }
      });
    }
    
    return { processor, ram, storage, graphics };
  };

  // Filtered and sorted laptop products
  const filteredData = laptopProducts
    .filter((item) => {
      const priceNumber = Number(item.price.toString().replace(/,/g, ""));
      const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;
      
      // Brand filter
      const title = item.title.toLowerCase();
      let brandMatch = true;
      if (selectedBrands.length > 0) {
        brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
      }
      
      // RAM filter (simplified)
      let ramMatch = true;
      if (selectedRAM.length > 0) {
        const specs = getLaptopSpecs(item);
        ramMatch = selectedRAM.some(ram => specs.ram.includes(ram));
      }
      
      // Storage filter (simplified)
      let storageMatch = true;
      if (selectedStorage.length > 0) {
        const specs = getLaptopSpecs(item);
        storageMatch = selectedStorage.some(storage => specs.storage.includes(storage));
      }
      
      // Processor filter (simplified)
      let processorMatch = true;
      if (selectedProcessors.length > 0) {
        const specs = getLaptopSpecs(item);
        processorMatch = selectedProcessors.some(processor => specs.processor.includes(processor));
      }
      
      return priceInRange && brandMatch && ramMatch && storageMatch && processorMatch;
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
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaLaptop className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading laptops...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaLaptop className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load laptop products right now.
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
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Laptops</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover powerful laptops for work, gaming, and creativity
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Laptops</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg"
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
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
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
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processor Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Processor</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2'].map((processor) => (
                    <div key={processor} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`processor-${processor}`}
                        checked={selectedProcessors.includes(processor)}
                        onChange={() => handleProcessorFilter(processor)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`processor-${processor}`} className="ml-2 text-sm text-gray-700">
                        {processor}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* RAM Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">RAM</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['4GB', '8GB', '16GB', '32GB', '64GB'].map((ram) => (
                    <div key={ram} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`ram-${ram}`}
                        checked={selectedRAM.includes(ram)}
                        onChange={() => handleRAMFilter(ram)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`ram-${ram}`} className="ml-1 text-sm text-gray-700">
                        {ram}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Storage</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['256GB', '512GB', '1TB', '2TB'].map((storage) => (
                    <div key={storage} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`storage-${storage}`}
                        checked={selectedStorage.includes(storage)}
                        onChange={() => handleStorageFilter(storage)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`storage-${storage}`} className="ml-1 text-sm text-gray-700">
                        {storage}
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
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
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-purple-600"
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
                  {filteredData.length} of {laptopProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedRAM.length > 0 || selectedStorage.length > 0 || selectedProcessors.length > 0 || priceRange.min > 0 || priceRange.max < 500000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedRAM([]);
                    setSelectedStorage([]);
                    setSelectedProcessors([]);
                    setPriceRange({ min: 0, max: 500000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-purple-600 rounded-lg bg-purple-50 hover:bg-purple-100"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedRAM.length > 0 || selectedStorage.length > 0 || selectedProcessors.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedRAM.map(ram => (
                    <span key={ram} className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      {ram} RAM ×
                    </span>
                  ))}
                  {selectedStorage.map(storage => (
                    <span key={storage} className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      {storage} ×
                    </span>
                  ))}
                  {selectedProcessors.map(processor => (
                    <span key={processor} className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      {processor} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedRAM([]);
                      setSelectedStorage([]);
                      setSelectedProcessors([]);
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaLaptop className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No laptops found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedRAM([]);
                    setSelectedStorage([]);
                    setSelectedProcessors([]);
                    setPriceRange({ min: 0, max: 500000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getLaptopSpecs(item);

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
                            src={item.image || "https://via.placeholder.com/300x300?text=Laptop"}
                            alt={item.title}
                            className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=Laptop";
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
                          <span className="px-2 py-1 text-xs font-medium text-white bg-purple-600 rounded-md shadow-sm">
                            Laptop
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-purple-600">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {specs.processor && (
                              <li className="flex items-center">
                                <FaMicrochip className="w-3.5 h-3.5 mr-2 text-purple-500 flex-shrink-0" />
                                <span className="truncate">{specs.processor}</span>
                              </li>
                            )}
                            {specs.ram && (
                              <li className="flex items-center">
                                <FaMemory className="w-3.5 h-3.5 mr-2 text-purple-500 flex-shrink-0" />
                                <span className="truncate">{specs.ram}</span>
                              </li>
                            )}
                            {specs.storage && (
                              <li className="flex items-center">
                                <FaHdd className="w-3.5 h-3.5 mr-2 text-purple-500 flex-shrink-0" />
                                <span className="truncate">{specs.storage}</span>
                              </li>
                            )}
                            {specs.graphics && (
                              <li className="flex items-center">
                                <FaLaptop className="w-3.5 h-3.5 mr-2 text-purple-500 flex-shrink-0" />
                                <span className="truncate">{specs.graphics}</span>
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
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-purple-600 rounded-lg hover:bg-purple-700 hover:shadow-md"
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

export default Laptops;