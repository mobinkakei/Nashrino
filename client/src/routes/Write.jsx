import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link"; // اختیاری
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import { isTokenExpired, logout } from "../utils/auth";

const Write = () => {
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  // تنظیم ویرایشگر Tiptap
  const editor = useEditor({
    extensions: [StarterKit, Link], // اضافه کردن استارت‌کیت و لینک
    content: '', // محتوای اولیه (می‌تونی از state استفاده کنی)
    onUpdate: ({ editor }) => {
      // ذخیره محتوای جدید تو state یا مستقیماً
      console.log('Content:', editor.getHTML()); // برای دیباگ
    },
  });

  useEffect(() => {
    if (img && editor) {
      editor.commands.insertContent(`<p><img src="${img.url}" alt="Image" style="max-width: 100%;"/></p>`);
    }
  }, [img, editor]);

  useEffect(() => {
    if (video && editor) {
      editor.commands.insertContent(`<p><iframe class="ql-video" src="${video.url}" style="max-width: 100%; height: 300px;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></p>`);
    }
  }, [video, editor]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      if (!token) throw new Error("لطفا ابتدا وارد شوید!");
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("نوشته با موفقیت ایجاد شد");
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data || "خطا در ایجاد نوشته");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: editor ? editor.getHTML() : "", // محتوای Tiptap
    };

    mutation.mutate(data);
  };

  if (!token) {
    return <div className="p-4">لطفا ابتدا وارد شوید!</div>;
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen bg-[#E6E6FF]" dir="rtl">
      <h1 className="text-cl font-light px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">یک نوشته و مطلب بنویسید و نشر دهید</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12 overflow-y-auto">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            بنر یا طرح کاور نوشته خود را بارگذاری کنید
          </button>
        </Upload>
        <input
          className="text-4xl font-semibold bg-transparent outline-none px-2"
          type="text"
          placeholder="عنوان و تیتر مطلب شما"
          name="title"
        />
        <div className="flex items-center gap-4 px-2">
          <label htmlFor="" className="text-sm">
            یک دسته‌بندی را انتخاب کنید
          </label>
          <select name="category" id="" className="p-2 rounded-xl bg-white shadow-md">
            <option value="general">عمومی</option>
            <option value="sciences">علوم نظری</option>
            <option value="tech">فناوری و تکنولوژی</option>
            <option value="religious">مذهبی</option>
            <option value="olympiads">المپیادها</option>
            <option value="culture">فرهنگی هنری</option>
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md px-2"
          name="desc"
          placeholder="توضیح کوتاه و خلاصه مطلب را وارد کنید"
        />
        <div className="flex flex-1 px-2">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <EditorContent
            editor={editor}
            className="flex-1 rounded-xl bg-white shadow-md overflow-y-auto p-2"
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 px-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "در حال پردازش ..." : "ارسال"}
        </button>
        <div className="px-2">پیشرفت: {progress}%</div>
      </form>
    </div>
  );
};

export default Write;