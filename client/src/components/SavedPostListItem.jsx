import { Link } from "react-router-dom";
import Image from "./Image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const SavedPostListItem = ({ postId }) => {
  const token = localStorage.getItem('token');

  const { data: post, isPending, error } = useQuery({
    queryKey: ["savedPost", postId],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated!");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
    // مقدار پیش‌فرض برای زمانی که داده هنوز نیست
    initialData: null,
  });

  if (isPending) return <p className="text-gray-600">در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">خطا! لطفا دوباره تلاش کنید.</p>;
  if (!post) return <p className="text-gray-600">پستی یافت نشد.</p>;

  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-12 bg-transparent p-4" dir="rtl">
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/4">
          <Image
            src={post.img}
            alt={post.title || "پست ذخیره‌شده"}
            w={200}
            h={150}
            className="rounded-lg object-cover shadow-md hover:shadow-lg transition-shadow"
          />
        </div>
      )}
      <div className="flex flex-col gap-4 xl:w-3/4">
        <Link to={`/${post.slug}`} className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </Link>
        <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm">
          <span className="flex items-center gap-1">
            <i className="fas fa-user text-blue-400 text-xs"></i> نوشته شده توسط
            <Link to={`/posts?author=${post.user.username}`} className="text-blue-500 hover:underline">
              {post.user.username}
            </Link>
          </span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1">
            <i className="fas fa-tag text-blue-400 text-xs"></i> در دسته
            <Link to={`/posts?cat=${post.category}`} className="text-blue-500 hover:underline">
              {post.category}
            </Link>
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-clock text-blue-400 text-xs"></i> {new Date(post.createdAt).toLocaleString('fa-IR')}
          </span>
        </div>
        <p className="text-gray-700 line-clamp-3">{post.desc}</p>
        <div className="flex items-center gap-4">
          <Link
            to={`/${post.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            <i className="fas fa-arrow-right text-white"></i> بیشتر بدانید
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavedPostListItem;