import { useEffect, useState } from "react";

const SafeImage = ({
  src,
  alt,
  fallbackSrc = "/favicon.svg",
  className = "",
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImageSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      className={className}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setImageSrc(fallbackSrc)}
    />
  );
};

export default SafeImage;
