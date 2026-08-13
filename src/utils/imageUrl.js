export const getImageUrl = (path) => {
  if (!path) return null;
  if (typeof path !== "string") return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseURL = "http://localhost:8000";
  const cleanPath = path.replace(/^\/+/, "");
  return `${baseURL}/${cleanPath}`;
};

export const getAvatarUrl = (avatar) => {
  if (!avatar || typeof avatar !== "string") return "/default-avatar.png";

  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }

  const cleanPath = avatar.replace(/^\/?(storage\/)?/, "");

  const backendOrigin = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "")
    : "http://127.0.0.1:8000";

  return `${backendOrigin}/storage/${cleanPath}`;
};
