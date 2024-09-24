
const User = require("../../model/user.model");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");

const regester = async (req, res) => {
  const data = req.body;

  try {
    data.role = "client";
    data.slug = slug(data.name);

    if (data.password) {
      data.password = await HashPassword(data.password);
    }

    const user = await User.create(data);

    return res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during registration",
      error: error.message || "Internal server error",
    });
  }
};

module.exports = {
  regester,
};
