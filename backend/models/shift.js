const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
