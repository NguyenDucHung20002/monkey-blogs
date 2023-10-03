const toSlug = (string) => {
  if (!string) {
    return "";
  }
  let slug = string.split(" ");
  slug = slug.join("-").toLowerCase();
  return slug;
};

module.exports = toSlug;
