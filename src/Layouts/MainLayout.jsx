import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";

const MainLayout = () => {
  const noHeaderFooter =
    location.pathname.includes("account/login") ||
    location.pathname.includes("account/register");

  return (
    <div>
      <Navbar></Navbar>
      {/* {noHeaderFooter || <Navbar></Navbar>} */}
      <div className="min-h-[calc(100vh-288px)] mb-20">
        <Outlet />
      </div>
      <Footer></Footer>
      {/* {noHeaderFooter || <Footer></Footer>} */}
    </div>
  );
};

export default MainLayout;
