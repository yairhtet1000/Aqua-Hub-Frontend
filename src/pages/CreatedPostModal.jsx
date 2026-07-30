import { useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { categories } from "../data/mockData";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    photos: [],
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handlePhotoUpload = (files) => {
    setFormData({
      ...formData,
      photos: [...formData.photos, ...Array.from(files)],
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose?.();
    setFormData({
      title: "",
      content: "",
      category: "",
      tags: "",
      photos: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <form
        className="grid max-h-[92vh] w-[min(720px,100%)] gap-4 overflow-y-auto rounded-4xl border border-white bg-white p-6 shadow-2xl shadow-slate-950/30"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-700">
              Quick post
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Create new discussion
            </h2>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <input
          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800"
          type="text"
          name="title"
          placeholder="Tank setup, fish question, or breeding log"
          value={formData.title}
          onChange={handleInputChange}
        />

        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
          <select
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input
            className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-800"
            name="tags"
            placeholder="Tags: shrimp, planted, beginner"
            value={formData.tags}
            onChange={handleInputChange}
          />
        </div>

        <textarea
          className="min-h-40 resize-y rounded-2xl border border-slate-200 bg-white p-4 text-slate-800"
          name="content"
          placeholder="Describe the aquarium, parameters, timeline, and what advice you need."
          value={formData.content}
          onChange={handleInputChange}
        />

        <label className="grid min-h-32 place-items-center gap-2 rounded-3xl border border-dashed border-teal-200 bg-teal-50/60 p-5 text-center text-teal-900">
          <ImagePlus size={24} />
          <span className="font-black">Upload aquarium photos</span>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => handlePhotoUpload(event.target.files)}
          />
        </label>

        {formData.photos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.photos.map((photo) => (
              <span
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600"
                key={photo.name}
              >
                {photo.name}
              </span>
            ))}
          </div>
        )}

        <button
          className="inline-flex h-12 min-w-40 items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-black text-white shadow-lg shadow-teal-900/20"
          type="submit"
        >
          <Send size={18} />
          Publish post
        </button>
      </form>
    </div>
  );
};

export default CreatePostModal;
