import { handleRegister } from "./controllers/register.js";
import { handleLogin } from "./controllers/login.js";
import { handleProfile } from "./controllers/profile.js";
import { handleImageApiCall } from "./controllers/clarifai.js";

import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt";
const saltRounds = 10;
const PORT = process.env.PORT || 3000;

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "admin",
    database: "smart-face-detection",
  },
});

//# Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

//# Running Server
app.listen(PORT, () => {
  console.log("Server is running.");
  console.log(`Local:   http://localhost:${PORT}`);
});

//# Log In
app.post("/login", (req, res) => handleLogin(req, res, db, bcrypt));

//# Sign Up - Register Using Async/Await
app.post("/signup", (req, res) =>
  handleRegister(req, res, db, bcrypt, saltRounds)
);

//# Profile
app.get("/profile/:id", (req, res) => handleProfile(req, res, db));

//# Profile
app.post("/image", (req, res) => handleImageApiCall(req, res));
