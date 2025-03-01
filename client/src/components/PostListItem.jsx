import { Link } from "react-router-dom";
import Image from "./Image"; // فرض می‌کنم Image از ImageKit هست
import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mb-12 bg-transparent p-4" dir="rtl">
      {/* تصویر پست (کوچکتر) */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/4">
          <Image
            src={post.img} // مسیر ImageKit برای تصویر پست
            alt={post.title}
            w={300} // اندازه کوچکتر (200px عرض)
            h={250} // ارتفاع متناسب
            className="rounded-md object-cover shadow-md hover:shadow-lg transition-shadow"
          />
        </div>
      )}
      {/* جزئیات پست */}
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
        </div>
        <p className="text-gray-700 line-clamp-3">{post.desc}</p>
        <div className="flex items-center gap-4">
          <Link
            to={`/${post.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            بیشتر بدانید <i className="fas fa-arrow-left text-white"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;