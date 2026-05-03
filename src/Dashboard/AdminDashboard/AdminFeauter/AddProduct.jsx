import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import Swal from "sweetalert2";
import { time } from "framer-motion";

const AddProduct = () => {
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      key_features: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_features",
  });

  // current date and time 
  const date = new Date();
  const showTime = date.getHours()
    + ':' + date.getMinutes()
    + ":" + date.getSeconds();
  const currentDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const onSubmit = async (data) => {
    const productsData = {
      title: data?.title,
      category: data?.category,
      price: data?.price,
      previous_price: data?.previous_price,
      regular_price: data?.regular_price,
      discount: data?.discount,
      save_amount: data?.save_amount,
      status: data?.status,
      brand: data?.brand,
      key_features: data?.key_features,
      image: data?.image,
      time: showTime,
      date: currentDate,
      product_code: data?.product_code,
      quantity: data?.quantity
    };

    try {
      const productsRes = await axiosPublic.post("/add-products", productsData);

      if (productsRes.data.insertedId) {
        reset();
        Swal.fire({
          title: "Product Added Successfully",
          icon: "success",
          draggable: true,
        });

      }
    } catch (error) {

      Swal.fire({
        title: "Something went wrong!",
        icon: "error",
      });
    }
  };

  const categoryOption = ['Desktop', 'Laptop', 'Mobile','Gaming','Appliance', 'TV','Gadget', 'Camera', 'Monitor', 'UPS', 'Tablet', 'Component', 'Sever & Storage', 'Accessories', 'Networking','Phone', 'Office Equipment', 'Software', "Drone", 'Gimbal', 'Charger Fan', 'Weight Scale', 'Mobile Accessories', 'Portable SSD', 'Portable Wifi Camera', 'Trimmer', 'Smart Watch', 'Action Camera', 'Earphone', 'Earbuds', 'Bluetooth Speakers', 'Gaming Console']
  return (
    <div className="max-w-3xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="mb-6 text-2xl font-bold text-center">
        Add New  Product
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full px-4 py-2 border rounded-lg"
          >

            {
              categoryOption.map(ctOption => <option value={ctOption}>{ctOption}</option>)
            }
          </select>
        </div>

        {/* Price */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Price</label>
            <input
              type="number"
              {...register("price", { required: true })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Previous Price</label>
            <input
              type="number"
              {...register("previous_price")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Regular Price</label>
            <input
              type="number"
              {...register("regular_price")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Discount & Save Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Discount</label>
            <input
              type="text"
              {...register("discount")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Save Amount</label>
            <input
              type="number"
              {...register("save_amount")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Brand</label>
            <input
              type="text"
              {...register("brand")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Model</label>
            <input
              type="text"
              {...register("model")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Product Code</label>
            <input
              type="text"
              {...register("product_code")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Quantity</label>
            <input
              type="text"
              {...register("quantity")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Key Features (dynamic) */}
        <div>
          <label className="block mb-2 font-semibold">Key Features</label>
          {fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                {...register(`key_features.${index}`)}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="px-2 font-bold text-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="mt-2 font-semibold text-blue-500"
          >
            + Add Feature
          </button>
        </div>

        {/* Image URL */}
        <div>
          <label className="block mb-1 font-semibold">Image URL</label>
          <input
            type="url"
            {...register("image")}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Image Preview */}
        {/* <div>
          <label className="block mb-1 font-semibold">Image Preview</label>
          <img
            src="https://www.startech.com.bd/image/cache/catalog/desktop-pc/ryzen-pc/ryzen-7-7700/ryzen-7-7700-01-200x200.webp"
            alt="Preview"
            className="object-contain w-32 h-32 p-1 border rounded"
          />
        </div> */}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 font-semibold text-white bg-blue-600 p text rounded-xl hover:bg-blue-700"
          >
            Submit Product
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default AddProduct;
