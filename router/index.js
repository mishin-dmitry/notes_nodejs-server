const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../middlewares/auth");
const { checkUserWithDashboardRedirect } = require("../middlewares/checkUser");
const { hash } = require("../utils");
const { findUserByName, createSession, deleteSession, createUser } = require("../db");

const router = express.Router();
const urlEncoded = bodyParser.urlencoded({ extended: true });

const ONE_HOUR = 60 * 60 * 1000;
const COOKIE_EXPIRES_TIME = new Date(Date.now() + ONE_HOUR);
const DEFAULT_COOKIE_OPTIONS = {
  expires: COOKIE_EXPIRES_TIME,
  httpOnly: true,
};
const USER_ALREADY_EXIST_ERROR_CODE = "23505";

router.post("/login", urlEncoded, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByName(username);

    if (!user || user.password !== hash(password)) {
      return res.redirect("/?authError=true");
    }

    const sessionId = await createSession(user.id);
    res.cookie("sessionId", sessionId, DEFAULT_COOKIE_OPTIONS).redirect("/dashboard");
  } catch (e) {
    res.status(500).send("Error during login");
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    await deleteSession(req.sessionId);

    res.clearCookie("sessionId").redirect("/");
  } catch (e) {
    res.status(500).send("Error during logout");
  }
});

router.post("/signup", urlEncoded, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    return res.redirect("/?authError=true");
  }

  const userData = {
    username,
    password: hash(password)
  };

  try {
    const userId = await createUser(userData);
    const sessionId = await createSession(userId);

    res.cookie("sessionId", sessionId, DEFAULT_COOKIE_OPTIONS).redirect("/dashboard");
  } catch (e) {
    if (e.code === USER_ALREADY_EXIST_ERROR_CODE) {
      return res.status(409).send("User already exist");
    }

    res.status(500).send("Error during sign up")
  }
});

router.get("/", auth, checkUserWithDashboardRedirect,  (req, res) => {
  res.render("index", {
    user: req.user,
    authError: req.query.authError === "true" ? "Wrong username or password" : req.query.authError,
  });
});

module.exports = router;
