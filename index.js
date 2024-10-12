const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRouter = require("./routes/auth.route");
const authenticateJWT = require("./middleware/authenticateJWT");
const todoRouter = require("./routes/todo.route");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRouter);

app.use(authenticateJWT);

app.use("/api/todo", todoRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
