import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-screen bg-[#E6E6FF]">
      <Navbar/>
      <Outlet className="flex-1"/>
      <Footer className="relative" />
    </div>
  );
};

export default MainLayout;
