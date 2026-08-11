import { Link, useParams } from "react-router-dom";
import { ImagePlus, Save, X } from "lucide-react";
import { categories, posts } from "../data/mockData";
import { getImageUrl } from "../utils/imageUrl";

const fieldClass =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass = "grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200";

const PostForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const existingPost = posts.find((post) => post.id === Number(id));
  const isEdit = mode === "edit" && existingPost;

  return (
    <div className="mx-auto grid w-[min(940px,100%)] gap-5">
      <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 sm:p-9">
        <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          {isEdit ? "Edit your post" : "New community discussion"}
        </span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {isEdit ? "Update aquarium post" : "Create a forum post"}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-cyan-50/80">
          Add useful context, choose the right category, and attach photos so
          experienced keepers can help quickly.
        </p>
      </div>

      <form className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-7">
        <label className={labelClass}>
          Title
          <input
            className={fieldClass}
            defaultValue={existingPost?.title}
            placeholder="Example: White spots on neon tetra, what should I do?"
          />
        </label>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <label className={labelClass}>
            Category
            <select className={fieldClass} defaultValue={existingPost?.category || ""}>
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Tags
            <input
              className={fieldClass}
              defaultValue={existingPost?.tags.join(", ")}
              placeholder="shrimp, planted, beginner"
            />
          </label>
        </div>

        <label className={labelClass}>
          Post content
          <textarea
            className="min-h-56 resize-y rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            defaultValue={existingPost?.content}
            placeholder="Describe tank size, livestock, water parameters, timeline, and what you already tried."
          />
        </label>

        <label className="grid min-h-44 place-items-center gap-2 rounded-3xl border border-dashed border-teal-200 bg-teal-50/60 p-6 text-center text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
          <ImagePlus size={28} />
          <span className="font-black">Upload aquarium photos</span>
          <small className="font-bold text-slate-500 dark:text-slate-400">
            JPG, PNG, or WEBP. Multiple photos can be attached later.
          </small>
          <input className="hidden" type="file" accept="image/*" multiple />
        </label>

        {existingPost?.image && (
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
            <img
              className="h-20 w-28 rounded-2xl object-cover"
              src={getImageUrl(existingPost.image)}
              alt=""
            />
            <span className="font-bold text-slate-600 dark:text-slate-300">Current cover photo</span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-black text-white shadow-lg shadow-teal-900/20"
            type="button"
          >
            <Save size={18} />
            {isEdit ? "Save changes" : "Publish post"}
          </button>
          <Link
            className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-black text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            to={isEdit ? `/posts/${id}` : "/"}
          >
            <X size={18} />
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
