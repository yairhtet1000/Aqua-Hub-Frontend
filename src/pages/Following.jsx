import { useEffect, useState } from "react";
import { UsersRound } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../hooks";
import FollowModal from "../components/FollowModal";

const Following = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user");
        setProfile(res.data.user || res.data);
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="mx-auto grid w-[min(860px,100%)] gap-5">
      <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 dark:bg-slate-900">
        <span className="mb-3 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          <UsersRound size={17} />
          Community network
        </span>
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-4xl font-black tracking-tight">Following</h1>
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black ring-1 ring-white/15">
            {profile?.following_count ?? 0} following
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {!profile ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Unable to load following list.
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFollowingModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
              >
                View Following ({profile.following_count ?? 0})
              </button>
              <button
                onClick={() => setShowFollowersModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                View Followers ({profile.followers_count ?? 0})
              </button>
            </div>
          </div>
        )}
      </div>

      <FollowModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        type="following"
        userId={authUser?.id}
        title="Following"
      />
      <FollowModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        type="followers"
        userId={authUser?.id}
        title="Followers"
      />
    </section>
  );
};

export default Following;
