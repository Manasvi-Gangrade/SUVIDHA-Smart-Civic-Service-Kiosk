const mongoose = require("mongoose");

const civicApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
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
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["submitted", "under_approval", "approved", "rejected", "pending", "in_progress", "escalated", "resolved", "closed"],
      default: "submitted",
      index: true,
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
    estimatedCompletionDate: {
      type: Date,
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

module.exports = mongoose.model("CivicApplication", civicApplicationSchema);
