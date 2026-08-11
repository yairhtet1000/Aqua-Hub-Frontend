import { useEffect, useState, useCallback } from "react";
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
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const HomeFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [topContributors, setTopContributors] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (query) params.q = query;
      if (selectedCategory !== "All") params.category = selectedCategory;

      const response = await api.get("/posts", { params });
      setPosts(response.data.data || response.data || []);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const fetchSidebarData = async () => {
      setSidebarLoading(true);
      try {
        const [userRes, contributorsRes] = await Promise.all([
          api.get("/user"),
          api.get("/users/top-contributors"),
        ]);
        setCurrentUser(userRes.data.user || userRes.data);
        setTopContributors(contributorsRes.data || []);
      } catch {
        // sidebar data is non-critical
      } finally {
        setSidebarLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  const updateCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    category === "All"
      ? next.delete("category")
      : next.set("category", category);
    setSearchParams(next);
  };

  const userPostsCount = currentUser?.posts_count ?? 0;
  const userFollowersCount = 0;
  const userFollowingCount = 0;

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
            {["All", "Freshwater", "Saltwater", "Aquascaping", "Planted Tank", "Fish Disease", "Equipment", "DIY", "Shrimp", "Breeding", "Beginner Help"].map((category) => (
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
              src={getImageUrl(currentUser?.avatar) || "https://via.placeholder.com/40"}
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
            {posts.length} posts
          </span>
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
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <p className="text-sm font-semibold">No posts found.</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

      <aside className="sticky top-16 grid self-start gap-6 border-l border-slate-200 pl-5 pt-4 dark:border-slate-800 max-lg:static max-lg:grid-cols-3 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-5 max-md:grid-cols-1">
        {!sidebarLoading && currentUser && (
          <div>
            <div className="flex items-center gap-3">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={getImageUrl(currentUser.avatar) || "https://via.placeholder.com/48"}
                alt=""
              />
              <div>
                <h2 className="font-bold text-slate-950 dark:text-white">{currentUser.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">@{currentUser.name?.replace(/\s/g, "_").toLowerCase()}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
                <strong className="block text-sm font-bold text-slate-950 dark:text-white">{userPostsCount}</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Posts</span>
              </div>
              <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
                <strong className="block text-sm font-bold text-slate-950 dark:text-white">{userFollowersCount}</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Followers</span>
              </div>
              <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-900">
                <strong className="block text-sm font-bold text-slate-950 dark:text-white">{userFollowingCount}</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">Following</span>
              </div>
            </div>
          </div>
        )}

        {sidebarLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        )}

        <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-700" />
            <h2 className="font-bold text-slate-950 dark:text-white">About AquaHub</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            A focused aquarium forum for beginner help, tank journals, disease questions, equipment advice, and breeding logs.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Award size={18} className="text-amber-500" />
            <h2 className="font-bold text-slate-950 dark:text-white">Top contributors</h2>
          </div>
          {sidebarLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
            </div>
          ) : topContributors.length === 0 ? (
            <p className="text-sm text-slate-500">No contributors yet.</p>
          ) : (
            <div className="grid gap-3 text-sm">
              {topContributors.map((contributor, index) => (
                <div className="flex items-center justify-between" key={contributor.id}>
                  <div className="flex items-center gap-2">
                    <img
                      className="h-7 w-7 rounded-full object-cover"
                      src={getImageUrl(contributor.avatar) || "https://via.placeholder.com/28"}
                      alt=""
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {contributor.name}
                    </span>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default HomeFeed;
