import { jwtDecode } from 'jwt-decode'; // تغییر از `import jwtDecode from` به `import { jwtDecode } from`

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // زمان فعلی به ثانیه
    return decoded.exp < currentTime; // اگه زمان انقضا < زمان فعلی، توکن منقضی شده
  } catch (error) {
    return true; // اگه توکن نامعتبر باشه، منقضی فرض کن
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; // ریدایرکت به صفحه ورود
};