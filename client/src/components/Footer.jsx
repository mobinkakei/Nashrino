import { Link } from "react-router-dom";
import Image from "./Image"; // برای لوگوی سایت

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 p-8 mt-12 rounded-t-2xl shadow-xl relative">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* بخش 1: لوگو و لینک‌ها */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-4">
            <Image src="Logo.svg" alt="لوگو نشرینو" w={48} h={48} className="rounded-full object-cover" />
            <span className="text-xl font-bold text-blue-600">لینک‌های مفید.نشرینو</span>
          </Link>
          <div className="flex flex-col gap-2 mt-0">
            <Link to="/posts?sort=trending" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              تــازه ترین مطلب ها
            </Link>
            <Link to="/write" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              شروع به نوشتن
            </Link>
            <Link to="/" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              درباره ما
            </Link>
            <Link to="/profile" className="flex items-center gap-2 hover:text-blue-500 transition-colors">
               حساب کاربری
            </Link>
          </div>
        </div>

        {/* بخش 2: اطلاعات تماس و شبکه‌های اجتماعی */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-xl font-bold text-blue-600">تماس با ما</h3>
          <p className="text-gray-900 flex items-center gap-2 font-normal">
            ایمیل: kakeimobin98@gmail.com
          </p>
          <p className="text-gray-900 flex items-center gap-2 font-normal">
            شماره تماس: 1106 465 0918
          </p>
          <p className="text-gray-900 flex items-center gap-2 font-normal">
            نشانی: کردستان، سقز، دبیرستان تیزهوشان شهید بهشتی
          </p>
        </div>

        {/* بخش 3: کپی‌رایت و اطلاعات اضافی */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-xl font-bold text-blue-600">درباره ما</h3>
          <p className="text-gray-900 font-normal">نشریه الکترونیکی تیزهوشان سقز، مرجعی برای اخبار، مقالات، و محتوای آموزشی با کیفیت در منطقه سقز.</p>
          <p className="text-sm text-gray-900 mt-4 flex items-center gap-2 font-normal">
            © 1403 نشریه الکترونیکی تیزهوشان سقز. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>

      {/* خط جداکننده */}
      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-gray-500 text-sm">
        طراحی و توسعه توسط محمدمبین کاکه‌ای
      </div>
    </footer>
  );
};

export default Footer;