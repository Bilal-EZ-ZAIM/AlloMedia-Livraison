const express = require("express");
const router = express.Router();
const {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
  verifier2FA,
  login,
  forgetpassword,
  resetpassword,
  updatedpassword,
} = require("../../controller/auth/auth.controller");
const {
  ValiditeCreat,
  ValiditeLogin,
  ValiditeEmailforgetpassword,
  ValiditePassworUpdit,
  ValiditePassworUpditForget,
} = require("../../validation/auth.validation");
const verifyCodeToken = require("../../middleware/verfyCodeToken");
const verifyToken = require("../../middleware/VerifyToken");

router.get("/verifyAcount/:token", verifierAccount);
router.post("/verify-otp/:token", verifier2FA);
router.get("/getUserById/:id", getUserById);
router.post("/register", ValiditeCreat, regester);
router.post("/login", ValiditeLogin, login);
router.post("/", sendMail);

router.post(
  "/resetpassword/:token",
  ValiditePassworUpditForget,
  verifyCodeToken,
  resetpassword
);
router.post("/forgetpassword", ValiditeEmailforgetpassword, forgetpassword);
router.post("/upditPassword", verifyToken ,ValiditePassworUpdit, updatedpassword );
module.exports = router;
