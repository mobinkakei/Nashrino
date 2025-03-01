import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // برای لینک ثبت‌نام

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData);
      localStorage.setItem('token', res.data.token); // ذخیره توکن
      window.location.href = '/'; // ریدایرکت به صفحه اصلی
    } catch (err) {
      setError(err.response?.data?.message || 'ورود ناموفق');
    }
  };

  return (
    <div className="min-h-screen bg-[#E6E6FF] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">ورود به حساب کاربری</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                ایمیل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ایمیل خود را وارد کنید"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            ورود
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          حساب کاربری ندارید؟{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;