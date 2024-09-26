const express = require("express");
const router = express.Router();
const {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
  verifier2FA,
  login,
} = require("../../controller/auth/auth.controller");
const {
  ValiditeCreat,
  ValiditeLogin,
} = require("../../validation/auth.validation");

router.get("/verifyAcount/:token", verifierAccount);
router.post("/verify-otp/:token", verifier2FA);
router.get("/getUserById/:id", getUserById);
router.post("/register", ValiditeCreat, regester);
router.post("/login", ValiditeLogin, login);
router.post("/", sendMail);

router.post("/resetpassword/:token", ValiditeCreat, regester);
router.post("/forgetpassword ", ValiditeLogin, login);
module.exports = router;
