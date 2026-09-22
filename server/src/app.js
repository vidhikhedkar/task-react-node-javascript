const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "SecureStudent API is running successfully",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy",
    });
});

app.use("/api", studentRoutes);

module.exports = app;