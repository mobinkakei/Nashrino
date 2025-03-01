import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8 mt-12">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-blue-800 text-white rounded-full px-4 py-2"
        >
          
        </Link>
        <Link
          to="/posts?cat=sciences"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          علوم نظری
        </Link>
        <Link
          to="/posts?cat=tech"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          فناوری و تکنولوژی
        </Link>
        <Link
          to="/posts?cat=religious"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          مذهبی
        </Link>
        <Link
          to="/posts?cat=olympiads"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          المپیاد ها
        </Link>
        <Link
          to="/posts?cat=calture"
          className="hover:bg-blue-50 rounded-full px-4 py-2"
        >
          فرهنگی هنری
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search/>
    </div>
  );
};

export default MainCategories;
