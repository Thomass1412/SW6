const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ["Scheduled", "Completed", "Canceled"], default: "Scheduled" },
});

module.exports = mongoose.model("Shift", ShiftSchema);
