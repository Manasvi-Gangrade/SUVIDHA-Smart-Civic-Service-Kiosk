const mongoose = require("mongoose");

const civicPaymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    receiptNo: {
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
      trim: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["upi", "card", "netbanking", "cash", "wallet"],
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
      index: true,
    },
    billDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    dispatchLogs: {
      type: [
        {
          channel: {
            type: String,
            enum: ["email", "sms", "thermal_print"],
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
    channel: {
      type: String,
      default: "kiosk",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CivicPayment", civicPaymentSchema);
