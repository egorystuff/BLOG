import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/User.js";

mongoose
  .connect("mongodb+srv://admin:lantirn1994@cluster0.mt5aysl.mongodb.net/blog?retryWrites=true&w=majority")
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    // если пользователя нет в базе данных по такому email
    if (!user) return res.status(400).json({ message: "Такого пользователя не существует" });

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    // проверяем совпадает ли введеный пароль с паролем в базе данных
    if (!isValidPass) return res.status(404).json({ message: "Неверный логин или пароль" });

    // создает токен с id пользователя, секретным ключем, и временем жизни токена 30 дней
    const token = jwt.sign({ _id: user._id }, "secretKey", { expiresIn: "30d" });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Проблемы с авторизацией",
    });
  }
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    // алгоритм шифрования пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // создание документа на основании введенных данных
    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });

    //создание пользователя
    const user = await doc.save();

    // создает токен с id пользователя, секретным ключем, и временем жизни токена 30 дней
    const token = jwt.sign({ _id: user._id }, "secretKey", { expiresIn: "30d" });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Проблемы с регистрацией",
    });
  }
});

app.listen(4444, (err) => {
  if (err) return console.log(err);
  return console.log(`Server OK`);
});
