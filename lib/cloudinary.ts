export function isCloudinaryUrl(url: string | null | undefined) {
  if (!url) return false;
  return url.includes("res.cloudinary.com");
}

/**
 * Insert a Cloudinary transformation string into a Cloudinary image URL.
 * Example transform: "c_fill,w_900,q_auto,f_auto"
 */
export function cloudinaryTransform(url: string, transform = "c_fill,w_900,q_auto,f_auto") {
  if (!isCloudinaryUrl(url)) return url;
  // Cloudinary URLs look like: https://res.cloudinary.com/<cloud>/image/upload/<rest>
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

/**
 * Insert a Cloudinary transformation string into a Cloudinary image URL.
 * Example transform: "c_fill,w_900,q_auto,f_auto"
 */
 
 /**
export function cloudinaryTransform(url: string, transform = "c_fill,w_900,q_auto,f_auto") {
  if (!isCloudinaryUrl(url)) return url;
  // Cloudinary URLs look like: https://res.cloudinary.com/<cloud>/image/upload/<rest>
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/${transform}/${parts[1]}`;
}

**/

