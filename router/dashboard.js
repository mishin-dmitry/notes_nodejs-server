const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth ,(req, res) => {
  res.render("dashboard", { username: req.user.username });
});

module.exports = router;
