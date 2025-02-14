const User = require("../models/user");

const checkAdmin = async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

module.exports = { checkAdmin };
