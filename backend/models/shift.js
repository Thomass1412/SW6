const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: {
        type: String,
        enum: ["Lokation A", "Lokation B", "Lokation C", "Silkeborggade 21"],
        default: undefined,
        required: false
    },
    jobTitle: {
        type: String,
        enum: ["Licorice Making", "Licorice Selling", "Cleaning Machines"],
        default: undefined,
        required: false
    },
    status: { type: String, enum: ["scheduled", "signed-in", "completed", "canceled", "unavailability"], default: "scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
