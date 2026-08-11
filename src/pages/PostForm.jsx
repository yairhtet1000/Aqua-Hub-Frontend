import { Link, useNavigate } from "react-router-dom";
import { ImagePlus, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useToast } from "../hooks";

const fieldClass =
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass = "grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200";

const PostForm = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tankId, setTankId] = useState("");
  const [status, setStatus] = useState("published");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, tankRes] = await Promise.all([
          api.get("/categories"),
          api.get("/tanks"),
        ]);
        const catData = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
        const tankData = Array.isArray(tankRes.data) ? tankRes.data : (tankRes.data?.data || []);
        setCategories(catData);
        setTanks(tankData);
      } catch {
        addToast("Failed to load form options.", "error");
      }
    };

    fetchOptions();
  }, [addToast]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("category_id", categoryId);
      if (tankId) {
        formData.append("tank_id", tankId);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      addToast("Post published successfully.", "success");
      navigate(`/posts/${response.data.id}`);
    } catch {
      addToast("Failed to create post.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto grid w-[min(940px,100%)] gap-5">
      <div className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl shadow-teal-950/20 sm:p-9">
        <span className="mb-3 block text-sm font-black uppercase tracking-[0.16em] text-cyan-200">
          New community discussion
        </span>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Create a forum post
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-cyan-50/80">
          Add useful context, choose the right category, and attach photos so
          experienced keepers can help quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950 sm:p-7">
        <label className={labelClass}>
          Title
          <input
            className={fieldClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: White spots on neon tetra, what should I do?"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <label className={labelClass}>
            Category
            <select
              className={fieldClass}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a category
              </option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Tank
            <select
              className={fieldClass}
              value={tankId}
              onChange={(e) => setTankId(e.target.value)}
            >
              <option value="">No tank</option>
              {Array.isArray(tanks) && tanks.map((tank) => (
                <option key={tank.id} value={tank.id}>
                  {tank.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          Status
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className={labelClass}>
          Post content
          <textarea
            className="min-h-56 resize-y rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe tank size, livestock, water parameters, timeline, and what you already tried."
            required
          />
        </label>

        <label className="grid min-h-44 place-items-center gap-2 rounded-3xl border border-dashed border-teal-200 bg-teal-50/60 p-6 text-center text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
          <ImagePlus size={28} />
          <span className="font-black">Upload aquarium photo</span>
          <small className="font-bold text-slate-500 dark:text-slate-400">
            JPG, PNG, or WEBP. Max 2MB.
          </small>
          <input
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </label>

        {preview && (
          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900">
            <img
              className="h-20 w-28 rounded-2xl object-cover"
              src={preview}
              alt="Preview"
            />
            <span className="font-bold text-slate-600 dark:text-slate-300">
              Selected photo preview
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-black text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
            type="submit"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Publishing..." : "Publish post"}
          </button>
          <Link
            className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-black text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            to="/"
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
