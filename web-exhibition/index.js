const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5050;
const Comments = require("./Comments");

dotenv.config();

let corsOption = {
  origin: PORT, // 허락하는 요청 주소
  credentials: true, // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(express.json());
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "static")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"));

app.get("/", (req, res) => {
  fs.sendfile(path.join(__dirname, "static/index.html"));
});

app.get("/venus", (req, res) => {
  res.sendfile(path.join(__dirname, "static/venus.html"));
});

app.get("/balloon_dog", (req, res) => {
  res.sendfile(path.join(__dirname, "static/BalloonDog.html"));
});

app.get("/mural", (req, res) => {
  res.sendfile(path.join(__dirname, "static/chapter1.html"));
});

app.get("/puzzle", (req, res) => {
  res.sendfile(path.join(__dirname, "static/puzzle.html"));
});

app.get("/rainy_day", (req, res) => {
  res.sendfile(path.join(__dirname, "static/rainy_street.html"));
});

app.get("/portrait", (req, res) => {
  res.sendfile(path.join(__dirname, "static/portrait.html"));
});

app.get("/no5", (req, res) => {
  res.sendfile(path.join(__dirname, "static/jackson.html"));
});

app.get("/popart", (req, res) => {
  res.sendfile(path.join(__dirname, "static/popart.html"));
});

app.get("/guestbook", (req, res) => {
  res.sendfile(path.join(__dirname, "static/guestbook.html"));
});

app.get("/pieces", (req, res) => {
  res.sendfile(path.join(__dirname, "static/pieces.html"));
});


// 404 에러 방지 필요

app.post("/api/comment/write", async (req, res) => {
  try {
    const new_comment = new Comments({
      user_tel: req.body.user_tel,
      comment: req.body.comment,
    });
    const posted = await new_comment.save();
    res.status(200).json(posted);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/api/comments/read", async (req, res) => {
  try {
    const allComments = await Comments.find();
    res.status(200).json(allComments);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log("Server is running");
});
