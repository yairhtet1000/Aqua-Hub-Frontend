import { useEffect, useState } from "react";
import { ArrowUpRight, BookmarkCheck, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../hooks";
import PostCard from "../components/PostCard";
import { FeedSkeleton, PageEmptyState } from "../components/FeedStates";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingId, setRemovingId] = useState(null);
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
      setError("We couldn't load your saved guides right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPosts(1);
  }, []);

  const handleUnsave = async (postId) => {
    setRemovingId(postId);
    try {
      await api.delete(`/posts/${postId}/save`);
      setPosts((previous) => previous.filter((post) => post.id !== postId));
      addToast("Post removed from saved bookmarks.", "success");
    } catch {
      addToast("Failed to remove bookmark.", "error");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-225 gap-5 px-4 sm:px-6 lg:px-8">
      <header className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
            Your library
          </p>
          <h1 className="mt-1 wrap-break-word font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Saved bookmarks
          </h1>
          <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-500 dark:text-slate-400">
            Keep the answers and tank journals you want to revisit.
          </p>
        </div>
        <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          {posts.length} saved
        </span>
      </header>

      {loading ? (
        <div className="grid gap-4" aria-label="Loading saved posts">
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
      ) : error ? (
        <div
          className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="min-w-0 flex-1 wrap-break-word font-medium">{error}</p>
          <button
            type="button"
            onClick={() => fetchSavedPosts(page)}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-bold underline decoration-amber-400 underline-offset-4 transition hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:hover:text-white"
          >
            <RefreshCcw size={14} aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : posts.length === 0 ? (
        <PageEmptyState
          Icon={BookmarkCheck}
          title="Your saved library is empty"
          description="Bookmark a helpful answer from the feed and it will be ready here for your next water change."
          actionLabel="Browse conversations"
          actionTo="/"
        />
      ) : (
        <>
          <div className="grid gap-5">
            {posts.map((post) => (
              <div key={post.id} className="grid gap-2">
                <div className="flex min-h-8 items-center justify-between gap-3 px-1">
                  <span className="text-xs font-medium text-slate-400">
                    Saved from your feed
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUnsave(post.id)}
                    disabled={removingId === post.id}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {removingId === post.id && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Remove from saved
                  </button>
                </div>
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fetchSavedPosts(page - 1)}
                disabled={page <= 1}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => fetchSavedPosts(page + 1)}
                disabled={page >= totalPages}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && posts.length > 0 && (
        <Link
          to="/"
          className="mx-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300 dark:hover:text-teal-100"
        >
          Browse latest conversations
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
};

export default Bookmarks;
