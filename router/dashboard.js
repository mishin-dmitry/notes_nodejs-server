const express = require("express");
const auth = require("../middlewares/auth");
const { getNotes, createNote } = require("../db");

const router = express.Router();

router.get("/", auth ,(req, res) => {
  res.render("dashboard", { username: req.user.username });
});

router.get("/notes", auth, async (req, res) => {
  const userId = req.user?.id;

  try {
    const notes = await getNotes(userId);
    res.json({ data: notes });
  } catch (e) {
    res.status(500).send("Error during getting notes");
  }
});

router.post("/notes/new", auth, async (req, res) => {
  const userId = req.user?.id;
  const { title, text } = req.body;

  try {
    const note = await createNote({ userId, title, text });
    return res.json(note);
  } catch (e) {
    res.status(500).send("Error during creating note")
  }
});

module.exports = router;
