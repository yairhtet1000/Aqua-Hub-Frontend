import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Award,
  ArrowUpRight,
  Bookmark,
  Filter,
  Info,
  MessageSquarePlus,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import { FeedEmptyState, FeedSkeleton } from "../components/FeedStates";
import { categories } from "../data/mockData";

const topicItems = ["All", ...categories];

const HomeFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [topContributors, setTopContributors] = useState([]);
  const [communityPulse, setCommunityPulse] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (query) params.q = query;
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }

      const response = await api.get("/posts", { params });
      setPosts(response.data.data || response.data || []);
    } catch {
      setError("We couldn't refresh the latest conversations.");
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

      const [userResult, contributorsResult, pulseResult] =
        await Promise.allSettled([
          api.get("/user"),
          api.get("/users/top-contributors"),
          api.get("/community-pulse"),
        ]);

      if (userResult.status === "fulfilled") {
        const userData = userResult.value.data;
        setCurrentUser(userData.user || userData.data || userData);
      }

      if (contributorsResult.status === "fulfilled") {
        const contributorData = contributorsResult.value.data;
        setTopContributors(contributorData.data || contributorData || []);
      }

      if (pulseResult.status === "fulfilled") {
        const pulseData = pulseResult.value.data;
        setCommunityPulse(pulseData.data || pulseData || null);
      }

      setSidebarLoading(false);
    };

    fetchSidebarData();
  }, []);

  const updateCategory = (category) => {
    const next = new URLSearchParams(searchParams);
    if (category === "All") {
      next.delete("category");
    } else {
      next.set("category", category);
    }
    setSearchParams(next);
  };

  const resetFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    next.delete("category");
    setSearchParams(next);
  };

  const savedPostsCount = useMemo(
    () => posts.filter((post) => post.is_saved).length,
    [posts],
  );
  const userPostsCount = currentUser?.posts_count ?? 0;
  const userFollowersCount = currentUser?.followers_count ?? 0;
  const userFollowingCount = currentUser?.following_count ?? 0;

  const handlePostDeleted = useCallback((postId) => {
    setPosts((previous) => previous.filter((post) => post.id !== postId));
  }, []);

  return (
    <main className="mx-auto w-full max-w-360 min-w-0 px-4 pb-24 pt-5 sm:px-6 md:pb-8 lg:px-8">
      <div
        className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden"
        aria-label="Mobile topic filters"
      >
        {topicItems.slice(0, 5).map((category) => {
          const isActive = category === selectedCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => updateCategory(category)}
              className={[
                "min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
                isActive
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300",
              ].join(" ")}
            >
              {category === "All" ? "All topics" : category}
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px] xl:grid-cols-[230px_minmax(0,720px)_280px]">
        <aside
          className="hidden min-w-0 self-start lg:sticky lg:top-23 lg:block"
          aria-label="Browse topics"
        >
          <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Browse topics
              </h2>
              <SlidersHorizontal
                size={16}
                className="text-slate-400"
                aria-hidden="true"
              />
            </div>
            <div className="grid gap-1">
              {topicItems.map((category) => {
                const isActive = category === selectedCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => updateCategory(category)}
                    className={[
                      "flex min-h-11 items-center justify-between rounded-xl px-3 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                      isActive
                        ? "bg-teal-50 font-bold text-teal-800 dark:bg-teal-950/50 dark:text-teal-200"
                        : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                    ].join(" ")}
                  >
                    <span>{category === "All" ? "All topics" : category}</span>
                    {isActive && category === "All" && (
                      <span className="rounded-md bg-white px-2 py-1 text-[11px] font-bold text-teal-700 dark:bg-slate-900 dark:text-teal-300">
                        {posts.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-5">
            <h2 className="px-1 font-display text-sm font-bold text-slate-950 dark:text-white">
              Quick links
            </h2>
            <div className="mt-2 grid gap-1">
              <Link
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                to="/bookmarks"
              >
                <Bookmark
                  size={16}
                  className="text-teal-700 dark:text-teal-300"
                  aria-hidden="true"
                />
                Saved guides
              </Link>
              <Link
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                to="/following"
              >
                <Users
                  size={16}
                  className="text-teal-700 dark:text-teal-300"
                  aria-hidden="true"
                />
                Following
              </Link>
              <Link
                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                to="/profile"
              >
                <UserRound
                  size={16}
                  className="text-teal-700 dark:text-teal-300"
                  aria-hidden="true"
                />
                My profile
              </Link>
            </div>
          </div>
        </aside>

        <section className="min-w-0 space-y-4" aria-label="AquaHub feed">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar
                src={currentUser?.avatar}
                alt={`${currentUser?.name || "Your"} avatar`}
                sizeClass="h-11 w-11"
              />
              <Link
                className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl bg-slate-50 px-4 text-sm font-medium text-slate-500 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                to="/create-post"
              >
                <span className="truncate">
                  Ask a question or share your aquarium…
                </span>
              </Link>
              <Link
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition-all duration-200 hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 max-sm:px-3"
                to="/create-post"
              >
                <MessageSquarePlus size={16} aria-hidden="true" />
                <span className="hidden sm:inline">Create post</span>
                <span className="sm:hidden">Post</span>
              </Link>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 px-1">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
                AquaHub community
              </p>
              <h1 className="wrap-break-word font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Latest conversations
              </h1>
              {query && (
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  Showing results for “{query}”
                </p>
              )}
            </div>
            <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              {posts.length} this week
            </span>
          </div>

          {error && (
            <div
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-100"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle
                size={17}
                className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-300"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold">Some community updates are delayed.</p>
                <p className="mt-0.5 wrap-break-word text-xs text-amber-800/80 dark:text-amber-200/80">
                  {error} Your feed will keep the latest available posts while
                  we reconnect.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchPosts}
                className="min-h-11 shrink-0 rounded-lg px-2 text-xs font-bold text-amber-800 underline decoration-amber-400 underline-offset-4 transition hover:text-amber-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:text-amber-200 dark:hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid gap-4" aria-label="Loading feed">
              <FeedSkeleton />
              <FeedSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <FeedEmptyState
              query={query}
              category={selectedCategory}
              onReset={resetFilters}
            />
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </section>

        <aside
          className="min-w-0 space-y-4 self-start lg:sticky lg:top-23"
          aria-label="Community context"
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <Avatar
                src={currentUser?.avatar}
                alt={`${currentUser?.name || "Your"} profile`}
                sizeClass="h-12 w-12"
              />
              <div className="min-w-0">
                <h2 className="truncate font-display text-sm font-bold text-slate-950 dark:text-white">
                  {currentUser?.name || "Your profile"}
                </h2>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  @
                  {currentUser?.name?.replace(/\s/g, "_").toLowerCase() ||
                    "aquahub_member"}
                  {currentUser?.location ? ` · ${currentUser.location}` : ""}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center dark:divide-slate-800 dark:bg-slate-900">
              <div>
                <strong className="block font-display text-lg font-extrabold text-slate-950 dark:text-white">
                  {userPostsCount}
                </strong>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Posts
                </span>
              </div>
              <div>
                <strong className="block font-display text-lg font-extrabold text-slate-950 dark:text-white">
                  {userFollowersCount}
                </strong>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Followers
                </span>
              </div>
              <div>
                <strong className="block font-display text-lg font-extrabold text-slate-950 dark:text-white">
                  {userFollowingCount}
                </strong>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Following
                </span>
              </div>
            </div>
            <Link
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-700 transition-colors duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:text-slate-200 dark:hover:border-teal-700 dark:hover:bg-teal-950/40 dark:hover:text-teal-200"
              to="/profile"
            >
              View profile
            </Link>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Community pulse
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${sidebarLoading ? "bg-amber-400" : "bg-emerald-500"}`}
                />
                {sidebarLoading ? "Syncing" : "Synced"}
              </span>
            </div>
            {sidebarLoading ? (
              <div className="mt-3">
                <FeedSkeleton variant="pulse" />
              </div>
            ) : communityPulse ? (
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {[
                  ["Active today", communityPulse.active_today],
                  ["Total posts", communityPulse.total_posts],
                  ["Posts today", communityPulse.posts_today],
                  ["Top category", communityPulse.top_category],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900"
                  >
                    <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-1 truncate font-display text-sm font-extrabold text-slate-950 dark:text-white">
                      {value ?? 0}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Community activity is unavailable right now.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Bookmark
                size={16}
                className="text-teal-700 dark:text-teal-300"
                aria-hidden="true"
              />
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Saved for later
              </h2>
            </div>
            {savedPostsCount === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No saved posts yet
                </p>
                <p className="mt-1 wrap-break-word text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Bookmark a helpful answer and it will appear here for your
                  next water change.
                </p>
                <Link
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300 dark:hover:text-teal-100"
                  to="/"
                >
                  Browse latest conversations
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-teal-50 p-4 dark:bg-teal-950/40">
                <p className="text-sm font-bold text-teal-900 dark:text-teal-100">
                  {savedPostsCount} saved{" "}
                  {savedPostsCount === 1 ? "post" : "posts"} in this feed
                </p>
                <Link
                  className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-teal-700 underline decoration-teal-300 underline-offset-4 dark:text-teal-300"
                  to="/bookmarks"
                >
                  Open saved guides
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <Award
                size={16}
                className="text-teal-700 dark:text-teal-300"
                aria-hidden="true"
              />
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                Top contributors
              </h2>
            </div>
            {sidebarLoading ? (
              <div className="mt-4">
                <FeedSkeleton variant="pulse" />
              </div>
            ) : topContributors.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No contributors yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {topContributors.slice(0, 4).map((contributor) => {
                  const activityScore =
                    contributor.activity_score ??
                    (contributor.posts_count ?? 0) +
                      (contributor.comments_count ?? 0);
                  return (
                    <div
                      className="flex min-w-0 items-center justify-between gap-3"
                      key={contributor.id}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar
                          src={contributor.avatar}
                          alt={`${contributor.name || "Contributor"} avatar`}
                          sizeClass="h-8 w-8"
                          shapeClass="rounded-lg"
                        />
                        <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                          {contributor.name}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-bold text-teal-800 dark:bg-teal-950/60 dark:text-teal-200">
                        {activityScore} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-slate-400" aria-hidden="true" />
              <h2 className="font-display text-sm font-bold text-slate-950 dark:text-white">
                About AquaHub
              </h2>
            </div>
            <p className="mt-2 wrap-break-word text-xs leading-5 text-slate-500 dark:text-slate-400">
              A focused aquarium forum for beginner help, tank journals, disease
              questions, and equipment advice.
            </p>
          </section>

          <div className="hidden items-center gap-2 text-xs text-slate-400 xl:flex">
            <Filter size={14} aria-hidden="true" />
            <span>Use topics to tune your feed.</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default HomeFeed;
