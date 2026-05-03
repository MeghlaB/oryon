import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { FaTrash, FaEye, FaEdit, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import Swal from "sweetalert2";

function AllUsers() {
    const loadedUsers = useLoaderData();
    const [users, setUsers] = useState(loadedUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    // Handle user deletion
    const handleDeleteUser = (_id, name) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete user: ${name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://gadget-zone-server-ashy.vercel.app/users/${_id}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.deletedCount > 0) {
                            Swal.fire("Deleted!", "User has been deleted.", "success");
                            setUsers((prevUsers) => prevUsers.filter((u) => u._id !== _id));
                        }
                    })
                    .catch(error => {
                        Swal.fire("Error!", "There was a problem deleting the user.", "error");
                        console.error("Delete error:", error);
                    });
            }
        });
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Sort users based on configuration
    const sortedUsers = React.useMemo(() => {
        let sortableItems = [...users];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [users, sortConfig]);

    // Filter users based on search term
    const filteredUsers = sortedUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render sort icon
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-50" />;
        if (sortConfig.direction === 'ascending') return <FaSortUp className="ml-1" />;
        return <FaSortDown className="ml-1" />;
    };

    return (
        <div className="flex flex-col items-center min-h-screen px-4 py-6 bg-gray-50 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:mb-4">
                    User Management
                </h1>

                {/* Stats and Search */}
                <div className="flex flex-col mb-6 gap-y-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center">
                        <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
                        </span>
                        {searchTerm && (
                            <span className="ml-3 text-sm text-gray-600">
                                Search results for "{searchTerm}"
                            </span>
                        )}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    {/* Card layout for small screens */}
                    <div className="divide-y divide-gray-200 md:hidden">
                        {currentUsers.length === 0 ? (
                            <div className="p-6 text-center">
                                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <p className="mt-4 text-gray-600">No users found</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="mt-2 text-blue-600 hover:text-blue-800"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            currentUsers.map((user, index) => (
                                <div key={user._id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={user.photo}
                                                alt={user.name}
                                                className="flex-shrink-0 object-cover w-10 h-10 rounded-full"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/40?text=U";
                                                }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === "admin"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteUser(user._id, user.name)}
                                                className="p-1.5 text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50"
                                                title="Delete User"
                                                aria-label={`Delete user ${user.name}`}
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${user.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {user.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Table layout for medium and larger screens */}
                    <div className="hidden w-full overflow-x-auto md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center">
                                            User {renderSortIcon('name')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th
                                        className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase cursor-pointer"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        <div className="flex items-center">
                                            Joined {renderSortIcon('createdAt')}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center">
                                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <p className="mt-2 text-gray-600">No users found</p>
                                            {searchTerm && (
                                                <button
                                                    onClick={() => setSearchTerm("")}
                                                    className="mt-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    Clear search
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((user) => (
                                        <tr key={user._id} className="transition-colors duration-150 hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                        <img
                                                            src={user.photo}
                                                            alt={user.name}
                                                            className="object-cover w-10 h-10 rounded-full"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/40?text=U";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${user.role === "admin"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        className="p-1.5 text-blue-600 transition-colors duration-200 rounded-full hover:bg-blue-50"
                                                        title="View User"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1.5 text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-50"
                                                        title="Edit User"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        className="p-1.5 text-red-600 transition-colors duration-200 rounded-full hover:bg-red-50"
                                                        title="Delete User"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredUsers.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                                        <span className="font-medium">
                                            {Math.min(indexOfLastUser, filteredUsers.length)}
                                        </span>{" "}
                                        of <span className="font-medium">{filteredUsers.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => paginate(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === pageNumber
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        } border`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AllUsers;