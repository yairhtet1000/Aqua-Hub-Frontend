import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  Flag,
  Heart,
  Lock,
  MessageCircle,
  Pencil,
  Reply,
  Trash2,
} from "lucide-react";
import api from "../api/axios";
import { useAuth, useToast } from "../hooks";
import Avatar from "../components/Avatar";
import {
  FeedSkeleton,
  InlineLoading,
  PageEmptyState,
} from "../components/FeedStates";
import ReportModal from "../components/ReportModal";
import SafeImage from "../components/SafeImage";
import { getImageUrl } from "../utils/imageUrl";

const actionClass =
  "inline-flex min-h-11 min-w-20 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [showPostReport, setShowPostReport] = useState(false);
  const [showCommentReport, setShowCommentReport] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState(null);

  const handleReportSubmitted = () => {
    setShowPostReport(false);
    setShowCommentReport(false);
    setReportingCommentId(null);
    addToast("Report submitted. Our team will review it shortly.", "success");
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/posts/${id}`);
        const postData = response.data;
        setPost(postData);
        setLiked(postData.is_liked || false);
        setLikesCount(postData.likes?.length || 0);
        setBookmarked(postData.is_saved || false);
      } catch {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setCommentsLoading(true);
    try {
      const response = await api.get(`/posts/${id}/comments`);
      setComments(response.data || []);
    } catch {
      addToast("Failed to load comments.", "error");
    } finally {
      setCommentsLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleLike = async () => {
    if (likeLoading || !post) return;

    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
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

  const handleBookmark = async () => {
    if (saveLoading || !post) return;

    const previousSaved = bookmarked;

    setBookmarked((prev) => !prev);
    setSaveLoading(true);

    try {
      if (!previousSaved) {
        await api.post(`/posts/${post.id}/save`);
        addToast("Post saved to bookmarks.", "success");
      } else {
        await api.delete(`/posts/${post.id}/save`);
        addToast("Post removed from bookmarks.", "success");
      }
    } catch {
      setBookmarked(previousSaved);
      addToast("Failed to update bookmark.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !post) return;

    setSubmittingComment(true);
    try {
      await api.post(`/posts/${post.id}/comments`, {
        content: commentContent.trim(),
        post_id: post.id,
        parent_comment_id: null,
      });
      setCommentContent("");
      addToast("Comment added.", "success");
      fetchComments();
    } catch {
      addToast("Failed to add comment.", "error");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim() || !post) return;

    setSubmittingReply(true);
    try {
      await api.post(`/posts/${post.id}/comments`, {
        content: replyContent.trim(),
        post_id: post.id,
        parent_comment_id: parentId,
      });
      setReplyContent("");
      setReplyingTo(null);
      addToast("Reply added.", "success");
      fetchComments();
    } catch {
      addToast("Failed to add reply.", "error");
    } finally {
      setSubmittingReply(false);
    }
  };

  const renderComment = (comment) => {
    const author = comment.user;
    return (
      <div
        className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950"
        key={comment.id}
      >
        <Avatar
          src={author?.avatar}
          alt={`${author?.name || "User"} avatar`}
          sizeClass="h-11 w-11"
          shapeClass="rounded-xl"
        />
        <div className="min-w-0">
          <strong className="text-slate-950 dark:text-white">
            {author?.name || "Unknown User"}
          </strong>
          <p className="mt-1 leading-7 text-slate-600 dark:text-slate-300">
            {comment.content}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Reply size={15} />
              Reply
            </button>
            <button
              onClick={() => {
                setReportingCommentId(comment.id);
                setShowCommentReport(true);
              }}
              className="inline-flex min-h-11 min-w-24 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Flag size={15} />
              Report
            </button>
            {comment.user_id === user?.id && (
              <>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-20 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-20 items-center justify-center rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {replyingTo === comment.id && (
            <form
              onSubmit={(e) => handleSubmitReply(e, comment.id)}
              className="mt-3 grid gap-2"
            >
              <textarea
                className="min-h-24 resize-y rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="inline-flex h-9 items-center justify-center rounded-full bg-teal-700 px-4 text-sm font-black text-white disabled:opacity-60"
                >
                  {submittingReply ? "Replying..." : "Reply"}
                </button>
              </div>
            </form>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-4 grid gap-3">
              {comment.replies.map((reply) => renderReply(reply))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReply = (reply) => {
    const replyAuthor = reply.user;
    return (
      <div
        className="grid grid-cols-[36px_minmax(0,1fr)] gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900"
        key={reply.id}
      >
        <Avatar
          src={replyAuthor?.avatar}
          alt={`${replyAuthor?.name || "User"} avatar`}
          sizeClass="h-9 w-9"
          shapeClass="rounded-lg"
        />
        <div>
          <strong className="text-sm text-slate-950 dark:text-white">
            {replyAuthor?.name || "Unknown User"}
          </strong>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {reply.content}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="mx-auto grid w-full max-w-240 gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Loading post"
      >
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto w-full max-w-240 px-4 sm:px-6 lg:px-8">
        <PageEmptyState
          title="Post unavailable"
          description={error || "This conversation could not be found."}
          actionLabel="Back to feed"
          actionTo="/"
        />
      </div>
    );
  }

  const author = post.user;
  const isOwner = author?.id === user?.id;
  const images = post.images?.length > 0 ? post.images : [];

  return (
    <article className="mx-auto grid w-full max-w-240 gap-5 px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
        {images.length > 0 && (
          <div className="relative h-[min(430px,62vw)] min-h-64 overflow-hidden sm:min-h-72">
            <SafeImage
              className="h-full w-full max-w-full object-cover"
              src={getImageUrl(images[0].image_path)}
              alt={`${post.title} aquarium photo`}
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 to-transparent p-7 text-white">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <Link
                  to={`/users/${author?.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/15 py-1 pl-1 pr-3 font-bold backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  <Avatar
                    src={author?.avatar}
                    alt={`${author?.name || "User"} avatar`}
                    sizeClass="h-8 w-8"
                    shapeClass="rounded-lg"
                  />
                  {author?.name}
                </Link>
                <span className="rounded-full bg-teal-400/20 px-3 py-1 font-black text-cyan-50 ring-1 ring-white/15">
                  {post.category?.name || "Uncategorized"}
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="p-7">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
              <Link
                to={`/users/${author?.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-100 py-1 pl-1 pr-3 font-bold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <Avatar
                  src={author?.avatar}
                  alt={`${author?.name || "User"} avatar`}
                  sizeClass="h-8 w-8"
                  shapeClass="rounded-lg"
                />
                {author?.name}
              </Link>
              <span className="rounded-full bg-teal-400/20 px-3 py-1 font-black text-cyan-50 ring-1 ring-white/15">
                {post.category?.name || "Uncategorized"}
              </span>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {post.title}
            </h1>
          </div>
        )}
      </div>

      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:p-7">
        <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">
          {post.content}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Link
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              key={tag.id}
              to={`/?q=${encodeURIComponent(tag.name)}`}
            >
              #{tag.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-y border-slate-100 py-4 dark:border-slate-800">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`${actionClass} ${liked ? "text-rose-600 dark:text-rose-400" : ""}`}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            {likesCount}
          </button>

          <button
            onClick={handleBookmark}
            disabled={saveLoading}
            className={`${actionClass} ${bookmarked ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300" : ""}`}
          >
            <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
            {bookmarked ? "Saved" : "Save"}
          </button>

          <button
            onClick={() => setShowPostReport(true)}
            className={actionClass}
          >
            <Flag size={18} />
            Report
          </button>
          {isOwner && (
            <>
              <Link className={actionClass} to={`/posts/${post.id}/edit`}>
                <Pencil size={18} />
                Edit
              </Link>
              <button className={actionClass}>
                <Trash2 size={18} />
                Delete
              </button>
            </>
          )}
        </div>

        <section className="grid gap-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
                Discussion
              </p>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                Comments
              </h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {comments.length}
            </span>
          </div>

          {post.locked ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">
              <Lock size={18} />
              This discussion is locked.
            </div>
          ) : (
            <form
              onSubmit={handleSubmitComment}
              className="grid gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900"
            >
              <textarea
                className="min-h-28 resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Add helpful context, ask for water parameters, or share what worked for your tank"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
              <button
                className="inline-flex min-h-11 w-40 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={submittingComment}
              >
                <MessageCircle size={18} />
                {submittingComment ? "Posting..." : "Comment"}
              </button>
            </form>
          )}

          {commentsLoading ? (
            <InlineLoading label="Loading comments" />
          ) : comments.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              No comments yet. Start the discussion!
            </div>
          ) : (
            <div className="grid gap-3">
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </section>
      </div>

      <ReportModal
        isOpen={showPostReport}
        onClose={() => setShowPostReport(false)}
        onReportSubmitted={handleReportSubmitted}
        reportableId={post.id}
        reportableType="App\\Models\\Post"
      />
      <ReportModal
        isOpen={showCommentReport}
        onClose={() => {
          setShowCommentReport(false);
          setReportingCommentId(null);
        }}
        onReportSubmitted={handleReportSubmitted}
        reportableId={reportingCommentId}
        reportableType="App\\Models\\Comment"
      />
    </article>
  );
};

export default PostDetail;
