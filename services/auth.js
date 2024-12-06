const jwt = require("jsonwebtoken");
const secret = "Shivu@90#";
// const payload = {
//   _id: user._id,
//   name: user.fullname,
//   email: user.email,
//   profile: user.profileImageUrl,
//   role: user.role,
// };
const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    name: user.fullname,
    email: user.email,
    profile: user.profileImageUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secret);
  return payload;
};

module.exports = { createTokenForUser, validateToken };
