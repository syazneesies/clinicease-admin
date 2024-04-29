function authenticate(req, res, next) {
    const { username, password } = req.body;

    console.log("Received username:", username);
    console.log("Received password:", password);

    // Hardcoded credentials
    if (username === "admin" && password === "admin123") {
        req.user = { username }; // Attach user information to request object
        return res.redirect("/home"); // Proceed to next middleware or route handler
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
}

module.exports = authenticate;

