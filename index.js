const express = require("express");
const dotenv = require("dotenv");
const dbConection = require("./config/database");
const app = express();
dbConection();
dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
