import { useEffect, useState } from "react";
import {
  Calendar,
  Fish,
  LogOut,
  MapPin,
  PenSquare,
  UserPlus,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth, useToast } from "../hooks";
import Avatar from "../components/Avatar";
import { FeedSkeleton, PageEmptyState } from "../components/FeedStates";
import PostCard from "../components/PostCard";

const UserProfile = ({ own = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({
    is_following: false,
    is_friend: false,
  });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      addToast("Logout failed. Please try again.", "error");
    }
  };

  const isAdmin = location.pathname.startsWith("/admin");
  const editProfilePath = isAdmin
    ? "/admin/profile/edit-profile"
    : "/settings/edit-profile";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = own
          ? await api.get("/user")
          : await api.get(`/users/${id}`);
        const userData = response.data.user || response.data;
        setProfile(userData);
        setFollowersCount(userData.followers_count ?? 0);
        setFollowingCount(userData.following_count ?? 0);
        setFollowStatus({
          is_following: userData.is_following || false,
          is_friend: userData.is_friend || false,
        });

        const postsRes = await api.get("/posts", {
          params: { user_id: userData.id },
        });
        const postsPayload = postsRes.data;
        setUserPosts(postsPayload.data || postsPayload);
        setTotalPosts(postsPayload.total ?? postsPayload.data?.length ?? 0);
      } catch {
        setError("We couldn't load this profile right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, own]);

  const handleFollowToggle = async () => {
    if (!profile || followLoading) return;

    const previousStatus = { ...followStatus };
    const previousFollowersCount = followersCount;
    const optimisticFollowing = !followStatus.is_following;
    const optimisticCount = optimisticFollowing
      ? previousFollowersCount + 1
      : Math.max(previousFollowersCount - 1, 0);

    setFollowStatus({
      is_following: optimisticFollowing,
      is_friend: optimisticFollowing && previousStatus.is_friend,
    });
    setFollowersCount(optimisticCount);
    setFollowLoading(true);

    try {
      const endpoint = optimisticFollowing
        ? `/users/${profile.id}/follow`
        : `/users/${profile.id}/unfollow`;
      const response =
        await api[optimisticFollowing ? "post" : "delete"](endpoint);
      const data = response.data;
      setFollowStatus({
        is_following: data.is_following,
        is_friend: data.is_friend,
      });
      setFollowersCount(data.followers_count ?? optimisticCount);
      addToast(data.message, "success");
    } catch {
      setFollowStatus(previousStatus);
      setFollowersCount(previousFollowersCount);
      addToast("Failed to update follow status.", "error");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="mx-auto grid w-full max-w-245 gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Loading profile"
      >
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-245 px-4 sm:px-6 lg:px-8">
        <PageEmptyState
          title="Profile unavailable"
          description={error || "This user profile could not be found."}
          actionLabel="Back to feed"
          actionTo="/"
        />
      </div>
    );
  }

  const isOwner = own || authUser?.id === profile.id;
  const handle =
    profile.name?.replace(/\s/g, "_").toLowerCase() || "aquahub_member";

  return (
    <div className="mx-auto grid w-full max-w-245 gap-5 px-4 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
        <div className="h-24 bg-teal-800 dark:bg-teal-950" aria-hidden="true" />
        <div className="grid gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end sm:p-5">
          <Avatar
            src={profile.avatar}
            alt={`${profile.name || "User"} profile`}
            sizeClass="-mt-10 h-24 w-24 sm:h-28 sm:w-28"
            shapeClass="rounded-2xl border-4 border-white shadow-md dark:border-slate-950"
          />
          <div className="min-w-0 sm:pb-1">
            <p className="truncate text-sm font-bold text-teal-700 dark:text-teal-300">
              @{handle}
            </p>
            <h1 className="mt-1 wrap-break-word font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {profile.name}
            </h1>
            <p className="mt-2 max-w-2xl wrap-break-word text-sm leading-6 text-slate-600 dark:text-slate-300">
              {profile.bio || "No bio yet."}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              {profile.favoriteFish && (
                <span className="inline-flex items-center gap-2">
                  <Fish size={15} aria-hidden="true" />
                  {profile.favoriteFish}
                </span>
              )}
              {profile.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={15} aria-hidden="true" />
                  {profile.location}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} aria-hidden="true" />
                Joined{" "}
                {profile.created_at
                  ? new Date(profile.created_at).getFullYear()
                  : "Unknown"}
              </span>
            </div>
          </div>
          {isOwner ? (
            <div className="flex items-center gap-2">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white shadow-sm shadow-teal-700/20 transition hover:bg-teal-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                to={editProfilePath}
              >
                <PenSquare size={16} aria-hidden="true" />
                Edit profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-100 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:bg-rose-500/10 dark:text-rose-500 dark:hover:bg-rose-500/20"
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={followLoading}
              aria-pressed={followStatus.is_following}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                followStatus.is_following
                  ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  : "bg-teal-700 text-white shadow-sm shadow-teal-700/20 hover:bg-teal-800"
              }`}
            >
              {followLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : followStatus.is_following ? (
                "Following"
              ) : (
                <>
                  <UserPlus size={16} aria-hidden="true" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-4">
        {[
          ["Posts", totalPosts],
          ["Comments", profile.comments_count ?? 0],
          [
            "Followers",
            <Link
              key="followers"
              to="/following"
              className="hover:text-teal-700 dark:hover:text-teal-300"
            >
              {followersCount}
            </Link>,
          ],
          [
            "Following",
            <Link
              key="following"
              to="/following"
              className="hover:text-teal-700 dark:hover:text-teal-300"
            >
              {followingCount}
            </Link>,
          ],
        ].map(([label, value], index) => (
          <div
            className={`grid gap-1 border-slate-100 p-4 text-center dark:border-slate-800 sm:border-r sm:last:border-r-0 ${index < 2 ? "border-b sm:border-b-0" : ""}`}
            key={label}
          >
            <strong className="font-display text-2xl font-extrabold text-teal-800 dark:text-teal-300">
              {value}
            </strong>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {label}
            </span>
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4 px-1">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
              Activity
            </p>
            <h2 className="mt-1 wrap-break-word font-display text-2xl font-extrabold text-slate-950 dark:text-white">
              {own ? "My posts" : `${profile.name}'s posts`}
            </h2>
          </div>
          <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            {userPosts.length} posts
          </span>
        </div>
        {userPosts.length === 0 ? (
          <PageEmptyState
            title={
              own ? "Your profile is ready for a first post" : "No posts yet"
            }
            description={
              own
                ? "Share a tank journal or ask the community for help."
                : "This aquarist has not shared a conversation yet."
            }
            actionLabel={own ? "Create a post" : "Browse feed"}
            actionTo={own ? "/create-post" : "/"}
          />
        ) : (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </div>
  );
};

export default UserProfile;
