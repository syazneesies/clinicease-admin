const User = require("../models/User");

// Render login view
function renderLogin(req, res) {
    res.redirect("/home");
}

// Login endpoint
function login(req, res) {
    // Return user details if authenticated
    res.json({ username: req.user.username });
}


module.exports = { renderLogin, login };
