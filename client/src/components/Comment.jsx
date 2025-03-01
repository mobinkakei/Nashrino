import { format } from "timeago.js";
import Image from "./Image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ comment, postId }) => {
  const token = localStorage.getItem('token'); // توکن از localStorage
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Not authenticated!");
      return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("نظر با موفقیت حذف شد");
    },
    onError: (error) => {
      toast.error(error.response?.data || "خطا در حذف نظر");
    },
  });

  // فرض می‌کنیم نقش (role) رو از دیتابیس یا توکن می‌گیریم (برای الان، اسم کاربر رو چک می‌کنیم)
  const isOwnerOrAdmin = () => {
    // اینجا باید منطق نقش رو بر اساس توکن یا دیتابیس پیاده‌سازی کنی
    // برای الان، فقط با نام کاربری چک می‌کنیم
    const username = localStorage.getItem('username') || 'کاربر'; // فرض کن username تو localStorage ذخیره شده
    return comment.user.username === username || false; // یا نقش admin از توکن
  };

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-8" dir="rtl">
      <div className="flex items-center gap-4">
        {comment.user.img && (
          <Image
            src={comment.user.img}
            className="w-10 h-10 rounded-full object-cover"
            w="40"
          />
        )}
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-sm text-gray-500">{format(comment.createdAt)}</span>
        {token && isOwnerOrAdmin() && (
          <span
            className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
            onClick={() => mutation.mutate()}
          >
            حذف نظر و پرسش
            {mutation.isPending && <span>(در حال پردازش ...)</span>}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p>{comment.desc}</p>
      </div>
    </div>
  );
};

export default Comment;