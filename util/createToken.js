const jwt = require("jsonwebtoken");
const CreateToken = (id, expires) => {
  const token = jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SCREPT_KEY,
    { expiresIn: expires || "90d" }
  );
  return token;
};

module.exports = CreateToken;
