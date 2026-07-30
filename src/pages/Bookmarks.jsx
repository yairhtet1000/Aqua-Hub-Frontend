import { BookmarkCheck } from "lucide-react";
import PostCard from "../components/PostCard";
import { posts } from "../data/mockData";

const Bookmarks = () => {
  const savedPosts = posts.filter((post) => post.bookmarked);

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
            {savedPosts.length} saved
          </span>
        </div>
      </div>
      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default Bookmarks;
