
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaTrash, FaPlus, FaSpinner, FaEdit, FaEye } from "react-icons/fa";

const AddBannerImg = () => {
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [bannerImgs, setBannerImgs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Fetch banner images
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://gadgetzone-server.onrender.com/bannerImgs");
            setBannerImgs(res.data);
        } catch (err) {
            console.error("Error fetching banner images:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch banners. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Add Banner
    const handleBannerImg = async (e) => {
        e.preventDefault();
        if (!title || !link) return;

        setLoading(true);
        try {
            if (editingId) {
                // Update existing banner
                const res = await axios.put(`https://gadgetzone-server.onrender.com/bannerImg/${editingId}`, {
                    title,
                    url: link,
                });
                
                setBannerImgs(bannerImgs.map(banner => 
                    banner._id === editingId ? res.data : banner
                ));
                
                Swal.fire({
                    icon: "success",
                    title: "Banner Updated",
                    text: "Your banner has been updated successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
                setEditingId(null);
            } else {
                // Add new banner
                const res = await axios.post("https://gadgetzone-server.onrender.com/bannerImg", {
                    title,
                    url: link,
                });

                setBannerImgs([...bannerImgs, res.data]);
                
                Swal.fire({
                    icon: "success",
                    title: "Banner Added",
                    text: "Your banner has been added successfully!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            
            setTitle("");
            setLink("");
            setPreviewImage(null);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to ${editingId ? 'update' : 'add'} banner. Try again!`,
            });
        } finally {
            setLoading(false);
        }
    };

    // Delete Banner
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This banner will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://gadgetzone-server.onrender.com/bannerImg/${id}`);
                    setBannerImgs(bannerImgs.filter((banner) => banner._id !== id));

                    Swal.fire("Deleted!", "The banner has been removed.", "success");
                } catch (err) {
                    Swal.fire("Error!", "Failed to delete banner.", "error");
                }
            }
        });
    };

    // Edit Banner
    const handleEdit = (banner) => {
        setTitle(banner.title);
        setLink(banner.url);
        setPreviewImage(banner.url);
        setEditingId(banner._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Preview image on URL change
    useEffect(() => {
        if (link) {
            setPreviewImage(link);
        }
    }, [link]);

    // Reset form
    const resetForm = () => {
        setTitle("");
        setLink("");
        setPreviewImage(null);
        setEditingId(null);
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
                    <p className="mt-2 text-gray-600">Manage homepage banner images for your e-commerce store</p>
                </div>
                
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Left Side - Add/Edit Banner Form */}
                    <div className="p-6 bg-white shadow-md rounded-xl h-fit">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingId ? "Edit Banner" : "Add New Banner"}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    + Add New
                                </button>
                            )}
                        </div>
                        
                        <form onSubmit={handleBannerImg} className="space-y-5">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Banner Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="E.g. Summer Sale, New Collection"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Banner Image URL
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {previewImage && (
                                <div className="p-3 border rounded-lg bg-gray-50">
                                    <p className="mb-2 text-sm font-medium text-gray-700">Image Preview</p>
                                    <div className="relative w-full h-40 overflow-hidden rounded-md">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="object-contain w-full h-full"
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center ${
                                    loading
                                    ? "bg-indigo-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                } transition-colors duration-200`}
                            >
                                {loading ? (
                                    <>
                                        <FaSpinner className="mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : editingId ? (
                                    "Update Banner"
                                ) : (
                                    "Add Banner"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Right Side - Banner List */}
                    <div className="p-6 bg-white shadow-md rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">All Banners</h2>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {bannerImgs.length} items
                            </span>
                        </div>
                        
                        {loading && bannerImgs.length === 0 ? (
                            <div className="flex items-center justify-center h-40">
                                <FaSpinner className="text-2xl text-indigo-600 animate-spin" />
                                <span className="ml-2 text-gray-600">Loading banners...</span>
                            </div>
                        ) : bannerImgs.length === 0 ? (
                            <div className="py-10 text-center">
                                <div className="mb-2 text-gray-400">
                                    <FaEye className="mx-auto text-4xl" />
                                </div>
                                <p className="font-medium text-gray-600">No banners found</p>
                                <p className="mt-1 text-sm text-gray-500">Add your first banner using the form</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {bannerImgs.map((img) => (
                                    <div
                                        key={img._id}
                                        className="overflow-hidden transition-all duration-200 border border-gray-200 rounded-lg hover:shadow-md"
                                    >
                                        <div className="relative h-40 bg-gray-100">
                                            <img
                                                src={img.url}
                                                alt={img.title}
                                                className="object-contain w-full h-full"
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                                }}
                                            />
                                            <div className="absolute flex space-x-1 top-2 right-2">
                                                <button
                                                    onClick={() => handleEdit(img)}
                                                    className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                    title="Edit banner"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(img._id)}
                                                    className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                    title="Delete banner"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-medium text-gray-800 truncate">{img.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{img.url}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBannerImg;