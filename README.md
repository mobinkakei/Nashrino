
---

# 📘 نشرینو

## 🌐 درباره پروژه
**نشرینو** یک پلتفرم وب پیشرفته است که توسط اینجانب، محمدمبین کاکه‌ای، دانش‌آموز سال سوم دبیرستان تیزهوشان شهید بهشتی، سقز، طراحی و توسعه داده شده است. این پروژه با هدف ایجاد یک محیط دیجیتال برای انتشار مقالات، اخبار، و محتوای آموزشی توسط دانش‌آموزان تیزهوشان سقز، و مدیریت پروفایل‌های کاربری، پیاده‌سازی شده است. کل فرآیند طراحی، کدنویسی، و دیپلوی این پروژه به‌صورت مستقل توسط من انجام شده است.

---

## 🛠️ معماری فنی و استک فناوری
پروژه با استفاده از یک معماری فول-استک توسعه یافته است که شامل موارد زیر می‌شود:

### ۱. فرانت‌اند
- **React.js**: فریم‌ورک جاوااسکریپت برای رابط کاربری پویا و تعاملی. از کامپوننت‌های کاربردی مثل `Navbar`، `Write`، و `ProfilePage` استفاده شده است.
- **Vite**: ابزار بیلد و توسعه با سرعت بالا برای ایجاد اپلیکیشن‌های React که عملکرد بهتری نسبت به Create React App داره.
- **TailwindCSS**: فریم‌ورک CSS برای طراحی سریع، واکنش‌گرا، و کاربرپسند با کلاس‌هایی مثل `bg-[#E6E6FF]`، `rounded-2xl`، و `shadow-md`.
- **Tiptap**: ویرایشگر متن پیشرفته برای نوشتن پست‌ها، با اکستنشن‌هایی مثل `Bold`، `Italic`، `Heading`، و `Image`.

#### نمونه کد فرانت‌اند (بخشی از `Write.jsx`):
```javascript
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Upload from "../components/Upload";

const Write = () => {
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    onUpdate: ({ editor }) => console.log('Content:', editor.getHTML()),
  });

  // ... بقیه کد
};
export default Write;
```

### ۲. بک‌اند
- **Node.js & Express.js**: فریم‌ورک سرور برای مدیریت API‌ها و درخواست‌های HTTP.
- **MongoDB**: پایگاه داده NoSQL برای ذخیره اطلاعات کاربران، پست‌ها، و کامنت‌ها.
- **Mongoose**: ODM برای مدیریت مدل‌های MongoDB و تعریف شمای داده‌ها (مثل `User` و `Post`).
- **JSON Web Tokens (JWT)**: برای احراز هویت امن کاربران با ذخیره توکن در `localStorage`.

#### نمونه کد بک‌اند (بخشی از `auth.controller.js`):
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### ۳. ابزارها و سرویس‌ها
- **ImageKit**: برای آپلود و مدیریت تصاویر پروفایل و پست‌ها با API.
- **Liara**: پلتفرم دیپلوی برای میزبانی کلاینت و بک‌اند.
- **Git & GitHub**: برای مدیریت نسخه‌ها و اشتراک‌گذاری کد منبع.

---

## 🎯 ویژگی‌های کلیدی
این پروژه شامل ویژگی‌های فنی و کاربردی زیر است:
- **صفحه اصلی**: نمایش پویای پست‌ها با مرتب‌سازی بر اساس ترند و محبوبیت.
- **نوشتن پست**: امکان آپلود تصویر، استفاده از ویرایشگر Tiptap، و دسته‌بندی پست‌ها.
- **پنل کاربری**: سایدبار تبی برای مدیریت پروفایل، مشاهده و حذف پست‌ها، و ذخیره پست‌ها.
- **احراز هویت**: سیستم ورود/ثبت‌نام با JWT و ریدایرکت امن.
- **طراحی RTL**: پشتیبانی کامل از زبان فارسی با فونت‌های Anjoman.

---

## 🏗️ ساختار پروژه
پروژه در دو بخش کلاینت و بک‌اند سازمان‌دهی شده است:

### کلاینت (`client`)
```
client/
├── src/
│   ├── components/         # کامپوننت‌های UI مثل Navbar، Upload، PostListItem
│   ├── routes/            # روت‌های اپلیکیشن مثل Homepage، Write، ProfilePage
│   ├── layouts/           # لایت‌اوت‌های اصلی مثل MainLayout
│   ├── utils/             # ابزارهای کمکی مثل auth.js
│   ├── index.css          # استایل‌های سراسری با TailwindCSS
│   └── main.jsx           # نقطه ورود React
├── public/                # فایل‌های استاتیک مثل فونت‌های Anjoman
├── package.json           # وابستگی‌ها و اسکریپت‌ها
└── vite.config.js         # تنظیمات Vite
```

### بک‌اند (`server`)
```
server/
├── controllers/           # کنترلرها مثل auth.controller.js، post.controller.js
├── routes/                # روت‌های API مثل auth.routes.js، post.route.js
├── models/                # مدل‌های MongoDB مثل User.js، Post.js
├── index.js               # نقطه ورود سرور
├── .env                   # متغیرهای محیطی (PORT، MONGO_URI، JWT_SECRET)
└── package.json           # وابستگی‌ها و اسکریپت‌ها
```

---

## ⚙️ نصب و راه‌اندازی محلی
برای تجربه این پروژه روی سیستم خودت، مراحل زیر رو دنبال کن:

### ۱. کلون کردن رپوزیتوری
```bash
git clone https://github.com/mobinkakei/Nashrino
cd full-stack-blog
```

### ۲. راه‌اندازی بک‌اند
- به پوشه `server` برو:
  ```bash
  cd server
  npm install
  ```
- فایل `.env` رو بساز و متغیرها رو ست کن (مثال):
  ```
  PORT=3000
  MONGO_URI=mongodb://localhost:27017/blog
  JWT_SECRET=your_secret_key
  VITE_API_URL=http://localhost:3000
  ```
- بک‌اند رو اجرا کن:
  ```bash
  node index.js
  ```
- سرور روی `http://localhost:3000` اجرا می‌شه.

### ۳. راه‌اندازی کلاینت
- به پوشه `client` برو:
  ```bash
  cd ../client
  npm install
  ```
- کلاینت رو اجرا کن:
  ```bash
  npm run dev
  ```
- اپلیکیشن روی `http://localhost:5173` اجرا می‌شه.

---

## 🌐 دیپلوی آنلاین
این پروژه روی پلتفرم **Liara** دیپلوی شده است:
- **کلاینت**: با Vite و تنظیمات `npm run build` روی `https://your-app.liara.run` (لطفاً لینک واقعی‌ات رو بده).
- **بک‌اند**: با Node.js و Express روی همان سرویس Liara.

---

## 📊 عملکرد و بهینه‌سازی
- **اندازه فایل‌ها**: فایل‌های جاوااسکریپت (مثل `index-BaH4cMwC.js`) ممکنه بزرگ باشن (بیش از 500 kB). برای بهینه‌سازی، از `vite.config.js` استفاده کن:
  ```javascript
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  }
  ```
- **فونت‌ها**: فونت‌های Anjoman با `public/` مدیریت می‌شن و بهینه‌سازی شده‌اند.

---

## 👨‍💻 مشخصات توسعه‌دهنده
- **نام و نام خانوادگی**: محمدمبین کاکه‌ای  
- **سن**: ۱۷ سال  
- **مقطع تحصیلی**: سال دوم دبیرستان  
- **مدرسه**: دبیرستان تیزهوشان شهید بهشتی، سقز  
- **شهر و استان**: سقز، کردستان  
- **تماس**: kakeimobin98@gmail.com  


---

## 🔗 لینک‌های مفید
- **لینک آنلاین**: `https://saqqez-nashrino.liara.run/`

---

### 📝 یادداشت‌های توسعه
- پروژه با استفاده از اصول SOLID و بهترین شیوه‌های کدنویسی پیاده‌سازی شده است.
- تست‌های محلی با Postman برای API‌ها و React DevTools برای فرانت‌اند انجام شده.
- دیپلوی با Liara بهینه‌سازی شده تا عملکرد پایداری داشته باشه.

---