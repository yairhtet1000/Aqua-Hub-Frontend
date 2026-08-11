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
