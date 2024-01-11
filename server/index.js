import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import { UserController, PostController } from "./controllers/index.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect("mongodb+srv://admin:lantirn1994@cluster0.mt5aysl.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

//-----------------------------------------------------------------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//-----------------------------------------------------------------------------------------------------------------------------------

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

//-----------------------------------------------------------------------------------------------------------------------------------

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe);

//-----------------------------------------------------------------------------------------------------------------------------------

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

//-----------------------------------------------------------------------------------------------------------------------------------
// app.get("/posts/:data", PostController.getAllSortByData);

app.get("/posts", PostController.getAll);
app.get("/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

//-----------------------------------------------------------------------------------------------------------------------------------

app.listen(4444, (err) => {
  if (err) return console.log(err);
  return console.log(`Server OK`);
});
