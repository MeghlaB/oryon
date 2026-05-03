import React, { useContext, useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Provider/AuthProvider";

function AllProduct() {
  const loadedProducts = useLoaderData();
  const [products, setProduct] = useState(loadedProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Get unique categories for filter dropdown
  const categories = ["All Categories", ...new Set(products.map(product => product.category))];

  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All Categories" || product.category === categoryFilter;

    const matchesStatus = statusFilter === "All Status" ||
      (statusFilter === "In Stock" ? product.status === "In Stock" : product.status !== "In Stock");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://gadgetzone-server.onrender.com/products/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount > 0) {
              Swal.fire("Deleted!", "Product has been deleted.", "success");
              const remaining = products.filter((p) => p._id !== _id);
              setProduct(remaining);
            }
          });
      }
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <div>
            <h1 className="text-xl font-bold text-gray-800 md:text-2xl">Product Management</h1>
            <p className="text-xs text-gray-500 md:text-sm">Manage your product inventory</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden text-sm font-medium text-gray-700 md:block">{user?.displayName}</div>
            <div className="avatar">
              <div className="w-8 h-8 rounded-full md:w-10 md:h-10 ring-2 ring-blue-500 ring-offset-2">
                <img src={user?.photoURL} alt="admin" className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {/* Stats and Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4 md:gap-6">
          <div className="p-4 bg-white rounded-lg shadow-sm md:p-5">
            <div className="text-2xl font-bold text-blue-600 md:text-3xl">{products.length}</div>
            <div className="text-xs font-medium text-gray-500 md:text-sm">Total Products</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm md:p-5">
            <div className="text-2xl font-bold text-green-600 md:text-3xl">
              {products.filter(p => p.status === "In Stock").length}
            </div>
            <div className="text-xs font-medium text-gray-500 md:text-sm">In Stock</div>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm md:p-5">
            <div className="text-2xl font-bold text-red-600 md:text-3xl">
              {products.filter(p => p.status !== "In Stock").length}
            </div>
            <div className="text-xs font-medium text-gray-500 md:text-sm">Out of Stock</div>
          </div>

          <div className="col-span-2 p-4 bg-white rounded-lg shadow-sm md:col-span-1 md:p-5">
            <Link
              to="/dashboard/addproduct"
              className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-blue-600 rounded-lg md:px-4 md:text-base hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products by name or category..."
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile filter toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <FaFilter className="mr-2" />
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Desktop filters */}
            <div className="hidden gap-2 md:flex">
              <select
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {(searchTerm !== "" || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Mobile filters dropdown */}
          {isFilterOpen && (
            <div className="mt-4 space-y-3 md:hidden">
              <select
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              {(searchTerm !== "" || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {(searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status") &&
              " (filtered)"}
          </p>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-4 mb-6 lg:hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center bg-white rounded-lg shadow-sm md:p-8">
              <div className="mb-2 text-gray-400">
                <FaSearch className="mx-auto text-3xl" />
              </div>
              <p className="font-medium text-gray-600">No products found</p>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
              {(searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 mt-4 text-sm text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p._id}
                className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-cover w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{p.title}</h3>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <p className="font-medium text-blue-600">৳{p.price}</p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {p.status}
                      </span>
                      <span className="ml-3 text-xs text-gray-500">
                        Qty: {p.quantity}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">{p?.date} • {p?.time}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/product/${p._id}`}
                    className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/dashboard/editproduct/${p._id}`}
                    className="p-2 text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Product</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Category</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Price</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Status</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Quantity</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6">Added</th>
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase md:px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center md:px-6 md:py-8">
                      <div className="mb-2 text-gray-400">
                        <FaSearch className="mx-auto text-3xl" />
                      </div>
                      <p className="font-medium text-gray-600">No products found</p>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
                      {(searchTerm || categoryFilter !== "All Categories" || statusFilter !== "All Status") && (
                        <button
                          onClick={resetFilters}
                          className="px-4 py-2 mt-4 text-sm text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100"
                        >
                          Reset Filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap md:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="object-cover w-10 h-10 rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap md:px-6">
                        {p.category}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-blue-600 whitespace-nowrap md:px-6">
                        ৳{p.price}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap md:px-6">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${p.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap md:px-6">
                        {p.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap md:px-6">
                        <div>{p?.date}</div>
                        <div className="text-xs text-gray-400">{p?.time}</div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap md:px-6">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/product/${p._id}`}
                            className="p-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          <Link
                            to={`/dashboard/editproduct/${p._id}`}
                            className="p-2 text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200"
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllProduct;