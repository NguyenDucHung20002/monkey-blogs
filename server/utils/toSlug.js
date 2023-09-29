const toSlug = (string) => {
  let slug = string.split(" ");
  slug = slug.join("-").toLowerCase();
  return slug;
};

module.exports = toSlug;
