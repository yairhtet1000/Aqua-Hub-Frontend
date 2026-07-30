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
import { currentUser, posts, userById } from "../data/mockData";

const actionClass =
  "inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-black text-slate-600 transition hover:bg-teal-50 hover:text-teal-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-teal-300";

const PostDetail = () => {
  const { id } = useParams();
  const post = posts.find((item) => item.id === Number(id));

  if (!post) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center font-black text-slate-600 shadow-xl dark:bg-slate-950 dark:text-slate-300">
        Post not found.
      </div>
    );
  }

  const author = userById(post.authorId);
  const isOwner = author.id === currentUser.id;

  return (
    <article className="mx-auto grid w-[min(960px,100%)] gap-5">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/10 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
        <div className="relative h-[min(430px,52vw)] min-h-72 overflow-hidden">
          <img className="h-full w-full object-cover" src={post.image} alt="" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-7 text-white">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
              <Link
                to={`/users/${author.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 font-black backdrop-blur"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={author.avatar}
                  alt=""
                />
                {author.name}
              </Link>
              <Link
                className="rounded-full bg-teal-400/20 px-3 py-1 font-black text-cyan-50 ring-1 ring-white/15"
                to={`/?category=${post.category}`}
              >
                {post.category}
              </Link>
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-7">
        <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">{post.content}</p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 transition hover:bg-teal-50 hover:text-teal-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              key={tag}
              to={`/?q=${tag}`}
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-y border-slate-100 py-4 dark:border-slate-800">
          <button className={actionClass}>
            <Heart size={18} />
            Like post
          </button>
          <button className={actionClass}>
            <Bookmark size={18} />
            Save
          </button>
          <button className={actionClass}>
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
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Comments</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              {post.comments.length}
            </span>
          </div>

          {post.locked ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">
              <Lock size={18} />
              This discussion is locked.
            </div>
          ) : (
            <form className="grid gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
              <textarea
                className="min-h-28 resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                placeholder="Add helpful context, ask for water parameters, or share what worked for your tank"
              />
              <button
                className="inline-flex h-11 w-40 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
                type="button"
              >
                <MessageCircle size={18} />
                Comment
              </button>
            </form>
          )}

          <div className="grid gap-3">
            {post.comments.map((comment) => {
              const commentAuthor = userById(comment.userId);
              return (
                <div
                  className="grid grid-cols-[44px_1fr] gap-3 rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
                  key={comment.id}
                >
                  <img
                    className="h-11 w-11 rounded-full object-cover"
                    src={commentAuthor.avatar}
                    alt=""
                  />
                  <div className="min-w-0">
                    <strong className="text-slate-950 dark:text-white">{commentAuthor.name}</strong>
                    <p className="mt-1 leading-7 text-slate-600 dark:text-slate-300">{comment.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="inline-flex h-9 min-w-24 items-center justify-center gap-2 rounded-full bg-slate-100 px-3 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        <Reply size={15} />
                        Reply
                      </button>
                      {comment.userId === currentUser.id && (
                        <>
                          <button className="h-9 min-w-20 rounded-full bg-slate-100 px-3 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                            Edit
                          </button>
                          <button className="h-9 min-w-20 rounded-full bg-slate-100 px-3 text-sm font-black text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                    {comment.replies.map((reply) => {
                      const replyAuthor = userById(reply.userId);
                      return (
                        <div
                          className="mt-4 grid grid-cols-[36px_1fr] gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900"
                          key={reply.id}
                        >
                          <img
                            className="h-9 w-9 rounded-full object-cover"
                            src={replyAuthor.avatar}
                            alt=""
                          />
                          <div>
                            <strong className="text-sm text-slate-950 dark:text-white">
                              {replyAuthor.name}
                            </strong>
                            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                              {reply.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </article>
  );
};

export default PostDetail;
