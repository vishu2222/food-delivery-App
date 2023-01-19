import express from "express";
import dotenv from "dotenv";
import "./models/queries.js";

dotenv.config();
const port = process.env.PORT;
const app = express();

app.listen(port, () => {
  console.log("server listening on port:", port);
});
