import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const fetchComments = async (postId) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
  return res.data;
};

const Comments = ({ postId }) => {
  const token = localStorage.getItem('token'); // توکن از localStorage

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      if (!token) throw new Error("Not authenticated!");
      return axios.post(`${import.meta.env.VITE_API_URL}/comments/${postId}`, newComment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "خطا در ارسال نظر");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc"),
    };

    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12" dir="rtl">
      <h1 className="text-xl text-gray-500 underline">نظرات</h1>
      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-8 w-full">
        <textarea
          name="desc"
          placeholder="نظر یا پرسش خود را بنویسید ..."
          className="w-full p-4 rounded-xl"
        />
        <button className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl">
          ارسال
        </button>
      </form>
      {isPending ? (
        "در حال پردازش ..."
      ) : error ? (
        "خطا! لطفا دوباره تلاش کنید"
      ) : (
        <>
          {mutation.isPending && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (در حال ارسال...)`,
                createdAt: new Date(),
                user: {
                  img: "https://example.com/default-user.jpg", // تصویر پیش‌فرض
                  username: "کاربر",
                },
              }}
            />
          )}

          {data.map((comment) => (
            <Comment key={comment._id} comment={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default Comments;