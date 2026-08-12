import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Calendar, Fish, MapPin, PenSquare, UserPlus } from "lucide-react";
import PostCard from "../components/PostCard";
import { useAuth, useToast } from "../hooks";
import api from "../api/axios";
import { getImageUrl } from "../utils/imageUrl";

const UserProfile = ({ own = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState({ is_following: false, is_friend: false });
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const { addToast } = useToast();

  const isAdmin = location.pathname.startsWith("/admin");
  const editProfilePath = isAdmin ? "/admin/profile/edit-profile" : "/settings/edit-profile";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        let userData;
        if (own) {
          const res = await api.get("/user");
          userData = res.data.user || res.data;
        } else {
          const res = await api.get(`/users/${id}`);
          userData = res.data.user || res.data;
        }
        setProfile(userData);
        setFollowersCount(userData.followers_count ?? 0);
        setFollowingCount(userData.following_count ?? 0);

        const postsRes = await api.get("/posts", {
          params: { user_id: userData.id },
        });
        const postsPayload = postsRes.data;
        setUserPosts(postsPayload.data || postsPayload);
        setTotalPosts(postsPayload.total ?? (postsPayload.data?.length ?? 0));
      } catch {
        setError("Failed to load profile.");
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

    setFollowStatus({
      is_following: optimisticFollowing,
      is_friend: optimisticFollowing && previousStatus.is_friend,
    });
    setFollowersCount((prev) => (optimisticFollowing ? prev + 1 : prev - 1));
    setFollowLoading(true);

    try {
      const endpoint = optimisticFollowing ? `/users/${profile.id}/follow` : `/users/${profile.id}/unfollow`;
      const response = await api[optimisticFollowing ? 'post' : 'delete'](endpoint);
      const data = response.data;
      setFollowStatus({
        is_following: data.is_following,
        is_friend: data.is_friend,
      });
      setFollowersCount((prev) => (data.is_following ? prev + 1 : prev - 1));
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
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center font-black text-slate-600 shadow-xl dark:bg-slate-950 dark:text-slate-300">
        {error || "User profile not found."}
      </div>
    );
  }

  const isOwner = own || authUser?.id === profile.id;

  return (
    <div className="mx-auto grid w-[min(980px,100%)] gap-5">
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/8 dark:border-slate-800 dark:bg-slate-950">
        <div className="h-36 bg-[linear-gradient(90deg,rgba(15,118,110,.95),rgba(6,182,212,.65)),url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center" />
        <div className="grid grid-cols-[auto_1fr_auto] items-end gap-5 p-6 pt-0 max-md:grid-cols-1">
          <img
            className="-mt-16 h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl dark:border-slate-950"
            src={getImageUrl(profile.avatar) || "https://via.placeholder.com/128"}
            alt=""
          />
          <div className="min-w-0 pb-2">
            <span className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
              @{profile.name?.replace(/\s/g, "_").toLowerCase()}
            </span>
            <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              {profile.name}
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
              {profile.bio || "No bio yet."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
              {profile.favoriteFish && (
                <span className="inline-flex items-center gap-2">
                  <Fish size={17} />
                  {profile.favoriteFish}
                </span>
              )}
              {profile.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={17} />
                  {profile.location}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Calendar size={17} />
                Joined{" "}
                {profile.created_at
                  ? new Date(profile.created_at).getFullYear()
                  : "Unknown"}
              </span>
            </div>
          </div>
          {isOwner ? (
            <Link
              className="inline-flex h-12 min-w-36 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
              to={editProfilePath}
            >
              <PenSquare size={18} />
              Edit profile
            </Link>
          ) : (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`inline-flex h-12 min-w-36 items-center justify-center gap-2 rounded-full px-5 text-sm font-black shadow-lg disabled:opacity-60 ${
                followStatus.is_following
                  ? "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  : "bg-teal-700 text-white shadow-teal-900/20"
              }`}
            >
              {followLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : followStatus.is_following ? (
                "Following"
              ) : (
                <>
                  <UserPlus size={18} />
                  Follow
                </>
              )}
            </button>
          )}
        </div>
      </section>

      <section className="grid grid-cols-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 max-sm:grid-cols-2">
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
        ].map(([label, value]) => (
          <div
            className="grid gap-1 border-r border-slate-100 p-5 text-center last:border-r-0 dark:border-slate-800 max-sm:border-b"
            key={label}
          >
            <strong className="text-3xl font-black text-teal-800">
              {value}
            </strong>
            <span className="text-sm font-black text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
              Member activity
            </p>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">
              {own ? "My posts" : `${profile.name}'s posts`}
            </h2>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-800">
            {userPosts.length} posts
          </span>
        </div>
        {userPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No posts yet.
          </div>
        ) : (
          userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </section>
    </div>
  );
};

export default UserProfile;
