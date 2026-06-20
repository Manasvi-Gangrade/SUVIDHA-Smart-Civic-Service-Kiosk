const mongoose = require("mongoose");
const { aesEncrypt, aesDecrypt } = require("../utils/encryptionEngine");

const grievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    department: {
      type: String,
      enum: ["MUNICIPAL", "ELECTRICITY", "GAS", "RTO", "REVENUE"],
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g., "Water Disruption", "Gas Leak", "Pothole"
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "EMERGENCY_ZERO"],
      default: "MEDIUM",
    },
    locationCoords: {
      lat: { type: String },
      lng: { type: String },
    },
    photoEvidenceUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "INSPECTED", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "PENDING",
    },
    slaDeadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grievance", grievanceSchema);
