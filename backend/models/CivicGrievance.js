const mongoose = require("mongoose");

const civicGrievanceSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    citizenId: {
      type: String,
      required: true,
      index: true,
    },
    citizenName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["electricity", "gas", "municipal"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under_approval", "approved", "rejected", "pending", "in_progress", "escalated", "resolved", "closed"],
      default: "submitted",
      index: true,
    },
    documents: {
      type: [String],
      default: [],
    },
    timeline: {
      type: [
        {
          label: String,
          status: String,
          remarks: String,
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    slaHours: {
      type: Number,
      default: 72,
    },
    dispatchLogs: {
      type: [
        {
          channel: {
            type: String,
            enum: ["email", "sms", "whatsapp", "thermal_print"],
          },
          destination: String,
          status: {
            type: String,
            enum: ["queued", "sent", "failed"],
            default: "queued",
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CivicGrievance", civicGrievanceSchema);
