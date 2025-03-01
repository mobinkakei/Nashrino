import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";
import { isTokenExpired, logout } from "../utils/auth";
import Image from "../components/Image";
import SavedPostListItem from "../components/SavedPostListItem";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    nationalId: "",
    phoneNumber: "",
    lastName: "",
    img: "",
  });
  const [profileImg, setProfileImg] = useState("");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("profile"); // تب فعال (profile, saved, posts)
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  // دریافت اطلاعات کاربر از /auth/user
  const { data: user, isPending: userLoading, error: userError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated!");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
    onSuccess: (data) => {
      setUserData({
        username: data.username || "",
        email: data.email || "",
        nationalId: data.nationalId || "",
        phoneNumber: data.phoneNumber || "",
        lastName: data.lastName || "",
        img: data.img || "",
      });
    },
  });

  // دریافت پست‌های ذخیره‌شده از /users/saved
  const { data: savedPosts, isPending: savedPostsLoading, error: savedPostsError } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated!");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // دریافت پست‌های نوشته‌شده توسط کاربر
  const { data: userPosts, isPending: userPostsLoading, error: userPostsError } = useQuery({
    queryKey: ["userPosts", user?.username],
    queryFn: async () => {
      if (!token || !user?.username) throw new Error("Not authenticated or user not found!");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?author=${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.posts; // فرض می‌کنیم posts تو پاسخ داری
    },
    enabled: !!token && !!user?.username,
  });

  // حذف پست با DELETE /posts/:id
  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      if (!token) throw new Error("Not authenticated!");
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts", user?.username] });
      toast.success("پست با موفقیت حذف شد");
    },
    onError: (error) => {
      toast.error(error.response?.data || "خطا در حذف پست");
    },
  });

  // به‌روزرسانی اطلاعات کاربر با PATCH /users/update
  const updateUserMutation = useMutation({
    mutationFn: async (updatedData) => {
      if (!token) throw new Error("Not authenticated!");
      return axios.patch(`${import.meta.env.VITE_API_URL}/users/update`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      setUserData(res.data);
      toast.success("اطلاعات کاربری با موفقیت به‌روزرسانی شد");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "خطا در به‌روزرسانی اطلاعات");
    },
  });

  const handleUserUpdate = (e) => {
    e.preventDefault();
    updateUserMutation.mutate(userData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      Upload.uploadFile(formData, setProgress, setProfileImg);
    }
  };

  if (!token) {
    return <div className="p-4">لطفا ابتدا وارد شوید!</div>;
  }

  if (userLoading || savedPostsLoading || userPostsLoading) {
    return <div className="p-4">در حال بارگذاری...</div>;
  }

  if (userError || savedPostsError || userPostsError) {
    return <div className="p-4 text-red-500">خطا! لطفا دوباره تلاش کنید.</div>;
  }

  return (
    <div className="min-h-screen bg-[#E6E6FF] p-4 md:p-8 lg:p-16 xl:p-32 2xl:p-64 -mt-60 -mb-60">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">پنل کاربری</h1>

      {/* تب‌ها */}
      <div className="mb-6">
        <nav className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium ${activeTab === "profile" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            ویرایش اطلاعات کاربری
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 font-medium ${activeTab === "saved" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            پست‌های ذخیره‌شده
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-medium ${activeTab === "posts" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            پست‌های نوشته‌شده
          </button>
        </nav>
      </div>

      {/* محتوای تب‌ها */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">اطلاعات کاربری</h2>
            {profileImg?.url || userData.img ? (
              <Image
                src={profileImg?.url || userData.img}
                alt="تصویر پروفایل"
                w={100}
                h={100}
                className="rounded-full mb-4 object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-gray-500">
                بدون تصویر
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <form onSubmit={handleUserUpdate} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  نام کاربری
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
                  کد ملی
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={userData.nationalId}
                  onChange={(e) => setUserData({ ...userData, nationalId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  شماره همراه
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? "در حال پردازش ..." : "به‌روزرسانی اطلاعات"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">پست‌های ذخیره‌شده</h2>
            {savedPostsLoading ? (
              <p className="text-gray-600">در حال بارگذاری...</p>
            ) : savedPostsError ? (
              <p className="text-red-500">خطا! لطفا دوباره تلاش کنید.</p>
            ) : savedPosts.length === 0 ? (
              <p className="text-gray-600">پستی ذخیره نشده است.</p>
            ) : (
              savedPosts.map((postId) => (
                <SavedPostListItem key={postId} postId={postId} />
              ))
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">پست‌های نوشته‌شده</h2>
            {userPostsLoading ? (
              <p className="text-gray-600">در حال بارگذاری...</p>
            ) : userPostsError ? (
              <p className="text-red-500">خطا! لطفا دوباره تلاش کنید.</p>
            ) : userPosts.length === 0 ? (
              <p className="text-gray-600">پستی نوشته نشده است.</p>
            ) : (
              userPosts.map((post) => (
                <div key={post._id} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Link to={`/${post.slug}`} className="text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">
                    {post.title}
                  </Link>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.desc}</p>
                  <button
                    onClick={() => deletePostMutation.mutate(post._id)}
                    className="mt-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    disabled={deletePostMutation.isPending}
                  >
                    {deletePostMutation.isPending ? "در حال پردازش ..." : "حذف پست"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;