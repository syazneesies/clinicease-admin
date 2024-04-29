const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Login route
router.get("/login", authController.renderLogin);
router.post("/login", authMiddleware, authController.login);

module.exports = router;

