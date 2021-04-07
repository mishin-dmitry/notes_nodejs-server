const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

// ROUTERS
app.use("/", require("./router/index"));
app.use("/dashboard", require("./router/dashboard"));

// Handle uncaught errors
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
