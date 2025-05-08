const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    jobTitle: { type: [String], enum: ["Licorice Making", "Licorice Selling", "Cleaning Machines"], default: [] },
    hoursPerWeek: { type: Number, default: 40 },
    pushToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
