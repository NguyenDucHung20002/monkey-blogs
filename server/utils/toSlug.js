const toSlug = (string) => {
  if (!string) {
    return "";
  }

  const regex = /[^a-zA-Z0-9\s]+/;
  let slug = string.split(regex);
  slug = slug.join("-").toLowerCase();
  return slug;
};

export default toSlug;
