import { Link } from "react-router-dom";
import {
  Bookmark,
  CheckCircle2,
  Flag,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { currentUser, userById } from "../data/mockData";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));

const actionClass =
  "inline-flex h-9 min-w-20 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white";

const PostCard = ({ post }) => {
  const author = userById(post.authorId);
  const isOwner = post.authorId === currentUser.id;

  return (
    <article className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/users/${author.id}`}
            className="flex min-w-0 items-center gap-3"
          >
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={author.avatar}
              alt=""
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-950 dark:text-white">
                {author.name}
              </span>
              <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                {post.category} - {formatDate(post.createdAt)}
              </span>
            </span>
          </Link>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 size={14} />
            Reviewed
          </span>
        </div>

        <Link
          to={`/posts/${post.id}`}
          className="mt-3 block text-xl font-bold leading-tight text-slate-950 hover:text-teal-800 dark:text-white dark:hover:text-teal-300"
        >
          {post.title}
        </Link>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {post.excerpt}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              key={tag}
              to={`/?q=${encodeURIComponent(tag)}`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {post.image && (
        <Link
          to={`/posts/${post.id}`}
          className="block max-h-105 overflow-hidden border-y border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
        >
          <img className="w-full object-cover" src={post.image} alt="" />
        </Link>
      )}

      <div className="flex flex-wrap items-center gap-1 px-3 py-2">
        <button className={actionClass}>
          <Heart size={17} />
          {post.likes}
        </button>
        <Link className={actionClass} to={`/posts/${post.id}`}>
          <MessageCircle size={17} />
          {post.comments.length}
        </Link>
        <button
          className={`${actionClass} ${
            post.bookmarked
              ? "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
              : ""
          }`}
        >
          <Bookmark size={17} />
          Save
        </button>
        <button className={actionClass}>
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
  );
};

export default PostCard;
