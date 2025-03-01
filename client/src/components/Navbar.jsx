import { useState, useEffect } from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import axios from "axios"; // اضافه کن

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // برای چک توکن

  useEffect(() => {
    const token = localStorage.getItem('token'); // چک توکن تو localStorage
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between mt-4 mb-8" dir="rtl">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="Logo.svg" alt="Lama Logo" w={80} h={80} />
        <span>نـشـریـنو</span>
      </Link>
      {/* MOBILE MENU */}
      <div className="md:hidden">
        {/* MOBILE BUTTON */}
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${open && "rotate-45"}`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${open && "opacity-0"}`}
            ></div>
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${open && "-rotate-45"}`}
            ></div>
          </div>
        </div>
        {/* MOBILE LINK LIST */}
        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${open ? "-right-0" : "-right-[100%]"}`}
        >
          <Link to="/" onClick={() => setOpen(false)}>خانه</Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>تازه ترین ها</Link>
          <Link to="/write" onClick={() => setOpen(false)}>شروع به نوشتن</Link>
          <Link to="/" onClick={() => setOpen(false)}>درباره ما</Link>
          <Link to="/profile" onClick={() => setOpen(false)}>حساب کاربری</Link>
          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                وارد شوید 👋
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('token'); // خروج کاربر
                setIsAuthenticated(false);
                setOpen(false);
              }}
              className="py-2 px-4 rounded-3xl bg-red-600 text-white"
            >
              خروج
            </button>
          )}
        </div>
      </div>
      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">خانه</Link>
        <Link to="/posts?sort=trending">تازه‌نشریه</Link>
        <Link to="/posts?sort=popular">پربازدیدترین‌ها</Link>
        <Link to="/">درباره ما</Link>
        <Link to="/profile">حساب کاربری</Link>
        {!isAuthenticated ? (
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              وارد شوید 👋
            </button>
          </Link>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }}
            className="py-2 px-4 rounded-3xl bg-red-600 text-white"
          >
            خروج
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;