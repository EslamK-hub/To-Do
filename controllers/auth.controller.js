const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/Auth.model");

const register = async (req, res) => {
    const { username, password } = req.body;

    const isUsernameValid = validator.isLength(username, { min: 3 });

    const isPasswordLengthValid = validator.isLength(password, { min: 8 });
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    if (!isUsernameValid) {
        return res
            .status(400)
            .json({ error: "Username must be at least 3 characters" });
    }

    if (!isPasswordLengthValid) {
        return res
            .status(400)
            .json({ error: "Password must be at least 8 characters long" });
    }

    if (!hasUppercase) {
        return res
            .status(400)
            .json({
                error: "Password must contain at least one uppercase letter",
            });
    }

    if (!hasNumbers) {
        return res
            .status(400)
            .json({ error: "Password must contain at least one number" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Error registering user" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
};
