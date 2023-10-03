const emailToUserName = (email) => {
  if (!email) {
    return "";
  }
  const username = email.split("@");
  return username[0];
};

module.exports = emailToUserName;
