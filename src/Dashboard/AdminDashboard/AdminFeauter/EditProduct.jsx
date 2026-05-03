
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router-dom";

const EditProduct = () => {
  const axiosPublic = useAxiosPublic();
  const productData = useLoaderData();
  const productId = productData?._id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_features"
  });

  // Form pre-fill when productData loads
  useEffect(() => {
    if (productData) {
      // Ensure key_features is an array with at least one empty string if empty
      const formData = {
        ...productData,
        key_features: productData.key_features && productData.key_features.length > 0
          ? productData.key_features
          : [""]
      };
      reset(formData);
    }
  }, [productData, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Filter out empty key features
      const filteredData = {
        ...data,
        key_features: data.key_features.filter(feature => feature.trim() !== "")
      };

      const res = await axiosPublic.patch(`https://gadgetzone-server.onrender.com/products/${productId}`, filteredData);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: "Info",
          text: "No changes were made to the product",
          icon: "info",
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating the product",
        icon: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    "Desktop", "Laptop", "Mobile", "Camera", "Monitor",
    "UPS", "Tablet", "Component", "Server & Storage", "Accessories"
  ];

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-center">Edit Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Product Title *</label>
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters"
              }
            })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category *</label>
          <select
            {...register("category", { required: "Please select a category" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categoryOptions.map(ct => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
        </div>

        {/* Pricing Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block mb-1 font-semibold">Current Price *</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: {
                  value: 0,
                  message: "Price must be a positive number"
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Previous Price</label>
            <input
              type="number"
              {...register("previous_price", {
                min: {
                  value: 0,
                  message: "Price must be a positive number"
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.previous_price && <p className="mt-1 text-sm text-red-500">{errors.previous_price.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Regular Price</label>
            <input
              type="number"
              {...register("regular_price", {
                min: {
                  value: 0,
                  message: "Price must be a positive number"
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.regular_price && <p className="mt-1 text-sm text-red-500">{errors.regular_price.message}</p>}
          </div>
        </div>

        {/* Discount Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold">Discount (%)</label>
            <input
              type="number"
              {...register("discount", {
                min: {
                  value: 0,
                  message: "Discount cannot be negative"
                },
                max: {
                  value: 100,
                  message: "Discount cannot exceed 100%"
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.discount && <p className="mt-1 text-sm text-red-500">{errors.discount.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-semibold">Save Amount</label>
            <input
              type="number"
              {...register("save_amount", {
                min: {
                  value: 0,
                  message: "Save amount cannot be negative"
                }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.save_amount && <p className="mt-1 text-sm text-red-500">{errors.save_amount.message}</p>}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited Stock">Limited Stock</option>
          </select>
        </div>

        {/* Brand & Model Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 font-semibold">Brand</label>
            <input
              type="text"
              {...register("brand")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Model</label>
            <input
              type="text"
              {...register("model")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Product Code</label>
          <input
            type="text"
            {...register("product_code")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Key Features */}
        <div>
          <label className="block mb-2 font-semibold">Key Features</label>
          <div className="mb-2 text-sm text-gray-500">
            Add the key features of your product. Empty fields will be ignored.
          </div>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                {...register(`key_features.${index}`)}
                placeholder={`Feature #${index + 1}`}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                  aria-label="Remove feature"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="px-4 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            + Add Another Feature
          </button>
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="url"
            {...register("image", {
              pattern: {
                value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i,
                message: "Please enter a valid image URL (png, jpg, jpeg, gif, webp)"
              }
            })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            {...register("description")}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-white rounded-xl ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;