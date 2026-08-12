import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../hooks";

const PostCreateModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState("published");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [catRes, tagRes] = await Promise.all([
          api.get("/categories"),
          api.get("/tags"),
        ]);

        setCategories(catRes.data.data || catRes.data || []);
        setTags(tagRes.data.data || tagRes.data || []);
      } catch {
        addToast("Failed to load form data.", "error");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen, addToast]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setContent("");
      setCategoryId("");
      setSelectedTagIds([]);
      setImages([]);
      setPreviews([]);
      setStatus("published");
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !categoryId) {
      addToast("Please fill in all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("status", status);
      formData.append("category_id", categoryId);

      selectedTagIds.forEach((tagId) => {
        formData.append("tag_ids[]", tagId);
      });

      images.forEach((file) => {
        formData.append("images[]", file);
      });

      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      addToast(
        status === "draft"
          ? "Draft saved successfully!"
          : "Post published successfully!",
        "success",
      );
      onSuccess?.();
      onClose();
      navigate("/");
    } catch {
      addToast("Failed to create post. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
  const textareaClass =
    "min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm focus:outline-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";
  const labelClass =
    "grid gap-2 text-sm font-black text-slate-700 dark:text-slate-200";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-[min(680px,100%)] max-h-[90vh] overflow-y-auto rounded-4xl border border-white bg-white p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-slate-200/80 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">
            Create a new post
          </h2>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-5">
          <label className={labelClass}>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your aquarium question or update?"
              className={inputClass}
              required
            />
          </label>

          <label className={labelClass}>
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Status
            <div className="flex flex-wrap gap-2">
              {[
                { key: "draft", label: "Save Draft" },
                { key: "published", label: "Publish" },
                { key: "archived", label: "Archive" },
              ].map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => setStatus(action.key)}
                  className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-full px-4 text-xs font-black transition ${
                    status === action.key
                      ? "bg-teal-700 text-white shadow-lg shadow-teal-900/20"
                      : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </label>

          <label className={labelClass}>
            Tags
            <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTagIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id],
                      )
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      isSelected
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </label>

          <label className={labelClass}>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your setup, question, or update in detail..."
              className={textareaClass}
              required
            />
          </label>

          <label className={labelClass}>
            Photos
            <div
              onClick={() => fileInputRef.current?.click()}
              className="grid min-h-44 cursor-pointer place-items-center gap-2 rounded-2xl border border-dashed border-teal-200 bg-teal-50/60 p-6 text-center dark:border-teal-900 dark:bg-teal-950/40"
            >
              <ImagePlus
                size={28}
                className="text-teal-700 dark:text-teal-300"
              />
              <span className="font-black text-teal-900 dark:text-teal-200">
                Click to upload aquarium photos
              </span>
              <small className="font-bold text-slate-500 dark:text-slate-400">
                JPG, PNG, or WEBP. Max 5MB each.
              </small>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={src}
                      alt=""
                      className="h-24 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white shadow"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || loadingData}
              className="inline-flex h-12 min-w-44 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-black text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {submitting
                ? status === "draft"
                  ? "Saving..."
                  : "Publishing..."
                : status === "draft"
                  ? "Save Draft"
                  : status === "published"
                    ? "Publish"
                    : "Archive"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-black text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreateModal;
