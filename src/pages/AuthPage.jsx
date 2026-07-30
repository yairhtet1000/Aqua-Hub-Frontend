import { Link } from "react-router-dom";
import { Fish, LogIn, UserPlus } from "lucide-react";

const fieldClass =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700";

const AuthPage = ({ mode = "login", onLogin }) => {
  const isRegister = mode === "register";

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(rgba(238,245,247,.88),rgba(238,245,247,.94)),url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-6">
      <section className="grid w-[min(460px,100%)] gap-5 rounded-[2rem] border border-white bg-white/95 p-7 shadow-2xl shadow-slate-950/15 ring-1 ring-slate-200/80 backdrop-blur">
        <div className="inline-flex items-center gap-3 font-black text-teal-950">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-700 to-cyan-500 text-white">
            <Fish size={28} />
          </span>
          <span className="text-2xl">AquaHub</span>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">
            {isRegister ? "Join the aquarium community" : "Welcome back"}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            {isRegister
              ? "Create an account to ask questions, save posts, and share your tank progress."
              : "Log in to comment, like posts, save guides, and manage your profile."}
          </p>
        </div>

        <form className="grid gap-4">
          {isRegister && (
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Name
              <input className={fieldClass} placeholder="Your display name" />
            </label>
          )}
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Email
            <input
              className={fieldClass}
              type="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-black text-slate-700">
            Password
            <input className={fieldClass} type="password" />
          </label>
          {isRegister && (
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Confirm password
              <input className={fieldClass} type="password" />
            </label>
          )}
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-black text-white shadow-lg shadow-teal-900/20"
            type="button"
            onClick={onLogin}
          >
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            {isRegister ? "Create account" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm font-bold text-slate-600">
          {isRegister ? "Already have an account?" : "New to AquaHub?"}{" "}
          <Link
            className="font-black text-teal-700"
            to={isRegister ? "/login" : "/register"}
          >
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AuthPage;
