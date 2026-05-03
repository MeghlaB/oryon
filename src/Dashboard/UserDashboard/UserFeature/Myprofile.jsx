import { useContext, useEffect, useState } from "react";
import useAxiosPublic from "../../../Hooks/UseAxiosPublic";
import { AuthContext } from "../../../Provider/AuthProvider";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";

// imageBB API Key
const image_hosting_key = import.meta.env.VITE_IMAGEHOSTING;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const [profileData, setProfileData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      photo: null,
    },
  });

  // Fetch user profile and reset form with data
  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get(`/users/profile/${user.email}`)
        .then((res) => {
          setProfileData(res.data);
          // reset form fields with fetched data
          reset({
            name: res.data.name || "",
            photo: null, // file input cannot be set programmatically, so null
          });
        })
        .catch((error) => {

        });
    }
  }, [user?.email, reset, axiosPublic]);

  // Disable background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = openModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openModal]);

  // Submit handler
  const onSubmit = async (data) => {
    try {
      let imageUrl = profileData?.photo || "";

      // If a new image is uploaded
      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imgRes = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (imgRes.data.success) {
          imageUrl = imgRes.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Prepare updated data
      const updatedData = {
        name: data.name,
        email: profileData.email, // email is readonly
        photo: imageUrl,
      };


      // Send update request to backend
      const updateResponse = await axiosPublic.put(
        `/update/${profileData._id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (updateResponse.data.success) {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
        });
        setProfileData(updateResponse.data.user);
        setOpenModal(false);
        // Reset form with new data
        reset({
          name: updateResponse.data.user.name || "",
          photo: null,
        });
      } else {
        throw new Error(updateResponse.data.message || "Update failed");
      }
    } catch (error) {
     

      const errorMessage =
        error.response?.data?.message ||
        (error.response && `Server error: ${error.response.status}`) ||
        error.message ||
        "Failed to update profile";

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <>
      {/* Profile card */}
      <div className="max-w-7xl mx-auto space-y-8 rounded-2xl bg-white px-6 py-8 shadow-md md:max-w-[350px]">
        <div className="relative">
          <img
            className="h-[150px] w-[350px] rounded-2xl bg-gray-500 object-cover"
            src="https://images.unsplash.com/photo-1483347756197-71ef80e95f73?q=80&w=2070"
            alt="Background"
          />
          <img
            className="absolute -bottom-12 left-1/2 h-[100px] w-[100px] -translate-x-1/2 rounded-full border-4 border-white bg-gray-400"
            src={profileData?.photo}
            alt="Profile"
          />
        </div>
        <div className="pt-8 space-y-1 text-center">
          <h1 className="text-xl md:text-2xl">{profileData?.name}</h1>
          <p className="text-sm text-gray-400">{profileData?.role}</p>
          <p className="text-sm text-gray-800">{profileData?.email}</p>
        </div>
        <div className="flex justify-center">
          <button
            className="w-[80%] rounded-full py-2 font-medium text-gray-400 shadow-md duration-300 hover:scale-95 hover:bg-[#0095FF] hover:text-white"
            onClick={() => setOpenModal(true)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[100] grid place-items-center bg-black/30 backdrop-blur transition-opacity duration-200 ${
          openModal ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpenModal(false)}
      >
        <div
          className={`relative my-12 w-full max-w-md transform transition-all duration-200 ${
            openModal ? "scale-100 opacity-100" : "scale-110 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 bg-white shadow-lg rounded-xl sm:p-6">
            <div className="flex justify-end">
              <button
                onClick={() => setOpenModal(false)}
                className="rounded-full p-1.5 hover:bg-gray-100"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <h2 className="mb-6 text-2xl font-semibold text-center text-gray-900">
              Edit Profile
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label className="block mb-1 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Full name is required" })}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={profileData?.email || ""}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border rounded-md cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Profile Photo</label>
                <input
                  type="file"
                  {...register("photo")}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
