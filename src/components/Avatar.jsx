import { useEffect, useState } from "react";
import { getAvatarUrl } from "../utils/imageUrl";

const Avatar = ({
  src,
  alt = "User avatar",
  sizeClass = "h-11 w-11",
  shapeClass = "rounded-xl",
  className = "",
}) => {
  const [imageSrc, setImageSrc] = useState(() => getAvatarUrl(src));

  useEffect(() => {
    setImageSrc(getAvatarUrl(src));
  }, [src]);

  const handleError = () => {
    setImageSrc("/default-avatar.png");
  };

  return (
    <img
      className={`${sizeClass} ${shapeClass} shrink-0 object-cover ${className}`}
      src={imageSrc || "/default-avatar.png"}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
};

export default Avatar;
