import { Link } from "react-router-dom";
import { UserCheck, UsersRound } from "lucide-react";
import { users } from "../data/mockData";

const Following = () => {
  const followedUsers = users.filter((user) => user.id !== 1);

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
            {followedUsers.length} users
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {followedUsers.map((user) => (
          <Link
            className="grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950 max-sm:grid-cols-[56px_1fr]"
            to={`/users/${user.id}`}
            key={user.id}
          >
            <img
              className="h-14 w-14 rounded-full object-cover"
              src={user.avatar}
              alt=""
            />
            <div className="min-w-0">
              <strong className="block text-lg font-black text-slate-950 dark:text-white">
                {user.name}
              </strong>
              <p className="line-clamp-2 leading-6 text-slate-600 dark:text-slate-300">{user.bio}</p>
            </div>
            <span className="inline-flex h-10 min-w-32 items-center justify-center gap-2 rounded-full bg-teal-50 px-4 text-sm font-black text-teal-800 dark:bg-teal-950 dark:text-teal-300 max-sm:col-span-2">
              <UserCheck size={17} />
              Following
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Following;
