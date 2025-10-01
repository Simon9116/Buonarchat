const con = require("./connection");
const session = require("express-session");

module.exports = function(req, res, next) {
    if (req.path.startsWith('/login') || req.path.startsWith('/public') || req.path.startsWith('/signup')) {
        return next();
    }

    if (req.session && req.session.user) {
        next();
    }
    else {
        res.redirect("/login");
    }

}