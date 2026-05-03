import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaSpinner, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(9); // 9 items per page for 3x3 grid
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
                    setCurrentPage(1); // Reset to first page on new search
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container px-4 py-8 mx-auto">
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
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FaSpinner className="mb-4 text-4xl text-blue-600 animate-spin" />
                        <p className="text-gray-600">Searching our catalog...</p>
                    </div>
                )}

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
                    </div>
                )}

                {/* Results Grid */}
                {!loading && currentProducts.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {currentProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="overflow-hidden transition-transform duration-300 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1"
                                >
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="object-cover w-full h-48"
                                        />
                                        <div className="p-4">
                                            <h2 className="mb-2 text-lg font-bold text-gray-800 line-clamp-2">
                                                {product.title}
                                            </h2>
                                            <span className="inline-block px-2 py-1 mb-3 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                                                {product.category}
                                            </span>
                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-xl font-semibold text-green-600">
                                                    ${product.price}
                                                </p>
                                                {product.inStock !== false && (
                                                    <span className="text-sm text-green-600">In Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {getDisplayedPages().map((pageNumber, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof pageNumber === 'number' && paginate(pageNumber)}
                                            className={`px-3 py-2 border rounded-md ${currentPage === pageNumber
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
                                        className="px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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