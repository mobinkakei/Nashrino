import { Link, useSearchParams } from "react-router-dom";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };
  const handleCategoryChange = (category) => {
    if (searchParams.get("cat") !== category) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat:category,
      });
    }
  };


  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">جستجو</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">فیلتر مطالب</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          تاره ترین ها
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          محبوب ترین ها
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
           منتخب ها
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          قدیمی ترین ها
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">دسته بندی مطالب</h1>
      <div className="flex flex-col gap-2 text-sm">
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("general")}>همه مطالب</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("sciences")}>علوم نظری</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("tech")}>فناوری و تکنولوژی</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("religious")}>مذهبی</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("olympiads")}>المپیاد ها</span>
        <span className="underline cursor-pointer" onClick={()=>handleCategoryChange("calture")}>فرهنگی هنری</span>
      </div>
    </div>
  );
};

export default SideMenu;
