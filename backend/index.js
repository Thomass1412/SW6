const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Verify Firebase Token Middleware
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).send("No token provided");

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
};

// Routes
app.get("/", (req, res) => {
    res.send("API is running!");
});

app.get("/protected", verifyToken, (req, res) => {
    res.send(`Hello ${req.user.email}, you have access!`);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
