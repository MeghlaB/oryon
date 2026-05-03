import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { 
  FaSearch, 
  FaExclamationTriangle, 
  FaArrowLeft, 
  FaMicrochip, 
  FaMemory, 
  FaHdd, 
  FaGamepad, 
  FaEye 
} from "react-icons/fa";

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(16); // Changed to 16 products per page
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      setError(null);
      axios
        .get(`https://gadget-zone-server-ashy.vercel.app/search?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => {
          setResults(res.data);
          setTotalProducts(res.data.length);
          setCurrentPage(1);
        })
        .catch((err) => {
          setError("Failed to fetch search results. Please try again later.");
          console.error("Search error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
      setTotalProducts(0);
    }
  }, [searchQuery]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = results.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Show limited page numbers with ellipsis
  const getDisplayedPages = () => {
    if (totalPages <= 5) return pageNumbers;
    
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  // Extract specs from product
  const extractSpecs = (product) => {
    const specs = {
      processor: product.processor || product.cpu || "",
      ram: product.ram || product.memory || "",
      storage: product.storage || product.hdd || product.ssd || "",
      graphics: product.graphics || product.gpu || ""
    };
    
    // If no explicit specs, try to extract from description
    if (!specs.processor && product.description) {
      const desc = product.description.toLowerCase();
      if (desc.includes('intel') || desc.includes('amd') || desc.includes('ryzen') || desc.includes('core')) {
        specs.processor = product.description.split('.').find(line => 
          line.toLowerCase().includes('intel') || 
          line.toLowerCase().includes('amd') || 
          line.toLowerCase().includes('processor') || 
          line.toLowerCase().includes('cpu')
        ) || "";
      }
    }
    
    return specs;
  };

  // Custom Loading Component
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-20 rounded-lg bg-gray-50">
      {/* Outer ring */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>

        {/* Inner circuit icon */}
        <div className="absolute flex items-center justify-center bg-white rounded-full shadow-md inset-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-blue-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            {/* Circuit board icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4m4-6h.01M16 6h.01M16 18h.01M8 18h.01"
            />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      <p className="mt-4 font-medium text-gray-700 animate-pulse">
        Powering up your gadgets...
      </p>
      
      {/* Search term display */}
      {searchQuery && (
        <p className="mt-2 text-sm text-gray-500">
          Searching for: <span className="font-semibold">"{searchQuery}"</span>
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto md:mt-28">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link 
            to="/" 
            className="flex items-center mr-4 text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
        </div>

        {/* Search Info */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <FaSearch className="mr-3 text-gray-500" />
            <p className="text-lg">
              {searchQuery ? (
                <>
                  Results for: <span className="font-semibold">"{searchQuery}"</span>
                </>
              ) : (
                "Enter a search term to find products"
              )}
            </p>
          </div>
          {totalProducts > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Found {totalProducts} product{totalProducts !== 1 ? 's' : ''}
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingAnimation />}

        {/* Error State */}
        {error && (
          <div className="p-6 mb-6 rounded-lg bg-red-50">
            <div className="flex items-center mb-3">
              <FaExclamationTriangle className="mr-2 text-red-500" />
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && results.length === 0 && searchQuery && (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <FaSearch className="mx-auto mb-4 text-4xl text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-600">
              We couldn't find any products matching "{searchQuery}". Try different keywords or browse our categories.
            </p>
            <Link
              to="/"
              className="inline-block px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Results Grid - 4 columns for 16 products (4x4 grid) */}
        {!loading && currentProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {currentProducts.map((item) => {
                const specs = extractSpecs(item);
                
                return (
                  <div
                    key={item._id}
                    className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl group hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Product Image Container */}
                    <div className="relative overflow-hidden">
                      <div className="flex items-center justify-center h-48">
                        <img
                          src={item.image || "https://via.placeholder.com/300x300?text=Product"}
                          alt={item.title}
                          className="object-contain w-full h-48 p-4 transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x300?text=Product";
                          }}
                        />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md shadow-sm">
                          {item.category || "Product"}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Title */}
                      <Link to={`/product/${item._id}`} className="block mb-3 group">
                        <h3 className="text-base font-semibold leading-tight text-gray-900 transition-colors duration-200 line-clamp-2 group-hover:text-green-600">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Key Specs */}
                      <div className="mb-4">
                        <ul className="space-y-2 text-sm text-gray-700">
                          {specs.processor && (
                            <li className="flex items-center">
                              <FaMicrochip className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" />
                              <span className="truncate">{specs.processor}</span>
                            </li>
                          )}
                          {specs.ram && (
                            <li className="flex items-center">
                              <FaMemory className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" />
                              <span className="truncate">{specs.ram}</span>
                            </li>
                          )}
                          {specs.storage && (
                            <li className="flex items-center">
                              <FaHdd className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" />
                              <span className="truncate">{specs.storage}</span>
                            </li>
                          )}
                          {specs.graphics && (
                            <li className="flex items-center">
                              <FaGamepad className="w-3.5 h-3.5 mr-2 text-green-500 flex-shrink-0" />
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
                          className="flex items-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700 hover:shadow-md"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex flex-wrap items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getDisplayedPages().map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                      className={`px-3 py-2 min-w-[2.5rem] border rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      } ${typeof pageNumber !== 'number' ? 'cursor-default hover:bg-white' : ''}`}
                      disabled={typeof pageNumber !== 'number'}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Empty Search */}
        {!searchQuery && !loading && (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <FaSearch className="mx-auto mb-4 text-4xl text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">Start Searching</h3>
            <p className="text-gray-600">
              Use the search bar to find products in our catalog. Try searching for product names, categories, or brands.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;