import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import {
    FaFilter,
    FaMoneyBillWave,
    FaSearchDollar,
    FaShoppingCart,
    FaEye,
    FaStar,
    FaRegStar,
    FaHeart,
    FaShippingFast,
    FaTimes,
    FaChevronDown,
    FaChevronUp,
    FaServer,
    FaHdd,
    FaMemory,
    FaNetworkWired
} from "react-icons/fa";
import useAxiosPublic from "../../Hooks/UseAxiosPublic";

function ServerStorage() {
    const axiosPublic = useAxiosPublic();

    const {
        isLoading,
        isError,
        data: products = [],
    } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await useAxiosPublic.get("/products");
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

    // Filter only server and storage products
    const serverStorageProducts = products.filter((product) =>
        product.category === "Server" || product.category === "Storage" || product.category === "Sever & Storage"
    );

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

    // Filtered and sorted server storage products
    const filteredData = serverStorageProducts
        .filter((item) => {
            const priceNumber = Number(item.price.toString().replace(/,/g, ""));
            return priceNumber >= priceRange.min && priceNumber <= priceRange.max;
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

    // Extract key features for display
    const extractKeyFeatures = (keyFeatures) => {
        if (!keyFeatures || !Array.isArray(keyFeatures)) return [];

        return keyFeatures.slice(0, 3); // Show only first 3 features
    };

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

    // Get appropriate icon based on product type
    const getProductIcon = (product) => {
        if (product.category === "Server") return <FaServer className="text-blue-500" />;
        if (product.category === "Storage") return <FaHdd className="text-purple-500" />;
        return <FaServer className="text-gray-500" />;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
                        <FaServer className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <p className="mt-4 font-medium text-gray-700 animate-pulse">
                    Loading server solutions...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="p-4 bg-red-100 rounded-full shadow-md">
                    <FaServer className="w-12 h-12 text-red-600 animate-bounce" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-red-600">
                    Server Connection Error
                </h2>
                <p className="max-w-sm mt-2 text-center text-gray-600">
                    We couldn't load your server products right now.
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
                    <h1 className="mb-3 text-4xl font-bold text-gray-900">Server & Storage Solutions</h1>
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Enterprise-grade servers and storage solutions for businesses of all sizes
                    </p>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h2 className="text-xl font-semibold text-gray-800">Server & Storage</h2>
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
                                    {filteredData.length} of {serverStorageProducts.length} products
                                </span>
                            </div>
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

                        {/* Products Grid */}
                        {filteredData.length === 0 ? (
                            <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
                                <FaServer className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                                <h3 className="mt-4 text-xl font-medium text-gray-900">No server products found</h3>
                                <p className="mt-2 mb-6 text-gray-500">
                                    Try adjusting your price range to see more products.
                                </p>
                                <button
                                    onClick={() => setPriceRange({ min: 0, max: 500000 })}
                                    className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredData.map((item) => {
                                    const discount = calculateDiscount(item);
                                    const keyFeatures = extractKeyFeatures(item.key_features);

                                    // return (
                                    //     <div
                                    //         key={item._id}
                                    //         className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg group hover:shadow-lg hover:-translate-y-1"
                                    //     >
                                    //         {/* Product Image */}
                                    //         <div className="relative overflow-hidden bg-gray-100">
                                    //             <div className="flex items-center justify-center h-48 bg-gray-200">
                                    //                 {/* Responsive Image */}
                                    //                 <img
                                    //                     src={item.image || "https://via.placeholder.com/300"}
                                    //                     alt={item.title}
                                    //                     className="object-contain w-full h-48 p-2 transition-transform duration-300 group-hover:scale-105"
                                    //                 />
                                    //             </div>

                                    //             {/* Discount Badge */}
                                    //             {discount && (
                                    //                 <div className="absolute top-3 left-3">
                                    //                     <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
                                    //                         {discount}
                                    //                     </span>
                                    //                 </div>
                                    //             )}

                                    //             {/* Quick Actions */}
                                    //             <div className="absolute top-3 right-3">
                                    //                 <button className="p-2 mb-2 transition-colors bg-white rounded-full shadow-md hover:bg-red-50">
                                    //                     <FaHeart className="text-gray-500 hover:text-red-500" />
                                    //                 </button>
                                    //             </div>
                                    //         </div>

                                    //         {/* Product Info */}
                                    //         <div className="p-4">
                                    //             <Link to={`/product/${item._id}`}>
                                    //                 <h3 className="mb-2 text-sm font-semibold text-gray-800 line-clamp-2 hover:text-blue-600">
                                    //                     {item.title}
                                    //                 </h3>
                                    //             </Link>

                                    //             {/* Key Features */}
                                    //             <div className="mb-3">
                                    //                 <ul className="text-xs text-gray-600">
                                    //                     {item.storage && (
                                    //                         <li className="flex items-center mb-1">
                                    //                             <FaHdd className="mr-1 text-gray-400" />
                                    //                             <span>Storage: {item.storage}</span>
                                    //                         </li>
                                    //                     )}
                                    //                     {item.ram && (
                                    //                         <li className="flex items-center mb-1">
                                    //                             <FaMemory className="mr-1 text-gray-400" />
                                    //                             <span>RAM: {item.ram}</span>
                                    //                         </li>
                                    //                     )}
                                    //                     {item.processor && (
                                    //                         <li className="flex items-center mb-1">
                                    //                             <FaServer className="mr-1 text-gray-400" />
                                    //                             <span>Processor: {item.processor}</span>
                                    //                         </li>
                                    //                     )}
                                    //                 </ul>
                                    //             </div>

                                    //             {/* Price Section */}
                                    //             <div className="flex items-center justify-between">
                                    //                 <div>
                                    //                     <span className="text-lg font-bold text-gray-900">
                                    //                         ৳{Number(item.price).toLocaleString()}
                                    //                     </span>
                                    //                     {item.previous_price && (
                                    //                         <span className="ml-2 text-sm text-gray-500 line-through">
                                    //                             ৳{Number(item.previous_price).toLocaleString()}
                                    //                         </span>
                                    //                     )}
                                    //                 </div>

                                    //                 <Link
                                    //                     to={`/product/${item._id}`}
                                    //                     className="px-3 py-1 text-xs font-medium text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                                    //                 >
                                    //                     View Details
                                    //                 </Link>
                                    //             </div>
                                    //         </div>
                                    //     </div>

                                    // );
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
                                                        src={item.image || "https://via.placeholder.com/300x300?text=Server+Storage"}
                                                        alt={item.title}
                                                        className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/300x300?text=Server+Storage";
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
                                                        {item.category}
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

                                                {/* Key Features */}
                                                <div className="mb-4">
                                                    <ul className="space-y-2 text-sm text-gray-700">
                                                        {item.storage && (
                                                            <li className="flex items-center">
                                                                <FaHdd className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">Storage: {item.storage}</span>
                                                            </li>
                                                        )}
                                                        {item.ram && (
                                                            <li className="flex items-center">
                                                                <FaMemory className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">RAM: {item.ram}</span>
                                                            </li>
                                                        )}
                                                        {item.processor && (
                                                            <li className="flex items-center">
                                                                <FaServer className="w-3.5 h-3.5 mr-2 text-blue-500 flex-shrink-0" />
                                                                <span className="truncate">Processor: {item.processor}</span>
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

export default ServerStorage;