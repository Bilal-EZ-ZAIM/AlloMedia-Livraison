const User = require("../../model/user.model");
const CreateToken = require("../../util/createToken");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const jwt = require("jsonwebtoken");

const regester = async (req, res) => {
  const data = req.body;

  try {
    data.role = "client";
    data.slug = slug(data.name);

    if (data.password) {
      data.password = await HashPassword(data.password);
    }

    // data.tokenValidet = { token, expirationTime, secret };

    const user = await User.create(data);

    const token = CreateToken(user._id, "5m");

    const confirmationLink =
      "http://localhost:8001/api/auth/verifyAcount/" + token;

    await envoyerEmail(user.email, "verfei accoute", confirmationLink);

    return res.status(201).json({
      message: "User created successfully!",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during registration",
      error: error.message || "Internal server error",
    });
  }
};

const verifierAccount = async (req, res) => {
  try {
    let token = req.params.token;

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in, please log in to access this route.",
      });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    console.log(decodeToken);

    if (!decodeToken) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in to access this route.",
      });
    }

    const currentUser = await User.findById(decodeToken.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
    }

    currentUser.isVirefier = true;
    await currentUser.save();

    res.status(200).json({
      status: "success",
      message: "Votre compte a été vérifié avec succès.",
      user: {
        name: currentUser.name,
        email: currentUser.email,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Your token has expired. Please log in again.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token. Please log in again.",
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Something went wrong. Please try again later.",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await User.findById(id);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Internal server error",
    });
  }
};

const sendMail = async (req, res) => {
  try {
    const { email, msg } = req.body;

    const mail = await envoyerEmail(email, msg);

    return res.status(201).json({
      msg: "mail en vouye",
    });
  } catch (error) {}
};

module.exports = {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
};
