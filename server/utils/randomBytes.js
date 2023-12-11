import crypto from "crypto";

const randomBytes = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

export default randomBytes;
