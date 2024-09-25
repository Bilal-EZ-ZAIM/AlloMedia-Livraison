const express = require("express");
const router = express.Router();
const {
  regester,
  getUserById,
  verifierAccount,
  sendMail,
} = require("../../controller/auth/auth.controller");
const { ValiditeCreat } = require("../../validation/auth.validation");

router.get("/verifyAcount/:token", verifierAccount);
router.get("/getUserById/:id", getUserById);
router.post("/register", ValiditeCreat, regester);
router.post("/", sendMail);
module.exports = router;
