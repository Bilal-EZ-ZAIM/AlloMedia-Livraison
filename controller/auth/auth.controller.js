const User = require("../../model/user.model");
const CreateToken = require("../../util/createToken");
const HashPassword = require("../../util/HashPassword");
const slug = require("slug");
const envoyerEmail = require("../../util/mail");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { generateRandomCode } = require("../../util/generateRandomCode");

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

    const token = CreateToken({ id: user.id }, "5m");

    const confirmationLink =
      "http://localhost:8001/api/auth/verifyAcount/" + token;

    await envoyerEmail(
      user.email,
      "verfei accoute",
      confirmationLink,
      null,
      "OTP"
    );

    return res.status(201).json({
      message: "User created successfully!",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
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

const Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    const verifyPassword = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!verifyPassword) {
      return res.status(404).json({
        status: "fail",
        message: "Email Or Password not correct.",
      });
    }

    const code = generateRandomCode();

    const token = CreateToken({ id: user.id, code }, "5m");

    await envoyerEmail(
      user.email,
      "verfei accoute par code",
      (confirmationLink = null),
      code,
      "2FA"
    );

    return res.status(201).json({
      data: user,
      token,
    });
  } catch (error) {
    return res.status(404).json({ error });
  }
};

const verifier2FA = async (req, res) => {
  try {
    let token = req.params.token;
    const code = req.body.code;

    // Vérifier si le token est présent
    if (!token) {
      return res.status(401).json({
        status: "fail",
        message:
          "Vous n'êtes pas connecté, veuillez vous connecter pour accéder à cette route.",
      });
    }

    // Décoder le token JWT
    const decodeToken = jwt.verify(token, process.env.JWT_SCREPT_KEY);

    // Vérifier si le token est valide
    if (!decodeToken) {
      return res.status(401).json({
        status: "fail",
        message:
          "Token invalide. Veuillez vous reconnecter pour accéder à cette route.",
      });
    }

    // Trouver l'utilisateur associé au token
    const currentUser = await User.findById(decodeToken.id);

    // Vérifier si l'utilisateur existe toujours
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        message: "L'utilisateur associé à ce token n'existe plus.",
      });
    }

    // Vérifier si le code fourni correspond à celui dans le token
    if (decodeToken.code !== code) {
      return res.status(400).json({
        status: "fail",
        message: "Le code de vérification est incorrect.",
      });
    }

    // Si tout est valide, retourner une réponse de succès
    res.status(200).json({
      status: "success",
      message: "Votre authentification a été effectuée avec succès.",
      user: {
        name: currentUser.name,
        email: currentUser.email,
      },
    });
  } catch (error) {
    // Gestion des erreurs spécifiques liées au token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message:
          "Le temps imparti a expiré. Veuillez demander un nouveau code.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "fail",
        message: "Token invalide. Veuillez vous reconnecter.",
      });
    }
    // Gestion des erreurs générales
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
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
  Login,
  verifier2FA,
};
