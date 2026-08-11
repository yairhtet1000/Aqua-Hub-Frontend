import { useEffect, useState } from "react";
import { BookmarkCheck } from "lucide-react";
import PostCard from "../components/PostCard";
import { useToast } from "../hooks";
import api from "../api/axios";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const fetchSavedPosts = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/user/saved-posts", {
        params: { page: pageNum },
      });
      const data = response.data;
      setPosts(data.data || data);
      setTotalPages(data.last_page || 1);
      setPage(pageNum);
    } catch {
      setError("Failed to load saved posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts(1);
  }, []);

  const handleUnsave = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      addToast("Post removed from saved bookmarks.", "success");
    } catch {
      addToast("Failed to remove bookmark.", "error");
    }
  };

  return (
    <section className="mx-auto grid w-[min(900px,100%)] gap-5">
      <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
        <span className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          <BookmarkCheck size={17} />
          Personal library
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tight">Saved bookmarks</h1>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
            {posts.length} saved
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          No saved posts yet.
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <div key={post.id} className="relative">
              <PostCard post={post} />
              <button
                onClick={() => handleUnsave(post.id)}
                className="absolute right-4 top-4 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Remove
              </button>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => fetchSavedPosts(page - 1)}
                disabled={page <= 1}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => fetchSavedPosts(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Bookmarks;
