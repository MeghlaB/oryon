
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import {
  FaFilter,
  FaEye,
  FaTimes,
  FaTabletAlt,
  FaMicrochip,
  FaMemory,
  FaBatteryFull,
  FaExpand
} from "react-icons/fa";

function Tablets() {
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
    max: 200000,
  });

  // Sort option state
  const [sortOption, setSortOption] = useState("featured");

  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Brand filter state
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Storage filter state
  const [selectedStorage, setSelectedStorage] = useState([]);

  // Screen size filter state
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);

  // Filter only tablet category products
  const tabletProducts = useMemo(() =>
    products.filter((product) => product.category === "Tablet"),
    [products]
  );

  // Get unique brands for filtering
  const brands = useMemo(() => {
    const brandSet = new Set();

    tabletProducts.forEach(product => {
      const title = product.title.toLowerCase();
      if (title.includes("samsung") || title.includes("galaxy tab")) brandSet.add("Samsung");
      else if (title.includes("apple") || title.includes("ipad")) brandSet.add("Apple");
      else if (title.includes("lenovo")) brandSet.add("Lenovo");
      else if (title.includes("huawei")) brandSet.add("Huawei");
      else if (title.includes("xiaomi") || title.includes("mi pad")) brandSet.add("Xiaomi");
      else if (title.includes("microsoft") || title.includes("surface")) brandSet.add("Microsoft");
      else if (title.includes("amazon") || title.includes("kindle") || title.includes("fire")) brandSet.add("Amazon");
      else if (title.includes("realme")) brandSet.add("Realme");
      else if (title.includes("oppo")) brandSet.add("Oppo");
      else if (product.brand) brandSet.add(product.brand);
    });

    return Array.from(brandSet).sort();
  }, [tabletProducts]);

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

  // Handle storage filter
  const handleStorageFilter = (storage) => {
    if (selectedStorage.includes(storage)) {
      setSelectedStorage(selectedStorage.filter(s => s !== storage));
    } else {
      setSelectedStorage([...selectedStorage, storage]);
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

  // Extract tablet specs from product features
  const getTabletSpecs = (product) => {
    let storage = "";
    let screenSize = "";
    let processor = "";
    let battery = "";

    if (product.key_features && Array.isArray(product.key_features)) {
      product.key_features.forEach(feature => {
        const lowerFeature = feature.toLowerCase();
        if ((lowerFeature.includes("gb") ||
          lowerFeature.includes("storage") ||
          lowerFeature.includes("rom")) && !storage) {
          storage = feature;
        } else if ((lowerFeature.includes('"') ||
          lowerFeature.includes("inch") ||
          lowerFeature.includes("display") ||
          lowerFeature.includes("screen")) && !screenSize) {
          screenSize = feature;
        } else if ((lowerFeature.includes("processor") ||
          lowerFeature.includes("snapdragon") ||
          lowerFeature.includes("mediatek") ||
          lowerFeature.includes("dimensity") ||
          lowerFeature.includes("a-series") ||
          lowerFeature.includes("bionic")) && !processor) {
          processor = feature;
        } else if ((lowerFeature.includes("mah") ||
          lowerFeature.includes("battery") ||
          lowerFeature.includes("hour")) && !battery) {
          battery = feature;
        }
      });
    }

    return { storage, screenSize, processor, battery };
  };

  // Filtered and sorted tablet products
  const filteredData = useMemo(() => {
    return tabletProducts
      .filter((item) => {
        const priceNumber = Number(item.price.toString().replace(/,/g, ""));
        const priceInRange = priceNumber >= priceRange.min && priceNumber <= priceRange.max;

        // Brand filter
        const title = item.title.toLowerCase();
        let brandMatch = true;
        if (selectedBrands.length > 0) {
          brandMatch = selectedBrands.some(brand => title.includes(brand.toLowerCase()));
        }

        // Storage filter (simplified)
        let storageMatch = true;
        if (selectedStorage.length > 0) {
          const specs = getTabletSpecs(item);
          storageMatch = selectedStorage.some(storage => specs.storage.includes(storage));
        }

        // Screen size filter (simplified)
        let screenSizeMatch = true;
        if (selectedScreenSizes.length > 0) {
          const specs = getTabletSpecs(item);
          screenSizeMatch = selectedScreenSizes.some(size => specs.screenSize.includes(size));
        }

        return priceInRange && brandMatch && storageMatch && screenSizeMatch;
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
  }, [tabletProducts, priceRange, selectedBrands, selectedStorage, selectedScreenSizes, sortOption]);

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
          <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
            <FaTabletAlt className="w-6 h-6 text-pink-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-4 font-medium text-gray-700 animate-pulse">
          Loading tablets...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-4 bg-red-100 rounded-full shadow-md">
          <FaTabletAlt className="w-12 h-12 text-red-600 animate-bounce" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-red-600">
          Connection Error
        </h2>
        <p className="max-w-sm mt-2 text-center text-gray-600">
          We couldn't load tablet products right now.
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
          <h1 className="mb-3 text-4xl font-bold text-gray-900">Tablets</h1>
          <p className="max-w-2xl mx-auto text-gray-600">
            Discover powerful tablets for work, entertainment, and creativity
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Tablets</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-white bg-pink-600 rounded-lg"
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
                        className="w-4 h-4 text-pink-600 border-gray-300 focus:ring-pink-500"
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
                          className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Storage</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['32GB', '64GB', '128GB', '256GB', '512GB'].map((storage) => (
                    <div key={storage} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`storage-${storage}`}
                        checked={selectedStorage.includes(storage)}
                        onChange={() => handleStorageFilter(storage)}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <label htmlFor={`storage-${storage}`} className="ml-1 text-sm text-gray-700">
                        {storage}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screen Size Filter */}
              <div className="mb-6">
                <h3 className="mb-3 font-medium text-gray-700">Screen Size</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['8"', '10"', '11"', '12"', '13"'].map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`size-${size}`}
                        checked={selectedScreenSizes.includes(size)}
                        onChange={() => handleScreenSizeFilter(size)}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <label htmlFor={`size-${size}`} className="ml-1 text-sm text-gray-700">
                        {size}
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
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
                      className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      min={priceRange.min}
                      max={200000}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({
                      ...prev,
                      max: Number(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-pink-600"
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
                  {filteredData.length} of {tabletProducts.length} products
                </span>
              </div>

              {/* Clear Filters Button */}
              {(selectedBrands.length > 0 || selectedStorage.length > 0 || selectedScreenSizes.length > 0 || priceRange.min > 0 || priceRange.max < 200000) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedStorage([]);
                    setSelectedScreenSizes([]);
                    setPriceRange({ min: 0, max: 200000 });
                  }}
                  className="w-full px-4 py-2 mt-4 text-sm font-medium text-pink-600 rounded-lg bg-pink-50 hover:bg-pink-100"
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
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>

            {/* Active Filters (Mobile) */}
            {(selectedBrands.length > 0 || selectedStorage.length > 0 || selectedScreenSizes.length > 0) && (
              <div className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl lg:hidden">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map(brand => (
                    <span key={brand} className="px-2 py-1 text-xs text-pink-800 bg-pink-100 rounded-full">
                      {brand} ×
                    </span>
                  ))}
                  {selectedStorage.map(storage => (
                    <span key={storage} className="px-2 py-1 text-xs text-pink-800 bg-pink-100 rounded-full">
                      {storage} ×
                    </span>
                  ))}
                  {selectedScreenSizes.map(size => (
                    <span key={size} className="px-2 py-1 text-xs text-pink-800 bg-pink-100 rounded-full">
                      {size} ×
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedStorage([]);
                      setSelectedScreenSizes([]);
                    }}
                    className="text-xs text-pink-600 hover:text-pink-800"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {filteredData.length === 0 ? (
              <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <FaTabletAlt className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mt-4 text-xl font-medium text-gray-900">No tablets found</h3>
                <p className="mt-2 mb-6 text-gray-500">
                  Try adjusting your filters to see more products.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedStorage([]);
                    setSelectedScreenSizes([]);
                    setPriceRange({ min: 0, max: 200000 });
                  }}
                  className="px-6 py-2 text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => {
                  const discount = calculateDiscount(item);
                  const specs = getTabletSpecs(item);

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
                            src={item.image || "https://via.placeholder.com/300x300?text=Tablet"}
                            alt={item.title}
                            className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x300?text=Tablet";
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
                          <span className="px-2 py-1 text-xs font-medium text-white bg-pink-600 rounded-md shadow-sm">
                            Tablet
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Title */}
                        <Link to={`/product/${item._id}`} className="block mb-3 group">
                          <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-pink-600">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Key Specs */}
                        <div className="mb-4">
                          <ul className="space-y-2 text-sm text-gray-700">
                            {specs.storage && (
                              <li className="flex items-center">
                                <FaMemory className="w-3.5 h-3.5 mr-2 text-pink-500 flex-shrink-0" />
                                <span className="truncate">{specs.storage}</span>
                              </li>
                            )}
                            {specs.screenSize && (
                              <li className="flex items-center">
                                <FaExpand className="w-3.5 h-3.5 mr-2 text-pink-500 flex-shrink-0" />
                                <span className="truncate">{specs.screenSize}</span>
                              </li>
                            )}
                            {specs.processor && (
                              <li className="flex items-center">
                                <FaMicrochip className="w-3.5 h-3.5 mr-2 text-pink-500 flex-shrink-0" />
                                <span className="truncate">{specs.processor}</span>
                              </li>
                            )}
                            {specs.battery && (
                              <li className="flex items-center">
                                <FaBatteryFull className="w-3.5 h-3.5 mr-2 text-pink-500 flex-shrink-0" />
                                <span className="truncate">{specs.battery}</span>
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
                            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-pink-600 rounded-lg hover:bg-pink-700 hover:shadow-md"
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

export default Tablets;