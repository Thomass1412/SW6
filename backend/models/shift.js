const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: {
        type: String,
        enum: ["Bagsværd Hovedgade 122", "Ankervej 1", "A. C. Meyers Vænge 15", "Silkeborggade 19"],
        default: undefined,
        required: false
    },
    jobTitle: {
        type: String,
        enum: ["Production", "Licorice Maker"],
        default: undefined,
        required: false
    },
    status: { type: String, enum: ["scheduled", "signed-in", "completed", "canceled", "unavailability"], default: "scheduled" }
}, { timestamps: true });

module.exports = mongoose.model("Shift", shiftSchema);
