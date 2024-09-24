const express = require("express");
const router = express.Router();
const { regester } = require("../../controller/auth/auth.controller");
const { ValiditeCreat } = require("../../validation/auth.validation");

router.post("/register", ValiditeCreat, regester);
module.exports = router;
