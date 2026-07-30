import { Link, useSearchParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  Filter,
  MessageSquarePlus,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import PostCard from "../components/PostCard";
import {
  categories,
  communityStats,
  currentUser,
  posts,
} from "../data/mockData";

const HomeFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const searchText = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`;
    return (
      matchesCategory && searchText.toLowerCase().includes(query.toLowerCase())
    );
  });

  const updateCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    category === "All"
      ? next.delete("category")
      : next.set("category", category);
    setSearchParams(next);
  };

  return (
    <div className="grid w-full grid-cols-[260px_minmax(0,1fr)_260px] gap-0 max-xl:grid-cols-[240px_minmax(0,1fr)_240px] max-lg:grid-cols-1">
      <aside className="sticky top-16 self-start border-r border-slate-200 pr-5 pt-4 dark:border-slate-800 max-lg:hidden">
        <div>
          <div className="mb-3 flex items-center gap-2 px-2">
            <Filter size={17} className="text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              Browse topics
            </h2>
          </div>
          <div className="grid gap-1 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                className={[
                  "flex h-10 items-center rounded-lg px-3 text-left text-sm font-medium transition",
                  category === selectedCategory
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                ].join(" ")}
                onClick={() => updateCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 px-2 pt-5 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-950 dark:text-white">
            Quick links
          </h2>
          <div className="mt-3 grid gap-1">
            <Link
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              to="/bookmarks"
            >
              <BookOpen size={17} />
              Saved guides
            </Link>
            <Link
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              to="/following"
            >
              <Users size={17} />
              Following
            </Link>
            <Link
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              to="/profile"
            >
              <UserRound size={17} />
              My profile
            </Link>
          </div>
        </div>
      </aside>

      <section className="mx-auto grid w-full max-w-[720px] content-start gap-4 px-5 pt-4 max-lg:px-0">
        <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 max-sm:grid-cols-[40px_1fr]">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={currentUser.avatar}
              alt=""
            />
            <Link
              className="flex h-11 items-center rounded-lg bg-slate-100 px-4 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              to="/create-post"
            >
              Ask a question or share your aquarium
            </Link>
            <Link
              className="inline-flex h-11 min-w-32 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800 max-sm:col-span-2"
              to="/create-post"
            >
              <MessageSquarePlus size={18} />
              Post
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Feed
            </p>
            <h1 className="text-xl font-bold text-slate-950 dark:text-white">
              {selectedCategory === "All"
                ? "Latest discussions"
                : selectedCategory}
            </h1>
          </div>
          <span className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            {filteredPosts.length} posts
          </span>
        </div>

        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>

      <aside className="sticky top-16 grid self-start gap-6 border-l border-slate-200 pl-5 pt-4 dark:border-slate-800 max-lg:static max-lg:grid-cols-3 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-5 max-md:grid-cols-1">
        <div>
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full object-cover"
              src={currentUser.avatar}
              alt=""
            />
            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">
                {currentUser.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{currentUser.username}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
              <strong className="block text-sm font-bold text-slate-950 dark:text-white">
                {currentUser.stats.posts}
              </strong>
              <span className="text-xs text-slate-500 dark:text-slate-400">Posts</span>
            </div>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
              <strong className="block text-sm font-bold text-slate-950 dark:text-white">
                {currentUser.stats.followers}
              </strong>
              <span className="text-xs text-slate-500 dark:text-slate-400">Followers</span>
            </div>
            <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
              <strong className="block text-sm font-bold text-slate-950 dark:text-white">
                {currentUser.stats.comments}
              </strong>
              <span className="text-xs text-slate-500 dark:text-slate-400">Replies</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-700" />
            <h2 className="font-bold text-slate-950 dark:text-white">About AquaHub</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            A focused aquarium forum for beginner help, tank journals, disease
            questions, equipment advice, and breeding logs.
          </p>
          <div className="mt-4 grid gap-2">
            {communityStats.map((stat) => (
              <div
                className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-900"
                key={stat.label}
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</span>
                <strong className="text-sm text-slate-950 dark:text-white">{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <h2 className="font-bold text-slate-950 dark:text-white">Top contributors</h2>
          </div>
          <div className="grid gap-3 text-sm">
            {["reefleo", "nora_scapes", "maya_rivers"].map((name, index) => (
              <div className="flex items-center justify-between" key={name}>
                <span className="font-medium text-slate-700 dark:text-slate-300">@{name}</span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default HomeFeed;
