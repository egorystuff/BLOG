import { validationResult } from "express-validator";

import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    // создание документа на основании введенных данных
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};
