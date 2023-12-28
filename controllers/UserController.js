import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
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
};

export const login = async (req, res) => {
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
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const { passwordHash, ...userData } = user._doc;

    res.json({
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Проблема авторизации",
    });
  }
};
