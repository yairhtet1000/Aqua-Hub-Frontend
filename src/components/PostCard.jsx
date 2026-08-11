import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks";
import { useToast } from "../hooks";
import ReportModal from "./ReportModal";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
};

const actionClass =
  "inline-flex h-9 min-w-20 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white disabled:opacity-60";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [bookmarked, setBookmarked] = useState(
    post.likes?.some((like) => like.id === user?.id) || false
  );

  const author = post.user;
  const isOwner = author?.id === user?.id;

  const images = post.images?.length > 0 ? post.images : [];
  const tags = post.tags?.length > 0 ? post.tags : [];
  const category = post.category;

  const handleLike = async () => {
    if (likeLoading) return;

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    setBookmarked((prev) => !prev);
    setLikeLoading(true);

    try {
      await api.post(`/posts/${post.id}/like`);
    } catch {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      setBookmarked(previousLiked);
      addToast("Failed to update like.", "error");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleReportSubmitted = () => {
    setShowReport(false);
    addToast("Report submitted. Our team will review it shortly.", "success");
  };

  return (
    <>
      <article className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={`/users/${author?.id}`}
              className="flex min-w-0 items-center gap-3"
            >
              <img
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                src={getImageUrl(author?.avatar) || "https://via.placeholder.com/40"}
                alt=""
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-950 dark:text-white">
                  {author?.name || "Unknown User"}
                </span>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {category?.name || "Uncategorized"} -{" "}
                  {formatDate(post.created_at)}
                </span>
              </span>
            </Link>

            {post.status === "published" && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Published
              </span>
            )}
          </div>

          <Link
            to={`/posts/${post.id}`}
            className="mt-3 block text-xl font-bold leading-tight text-slate-950 hover:text-teal-800 dark:text-white dark:hover:text-teal-300"
          >
            {post.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">
            {post.content}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                to={`/?q=${encodeURIComponent(tag.name)}`}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {images.length > 0 && (
          <div
            className={`grid gap-1 border-y border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${
              images.length === 1
                ? "grid-cols-1"
                : images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2"
            }`}
          >
            {images.slice(0, 4).map((img, idx) => (
              <Link
                key={img.id}
                to={`/posts/${post.id}`}
                className={`relative overflow-hidden ${
                  images.length === 1 ? "max-h-105" : "aspect-square"
                }`}
              >
                <img
                  className="h-full w-full object-cover transition hover:scale-105"
                  src={getImageUrl(img.image_path)}
                  alt=""
                />
                {images.length > 4 && idx === 3 && (
                  <div className="absolute inset-0 grid place-items-center bg-black/50 text-white">
                    <span className="text-lg font-black">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1 px-3 py-2">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`${actionClass} ${
              liked ? "text-rose-600 dark:text-rose-400" : ""
            }`}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
            {likesCount}
          </button>

          <Link className={actionClass} to={`/posts/${post.id}`}>
            <MessageCircle size={17} />
            {post.comments?.length || 0}
          </Link>

          <button
            onClick={() => setBookmarked((prev) => !prev)}
            className={`${actionClass} ${
              bookmarked
                ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                : ""
            }`}
          >
            <Bookmark size={17} fill={bookmarked ? "currentColor" : "none"} />
            Save
          </button>

          <button onClick={() => setShowReport(true)} className={actionClass}>
            <Flag size={17} />
            Report
          </button>

          {isOwner && (
            <>
              <Link className={actionClass} to={`/posts/${post.id}/edit`}>
                <Pencil size={17} />
                Edit
              </Link>
              <button className={actionClass}>
                <Trash2 size={17} />
                Delete
              </button>
            </>
          )}
        </div>
      </article>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        onReportSubmitted={handleReportSubmitted}
        reportableId={post.id}
      />
    </>
  );
};

export default PostCard;
