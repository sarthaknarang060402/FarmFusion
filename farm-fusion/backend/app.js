import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";

import api from "./routes/api.js";

const app = express();
dotenv.config();
dbConnect();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get("/", (req, res) => {
  res.json({ message: "Farm Fusion" });
});
app.use("/api", api);

app.listen(8080, function () {
  console.log("Listening on port 8080");
});
