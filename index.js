import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/auth/login", (req, res) => {
  console.log(req.body);

  const token = jwt.sign(
    {
      email: req.body.email,
      fillName: "Василий лох",
    },
    "secret123",
  );

  res.json({
    success: true,
    token,
  });
});

app.listen(4444, (err) => {
  if (err) return console.log(err);
  return console.log(`Server started on port ${4444}`);
});
