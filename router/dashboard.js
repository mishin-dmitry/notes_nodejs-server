const express = require("express");
const auth = require("../middlewares/auth");
const { getNotes } = require("../db");

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
    res.status(500).send("Error getting notes");
  }
});

module.exports = router;
