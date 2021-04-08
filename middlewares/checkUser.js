const checkUserWithIndexRedirect = (req, res, next) => req.user ? next() : res.redirect("/");
const checkUserWithDashboardRedirect = (req, res, next) => req.user ? res.redirect("/dashboard") : next();

module.exports = { checkUserWithIndexRedirect, checkUserWithDashboardRedirect };
