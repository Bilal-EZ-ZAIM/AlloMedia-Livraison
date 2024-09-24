const express = require("express");
const dotenv = require("dotenv");
const dbConection = require("./config/database");
const app = express();
const authRouter = require("./router/auth/auth.router");
dbConection();
dotenv.config();

app.use(express.json());

app.use("/api/auth/", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
