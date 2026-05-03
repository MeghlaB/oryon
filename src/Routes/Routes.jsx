import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import Desktop from "../Shared/Desktop/Desktop";
import Laptop from "../Shared/Laptop/Laptop";
import Component from "../Shared/Component/Component";
import Monitor from "../Shared/Monitor/Monitor";
import UPS from "../Shared/UPS/UPS";
import Phone from "../Shared/Phone/Phone";
import Tablet from "../Shared/Tablet/Tablet";
import OfficeEqupment from "../Shared/Office_Equpement/OfficeEqupment";
import Camera from "../Shared/Camera/Camera";
import Sequrity from "../Shared/Sequrity/Sequrity";
import Networking from "../Shared/Networking/Networking";
import Gamming from "../Shared/Gamming/Gamming";
import Software from "../Shared/Software/Software";
import Gadget from "../Shared/Gadget/Gadget";
import Dashboard from "../Dashboard/Dashboard";
import AdminHome from "../Dashboard/AdminDashboard/AdminFeauter/AdminHome";
import AddProduct from "../Dashboard/AdminDashboard/AdminFeauter/AddProduct";
import PrivateRoutes from "./PrivateRoutes";
import ProductDetails from "../Components/ProductDetails/ProductDetails";
import ErrorPage from "../Components/ErrorPage.jsx/ErrorPage";
import EditProduct from "../Dashboard/AdminDashboard/AdminFeauter/EditProduct";
import Accessories from "../Shared/Accessories/Accessories";
import AllProduct from "../Dashboard/AdminDashboard/AdminFeauter/AllProduct";
import SellerDashboard from "../Dashboard/SellerDashboard/SellerDashboard";
import SellerHome from "../Dashboard/SellerDashboard/SellerFeature/SellerHome";
import Checkoutoders from "../Components/Checkout/Checkoutoders";

import UserHome from "../Dashboard/UserDashboard/UserFeature/UserHome";
import Mycarts from "../Dashboard/UserDashboard/UserFeature/Mycarts";
import MyProfile from "../Dashboard/UserDashboard/UserFeature/Myprofile";

import SearchResults from "../Pages/SearchResults";

import AllUsers from "../Dashboard/AdminDashboard/AdminFeauter/AllUsers";
import AddBannerImg from "../Dashboard/AdminDashboard/AdminFeauter/AddBannerImg";
import PaymentSucces from "../Components/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../Components/PaymentFailed/PaymentFailed";
import ServerStorage from "../Shared/ServerStorage/ServerStorage";
import TV from "../Shared/Tv/Tv";
import Orders from "../Dashboard/AdminDashboard/AdminFeauter/Orders";
import Myorders from "../Dashboard/UserDashboard/UserFeature/Myorders";
import ProductGrid from "../Components/AllProducts/AllProducts";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      // submenu category
      {
        path: "/allproducts",
        element: <ProductGrid></ProductGrid>,
        loader: () => fetch("https://gadgetzone-server.onrender.com/products"),
        
      },
      {
        path: "/desktop",
        element: <Desktop />,
      },
      {
        path: "/laptop",
        element: <Laptop />,
      },
      {
        path: "/component",
        element: <Component />,
      },
      {
        path: "/monitor",
        element: <Monitor />,
      },
      {
        path: "/ups",
        element: <UPS />,
      },
      {
        path: "/phone",
        element: <Phone />,
      },
      {
        path: "/tablet",
        element: <Tablet />,
      },
      {
        path: "/office-equipment",
        element: <OfficeEqupment />,
      },
      {
        path: "/camera",
        element: <Camera />,
      },
      {
        path: "/security",
        element: <Sequrity />,
      },
      {
        path: "/networking",
        element: <Networking />,
      },
      {
        path: "/gaming",
        element: <Gamming />,
      },
      {
        path: "/software",
        element: <Software />,
      },
      {
        path: "/gadget",
        element: <Gadget />,
      },
      {
        path: "/accessories",
        element: <Accessories />,
      },
      {
        path: "/appliance",
        element: <Accessories />,
      },
      {
        path: "/server-storage",
        element: <ServerStorage />,
      },
      {
        path: "/tv",
        element: <TV></TV>
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },

      {
        path: "/search",
        element: <SearchResults />,
      },
      // <Route path="/search" element={<SearchResults />} />
      {
        path: "/checkout/checkoders/:id",
        element: <Checkoutoders />,
      },
      {
        path: "/payment/success/:tranId",
        element: <PaymentSucces />,
      },
      {
        path: "/payment/fail/:tranId",
        element: <PaymentFailed />,
      },
      {
        path: "account/login",
        element: <Login></Login>,
      },
      {
        path: "account/register",
        element: <Register></Register>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <Dashboard></Dashboard>
      </PrivateRoutes>
    ),
    children: [
      // admin dashboard
      {
        path: "adminhome",
        element: <AdminHome />,
        loader: () => fetch("https://gadgetzone-server.onrender.com/products"),
      },
      {
        path: "allproduct",
        element: <AllProduct></AllProduct>,
        loader: () => fetch("https://gadgetzone-server.onrender.com/products"),
      },
      {
        path: "addproduct",
        element: <AddProduct></AddProduct>,
      },
      {
        path: "editproduct/:id",
        element: <EditProduct />,
        loader: async ({ params }) => {
          // params.id contains the dynamic :id from URL
          const res = await fetch(`https://gadgetzone-server.onrender.com/products/${params.id}`);
          if (!res.ok) {
            throw new Error("Failed to load product");
          }
          const product = await res.json();
          return product; // this will be available via useLoaderData()
        },

      },
      {
        path: "addbannerimg",
        element: <AddBannerImg></AddBannerImg>,
      },
      {
        path: "orders",
        element:<Orders></Orders>,
      },
      {
        path: "users",
        loader: async () =>
          fetch("https://gadgetzone-server.onrender.com/users"),
        element: <AllUsers></AllUsers>,
      },

      // seleer dashboard
      {
        path: "sellerhome",
        element: <SellerHome></SellerHome>,
      },

      // user dashboard
      {
        path: "user-home",
        element: <UserHome />,
      },
      {
        path: "my-carts",
        element: <Mycarts />,
      },
      {
        path: "user-profile",
        element: <MyProfile />,
      },
      {
        path: "current-orders",
        element: <Myorders />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
]);
