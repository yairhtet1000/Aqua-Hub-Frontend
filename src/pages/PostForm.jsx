import { Link, useNavigate, useParams } from "react-router-dom";
import { ImagePlus, X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { useToast } from "../hooks";
import { InlineLoading } from "../components/FeedStates";
import SafeImage from "../components/SafeImage";
import { getImageUrl } from "../utils/imageUrl";

const fieldClass =
  "min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
const labelClass =
  "grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200";

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState("published");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(() => isEdit);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await api.get("/categories");
        const catData = Array.isArray(data) ? data : data?.data || [];
        setCategories(catData);
      } catch {
        addToast("Failed to load categories.", "error");
      }
    };

    fetchOptions();
  }, [addToast]);

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/posts/${id}`);
        const post = data;
        setTitle(post.title || "");
        setContent(post.content || "");
        setCategoryId(post.category_id || "");
        setStatus(post.status || "published");
        setSelectedTags(post.tags?.map((tag) => tag.name) || []);
        if (post.images?.length > 0) {
          setPreview(post.images[0].image_path || "");
        }
      } catch {
        addToast("Failed to load post.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [isEdit, id, navigate, addToast]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const value = tagInput.trim();
    if (!value) return;
    const names = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setSelectedTags((prev) => {
      const merged = [...prev];
      names.forEach((name) => {
        if (!merged.includes(name)) merged.push(name);
      });
      return merged;
    });
    setTagInput("");
  };

  const handleRemoveTag = (name) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== name));
  };

  const handleSubmit = async (e, overrideStatus) => {
    e.preventDefault();
    const targetStatus = overrideStatus || status;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", targetStatus);
      formData.append("category_id", categoryId);
      selectedTags.forEach((name) => formData.append("tag_names[]", name));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await api.post(`/posts/${id}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast("Post updated successfully.", "success");
        navigate(`/posts/${id}`);
      } else {
        const response = await api.post("/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        addToast(
          targetStatus === "draft"
            ? "Draft saved successfully."
            : "Post published successfully.",
          "success",
        );
        navigate(`/posts/${response.data.id}`);
      }
    } catch {
      addToast(
        isEdit ? "Failed to update post." : "Failed to create post.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const statusActions = [
    { key: "draft", label: "Save Draft" },
    { key: "published", label: "Publish" },
    { key: "archived", label: "Archive" },
  ];

  if (loading) {
    return <InlineLoading label="Loading post editor" />;
  }

  return (
    <div className="mx-auto grid w-full max-w-235 gap-5 px-4 sm:px-6 lg:px-8">
      <div className="border-b border-slate-200 pb-4 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
          {isEdit ? "Update discussion" : "New community discussion"}
        </span>
        <h1 className="mt-1 wrap-break-word font-display text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          {isEdit ? "Edit post" : "Create a forum post"}
        </h1>
        <p className="mt-2 max-w-2xl wrap-break-word text-sm leading-6 text-slate-500 dark:text-slate-400">
          Add useful context, choose the right category, and attach photos so
          experienced keepers can help quickly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950 sm:p-7"
      >
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
            {Array.isArray(categories) &&
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>

        <label className={labelClass}>
          Tags
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-teal-800 hover:text-teal-900 dark:text-teal-300"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              className="flex-1 bg-transparent px-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onBlur={handleAddTag}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
              placeholder="Add tags (comma separated)"
            />
          </div>
        </label>

        <label className={labelClass}>
          Post content
          <textarea
            className="min-h-56 resize-y rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe tank size, livestock, water parameters, timeline, and what you already tried."
            required
          />
        </label>

        <label className="grid min-h-44 place-items-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-teal-50/60 p-6 text-center text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200">
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
            <SafeImage
              className="h-20 w-28 rounded-xl object-cover"
              src={preview.startsWith("blob:") ? preview : getImageUrl(preview)}
              alt="Aquarium photo preview"
            />
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {isEdit ? "Current photo preview" : "Selected photo preview"}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {statusActions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={(e) => {
                setStatus(action.key);
                handleSubmit(e, action.key);
              }}
              className={`inline-flex min-h-11 min-w-36 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                status === action.key
                  ? "bg-teal-700 text-white shadow-lg shadow-teal-900/20"
                  : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              }`}
            >
              {saving ? "Saving..." : action.label}
            </button>
          ))}
          <Link
            className="inline-flex min-h-11 min-w-32 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
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
