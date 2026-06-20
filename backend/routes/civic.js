const express = require("express");
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");
const {
  createApplication,
  listApplications,
  createGrievance,
  listGrievances,
  createPayment,
  listPayments,
  getTrackingById,
  getFeatureCatalog,
  updateProfile,
  getProfile,
  chat,
  dispatchReceipt,
  adminOverview,
  adminUpdateStatus,
  sendEmailOtp,
  verifyEmailOtp,
  sendMobileOtp,
  verifyMobileOtp,
} = require("../controllers/civicController");

const router = express.Router();

router.get("/catalog", getFeatureCatalog);
router.get("/admin/overview", authenticateAdmin, adminOverview);
router.post("/admin/update-status", authenticateAdmin, adminUpdateStatus);

router.use(authenticateToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/applications", createApplication);
router.get("/applications", listApplications);

router.post("/grievances", createGrievance);
router.get("/grievances", listGrievances);

router.post("/payments", createPayment);
router.get("/payments", listPayments);

router.get("/tracking/:id", getTrackingById);
router.post("/receipts/:receiptNo/dispatch", dispatchReceipt);

router.post("/chat", chat);

router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/send-mobile-otp", sendMobileOtp);
router.post("/verify-mobile-otp", verifyMobileOtp);



module.exports = router;
