const admin = require("../config/firebase"); // Firebase Admin SDK
const User = require("../models/user"); // MongoDB User Model

// 🔐 Middleware: Verify Firebase Token & Check Admin Role
const checkAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        // ✅ Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const email = decodedToken.email;

        // ✅ Find user in MongoDB
        const user = await User.findOne({ email });
        if (!user || user.role !== "Admin") {
            return res.status(403).json({ error: "Forbidden - Admins only" });
        }

        // ✅ Attach user to request and proceed
        req.user = user;
        next();
    } catch (error) {
        console.error("Authorization Error:", error);
        return res.status(401).json({ error: "Invalid Firebase Token" });
    }
};

module.exports = { checkAdmin };
