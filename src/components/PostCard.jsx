import { useState } from "react";
import { Bookmark, Flag, Heart, MessageCircle, Pencil, Share2, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth, useToast } from "../hooks";
import Avatar from "./Avatar";
import ReportModal from "./ReportModal";
import SafeImage from "./SafeImage";
import { getImageUrl } from "../utils/imageUrl";

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
};

const actionClass =
  "inline-flex min-h-11 min-w-20 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [liked, setLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [bookmarked, setBookmarked] = useState(post.is_saved || false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({
    is_following: post.is_following || false,
    is_friend: false,
  });

  const author = post.user;
  const isOwner = author?.id === user?.id;
  const images = post.images?.length > 0 ? post.images : [];
  const tags = post.tags?.length > 0 ? post.tags : [];
  const categoryName = post.category?.name || post.category || "Uncategorized";

  const handleLike = async () => {
    if (likeLoading) return;
    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked((previous) => !previous);
    setLikesCount((previous) => (liked ? previous - 1 : previous + 1));
    setLikeLoading(true);

    try {
      await api.post(`/posts/${post.id}/like`);
    } catch {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      addToast("Failed to update like.", "error");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleReportSubmitted = () => {
    setShowReport(false);
    addToast("Report submitted. Our team will review it shortly.", "success");
  };

  const handleFollowToggle = async () => {
    if (followLoading || !author) return;

    const previousStatus = { ...followStatus };
    const optimisticFollowing = !followStatus.is_following;
    setFollowStatus({
      is_following: optimisticFollowing,
      is_friend: optimisticFollowing && previousStatus.is_friend,
    });
    setFollowLoading(true);

    try {
      const endpoint = optimisticFollowing
        ? `/users/${author.id}/follow`
        : `/users/${author.id}/unfollow`;
      const response = await api[optimisticFollowing ? "post" : "delete"](endpoint);
      const data = response.data;
      setFollowStatus({ is_following: data.is_following, is_friend: data.is_friend });
      addToast(data.message, "success");
    } catch {
      setFollowStatus(previousStatus);
      addToast("Failed to update follow status.", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (saveLoading) return;
    const previousSaved = bookmarked;
    setBookmarked((previous) => !previous);
    setSaveLoading(true);

    try {
      if (!previousSaved) {
        await api.post(`/posts/${post.id}/save`);
      } else {
        await api.delete(`/posts/${post.id}/save`);
      }
    } catch {
      setBookmarked(previousSaved);
      addToast("Failed to update bookmark.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.content, url: shareUrl });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        addToast("Post link copied.", "success");
      } else {
        addToast("Copying links is not available in this browser.", "error");
      }
    } catch (error) {
      if (error?.name !== "AbortError") addToast("Failed to share this post.", "error");
    }
  };

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition-shadow duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Link
              to={`/users/${author?.id}`}
              className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <Avatar src={author?.avatar} alt={`${author?.name || "User"}, post author`} />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-slate-950 dark:text-white">
                  {author?.name || "Unknown User"}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                  {categoryName} · {formatDate(post.created_at)}
                </span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              {post.status === "published" && (
                <span className="hidden min-h-8 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 sm:inline-flex">
                  Helpful
                </span>
              )}
              {!isOwner && author && (
                <button
                  type="button"
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  aria-pressed={followStatus.is_following}
                  className={[
                    "inline-flex min-h-11 min-w-24 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
                    followStatus.is_following
                      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      : "bg-teal-700 text-white shadow-sm shadow-teal-700/20 hover:bg-teal-800",
                  ].join(" ")}
                >
                  {followLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : followStatus.is_following ? (
                    "Following"
                  ) : (
                    <>
                      <UserPlus size={15} aria-hidden="true" />
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <Link
            to={`/posts/${post.id}`}
            className="mt-4 block break-words font-display text-xl font-bold leading-tight text-slate-950 transition-colors duration-200 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white dark:hover:text-teal-300"
          >
            {post.title}
          </Link>
          <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-3">
            {post.content}
          </p>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-bold text-teal-800 transition hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-teal-950/60 dark:text-teal-200 dark:hover:bg-teal-900"
                  to={`/?q=${encodeURIComponent(tag.name)}`}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div
            className={`grid gap-px border-y border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${
              images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {images.slice(0, 4).map((image, index) => (
              <Link
                key={image.id || image.image_path || index}
                to={`/posts/${post.id}`}
                className={`relative block min-w-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 ${
                  images.length === 1 ? "max-h-[420px]" : "aspect-square"
                }`}
              >
                <SafeImage
                  className="h-full w-full max-w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  src={getImageUrl(image.image_path)}
                  alt={`${post.title} aquarium photo ${index + 1}`}
                />
                {images.length > 4 && index === 3 && (
                  <span className="absolute inset-0 grid place-items-center bg-slate-950/50 text-white">
                    <span className="text-lg font-black">+{images.length - 4}</span>
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1 border-t border-slate-100 p-2 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLike}
            disabled={likeLoading}
            aria-pressed={liked}
            className={`${actionClass} ${liked ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} aria-hidden="true" />
            {likesCount}
          </button>

          <Link
            className={`${actionClass} text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white`}
            to={`/posts/${post.id}`}
          >
            <MessageCircle size={16} aria-hidden="true" />
            {post.comments?.length || 0}
          </Link>

          <button
            type="button"
            onClick={handleBookmark}
            disabled={saveLoading}
            aria-pressed={bookmarked}
            className={`${actionClass} ${bookmarked ? "bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-200 dark:hover:bg-teal-900" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"}`}
          >
            <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} aria-hidden="true" />
            {bookmarked ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className={`${actionClass} ml-auto text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`}
          >
            <Share2 size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReport(true)}
            className={`${actionClass} min-w-11 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`}
            aria-label="Report post"
            title="Report post"
          >
            <Flag size={16} aria-hidden="true" />
            <span className="hidden md:inline">Report</span>
          </button>

          {isOwner && (
            <>
              <Link
                className={`${actionClass} min-w-11 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white`}
                to={`/posts/${post.id}/edit`}
                aria-label="Edit post"
                title="Edit post"
              >
                <Pencil size={16} aria-hidden="true" />
                <span className="hidden md:inline">Edit</span>
              </Link>
              <button
                type="button"
                className={`${actionClass} min-w-11 text-slate-500 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300`}
                aria-label="Delete post"
                title="Delete post"
              >
                <Trash2 size={16} aria-hidden="true" />
                <span className="hidden md:inline">Delete</span>
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
