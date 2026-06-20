const CivicApplication = require("../models/CivicApplication");
const CivicGrievance = require("../models/CivicGrievance");
const CivicPayment = require("../models/CivicPayment");
const Citizen = require("../models/Citizen");
const { getMockMode, state } = require("../config/runtimeStore");
const otpService = require("../utils/otpService");

const civicFeatureCatalog = {
  electricity: [
    "Welcome Screen and User Login",
    "New connection and load extension requests",
    "Meter replacement and shifting services",
    "Complaint registration",
    "Credential management and update consumer info",
    "Track requests and complaints",
    "Receipt generation, printing and emailing",
  ],
  gas: [
    "Welcome Screen and User Login",
    "Main Menu and Service Navigation",
    "New Gas Connection or Connection Change Request",
    "Register Complaint",
    "Track Complaint or Service Request",
    "Edit Credentials or Consumer Profile",
    "Receipt Generation",
  ],
  municipal: [
    "Welcome Screen and User Login",
    "New Water Connection or Upgrade",
    "Register Municipal Grievances",
    "Receipt Generation",
    "Track Request or Complaint",
    "Credential Management and Update Consumer Info",
  ],
};

const validateAdminKey = (req) => {
  const provided = req.headers["x-admin-key"];
  const expected = process.env.ADMIN_API_KEY || "smartcity-admin-key";
  return provided && provided === expected;
};

const isAllowedStatus = (status) => {
  return ["submitted", "under_approval", "approved", "rejected", "pending", "in_progress", "escalated", "resolved", "closed"].includes(status);
};

const resolveCitizen = async (req) => {
  if (req.user && typeof req.user === "object" && req.user.id) {
    return req.user;
  }

  if (typeof req.user === "string") {
    const byInternal = await Citizen.findById(req.user);
    if (byInternal) return byInternal;

    const byCitizenId = await Citizen.findOne({ id: req.user });
    if (byCitizenId) return byCitizenId;
  }

  return null;
};

const createApplication = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const { applicationId, department, serviceType, formData = {}, documents = [] } = req.body;

    if (!applicationId || !department || !serviceType) {
      return res.status(400).json({
        success: false,
        message: "applicationId, department, and serviceType are required",
      });
    }

    if (getMockMode()) {
      const created = {
        applicationId,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        department,
        serviceType,
        formData,
        documents,
        status: "under_approval",
        timeline: [
          {
            label: "Application submitted",
            status: "submitted",
            remarks: "Request received at kiosk",
            timestamp: new Date(),
          },
          {
            label: "Under admin approval",
            status: "under_approval",
            remarks: "Awaiting admin verification",
            timestamp: new Date(),
          },
        ],
        estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      state.applications.unshift(created);
      
      const targetEmail = formData.email || citizen.email;
      if (targetEmail) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendApplicationEmail(targetEmail, formData.fullName || citizen.fullName, {
              applicationId, department, serviceType, date: created.createdAt, formData
          }).catch(console.error);
      }

      const targetPhone = formData.phone || citizen.mobile;
      if (targetPhone) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendApplicationSMS(targetPhone, formData.fullName || citizen.fullName, {
              applicationId, serviceType
          }).catch(console.error);
      }

      return res.status(201).json({ success: true, data: created });
    }

    const created = await CivicApplication.create({
      applicationId,
      citizenId: citizen.id,
      citizenName: citizen.fullName,
      department,
      serviceType,
      formData,
      documents,
      status: "under_approval",
      timeline: [
        {
          label: "Application submitted",
          status: "submitted",
          remarks: "Request received at kiosk",
        },
        {
          label: "Under admin approval",
          status: "under_approval",
          remarks: "Awaiting admin verification",
        },
      ],
      estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    const targetEmail = formData.email || citizen.email;
    if (targetEmail) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendApplicationEmail(targetEmail, formData.fullName || citizen.fullName, {
            applicationId, department, serviceType, date: created.createdAt || new Date(), formData
        }).catch(console.error);
    }

    const targetPhone = formData.phone || citizen.mobile;
    if (targetPhone) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendApplicationSMS(targetPhone, formData.fullName || citizen.fullName, {
            applicationId, serviceType
        }).catch(console.error);
    }

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("createApplication error", error);
    return res.status(500).json({ success: false, message: "Failed to create application" });
  }
};

const listApplications = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const department = req.query.department;
    const query = { citizenId: citizen.id };
    if (department) query.department = department;

    if (getMockMode()) {
      const data = state.applications.filter((item) => {
        if (item.citizenId !== citizen.id) return false;
        if (department && item.department !== department) return false;
        return true;
      });
      return res.json({ success: true, data });
    }

    const data = await CivicApplication.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("listApplications error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

const createGrievance = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const {
      complaintId,
      department,
      category,
      description,
      priority = "medium",
      documents = [],
    } = req.body;

    if (!complaintId || !department || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "complaintId, department, category, and description are required",
      });
    }

    if (getMockMode()) {
      const created = {
        complaintId,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        department,
        category,
        description,
        priority,
        status: "under_approval",
        documents,
        timeline: [
          {
            label: "Complaint submitted",
            status: "submitted",
            remarks: "Complaint registered from kiosk",
            timestamp: new Date(),
          },
          {
            label: "Under admin approval",
            status: "under_approval",
            remarks: "Awaiting admin verification",
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      state.grievances.unshift(created);

      if (citizen.email) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendComplaintEmail(citizen.email, citizen.fullName, {
              complaintId, department, category, priority, date: created.createdAt, description
          }).catch(console.error);
      }

      const targetPhone = citizen.mobile;
      if (targetPhone) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendComplaintSMS(targetPhone, citizen.fullName, {
              complaintId, category
          }).catch(console.error);
      }

      return res.status(201).json({ success: true, data: created });
    }

    const created = await CivicGrievance.create({
      complaintId,
      citizenId: citizen.id,
      citizenName: citizen.fullName,
      department,
      category,
      description,
      priority,
      status: "under_approval",
      documents,
      timeline: [
        {
          label: "Complaint submitted",
          status: "submitted",
          remarks: "Complaint registered from kiosk",
        },
        {
          label: "Under admin approval",
          status: "under_approval",
          remarks: "Awaiting admin verification",
        },
      ],
    });

    if (citizen.email) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendComplaintEmail(citizen.email, citizen.fullName, {
            complaintId, department, category, priority, date: created.createdAt || new Date(), description
        }).catch(console.error);
    }

    const targetPhone = citizen.mobile;
    if (targetPhone) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendComplaintSMS(targetPhone, citizen.fullName, {
            complaintId, category
        }).catch(console.error);
    }

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("createGrievance error", error);
    return res.status(500).json({ success: false, message: "Failed to create grievance" });
  }
};

const listGrievances = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const department = req.query.department;
    const query = { citizenId: citizen.id };
    if (department) query.department = department;

    if (getMockMode()) {
      const data = state.grievances.filter((item) => {
        if (item.citizenId !== citizen.id) return false;
        if (department && item.department !== department) return false;
        return true;
      });
      return res.json({ success: true, data });
    }

    const data = await CivicGrievance.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("listGrievances error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch grievances" });
  }
};

const createPayment = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const {
      transactionId,
      receiptNo,
      department,
      serviceType,
      amount,
      paymentMethod,
      billDetails = {},
    } = req.body;

    if (!transactionId || !receiptNo || !department || !serviceType || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment fields",
      });
    }

    if (getMockMode()) {
      const created = {
        transactionId,
        receiptNo,
        citizenId: citizen.id,
        citizenName: citizen.fullName,
        department,
        serviceType,
        amount,
        paymentMethod,
        billDetails,
        status: "success",
        dispatchLogs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      state.payments.unshift(created);

        const targetEmail = billDetails.email || citizen.email;
        if (targetEmail) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendReceiptEmail(targetEmail, citizen.fullName, {
              receiptNo: created.receiptNo, amount, department, serviceType, date: created.createdAt
          }).catch(console.error);
      }

      const targetPhone = billDetails.phone || citizen.mobile;
      if (targetPhone) {
          const notificationService = require('../utils/notificationService');
          notificationService.sendReceiptSMS(targetPhone, citizen.fullName, {
              receiptNo: created.receiptNo, amount, department, serviceType
          }).catch(console.error);
      }

      return res.status(201).json({ success: true, data: created });
    }

    const created = await CivicPayment.create({
      transactionId,
      receiptNo,
      citizenId: citizen.id,
      citizenName: citizen.fullName,
      department,
      serviceType,
      amount,
      paymentMethod,
      billDetails,
      status: "success",
    });

    const targetEmail = billDetails.email || citizen.email;
    if (targetEmail) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendReceiptEmail(targetEmail, citizen.fullName, {
            receiptNo, amount, department, serviceType, date: created.createdAt || new Date()
        }).catch(console.error);
    }

    const targetPhone = billDetails.phone || citizen.mobile;
    if (targetPhone) {
        const notificationService = require('../utils/notificationService');
        notificationService.sendReceiptSMS(targetPhone, citizen.fullName, {
            receiptNo, amount, department, serviceType
        }).catch(console.error);
    }

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("createPayment error", error);
    return res.status(500).json({ success: false, message: "Failed to save payment" });
  }
};

const listPayments = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    if (getMockMode()) {
      const data = state.payments.filter((item) => item.citizenId === citizen.id);
      return res.json({ success: true, data });
    }

    const data = await CivicPayment.find({ citizenId: citizen.id }).sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("listPayments error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch payments" });
  }
};

const getTrackingById = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const { id } = req.params;

    if (getMockMode()) {
      const app = state.applications.find((item) => item.applicationId === id && item.citizenId === citizen.id);
      if (app) return res.json({ success: true, type: "application", data: app });

      const grievance = state.grievances.find((item) => item.complaintId === id && item.citizenId === citizen.id);
      if (grievance) return res.json({ success: true, type: "grievance", data: grievance });

      const payment = state.payments.find(
        (item) => (item.transactionId === id || item.receiptNo === id) && item.citizenId === citizen.id,
      );
      if (payment) return res.json({ success: true, type: "payment", data: payment });

      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const app = await CivicApplication.findOne({ applicationId: id, citizenId: citizen.id });
    if (app) {
      return res.json({ success: true, type: "application", data: app });
    }

    const grievance = await CivicGrievance.findOne({ complaintId: id, citizenId: citizen.id });
    if (grievance) {
      return res.json({ success: true, type: "grievance", data: grievance });
    }

    const payment = await CivicPayment.findOne({ $or: [{ transactionId: id }, { receiptNo: id }], citizenId: citizen.id });
    if (payment) {
      return res.json({ success: true, type: "payment", data: payment });
    }

    return res.status(404).json({ success: false, message: "Record not found" });
  } catch (error) {
    console.error("getTrackingById error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch tracking details" });
  }
};

const getFeatureCatalog = async (req, res) => {
  return res.json({
    success: true,
    data: {
      languages: ["en", "hi", "ta", "te", "mr", "as", "gu", "pa", "bn", "kn"],
      organizations: ["electricity", "gas", "municipal"],
      modules: civicFeatureCatalog,
      kioskFeatures: ["AI Chatbot", "Admin Dashboard", "Accessibility mode", "Thermal receipt printing"],
    },
  });
};

const adminOverview = async (req, res) => {
  try {
    if (!validateAdminKey(req)) {
      return res.status(403).json({ success: false, message: "Invalid admin key" });
    }

    let applications;
    let grievances;
    let payments;

    if (getMockMode()) {
      applications = state.applications.slice(0, 300);
      grievances = state.grievances.slice(0, 300);
      payments = state.payments.slice(0, 300);
    } else {
      [applications, grievances, payments] = await Promise.all([
        CivicApplication.find({}).sort({ createdAt: -1 }).limit(300),
        CivicGrievance.find({}).sort({ createdAt: -1 }).limit(300),
        CivicPayment.find({}).sort({ createdAt: -1 }).limit(300),
      ]);
    }

    return res.json({
      success: true,
      data: {
        applications,
        grievances,
        payments,
        stats: {
          totalApplications: applications.length,
          totalGrievances: grievances.length,
          totalPayments: payments.length,
          openItems:
            applications.filter((a) => ["submitted", "pending", "in_progress"].includes(a.status)).length +
            grievances.filter((g) => ["submitted", "pending", "in_progress"].includes(g.status)).length,
        },
      },
    });
  } catch (error) {
    console.error("adminOverview error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin overview" });
  }
};

const adminUpdateStatus = async (req, res) => {
  try {
    if (!validateAdminKey(req)) {
      return res.status(403).json({ success: false, message: "Invalid admin key" });
    }

    const { itemType, itemId, status, remarks = "Status updated by admin" } = req.body;
    if (!itemType || !itemId || !status || !isAllowedStatus(status)) {
      return res.status(400).json({
        success: false,
        message: "itemType, itemId, and valid status are required",
      });
    }

    if (itemType === "application") {
      let doc;
      if (getMockMode()) {
        doc = state.applications.find((item) => item.applicationId === itemId);
        if (!doc) return res.status(404).json({ success: false, message: "Application not found" });
        doc.status = status;
        doc.timeline.push({ label: `Status changed to ${status}`, status, remarks, timestamp: new Date() });
        doc.updatedAt = new Date();
      } else {
        doc = await CivicApplication.findOne({ applicationId: itemId });
        if (!doc) return res.status(404).json({ success: false, message: "Application not found" });
        doc.status = status;
        doc.timeline.push({ label: `Status changed to ${status}`, status, remarks, timestamp: new Date() });
        await doc.save();
      }

        if (["approved", "rejected", "resolved", "closed"].includes(status)) {
         const citizen = getMockMode()
             ? state.citizens?.find(c => (c.id === doc.citizenId || c._id === doc.citizenId)) 
             : await Citizen.findOne({ id: doc.citizenId });
         const citizenEmail = citizen?.email || doc.formData?.email;

         if (citizenEmail) {
           const statusLabel = status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : status;
           const statusNote = status === "approved"
             ? "Your request has been approved. Departmental work will start shortly."
             : status === "rejected"
             ? "Your request has been rejected. Please review remarks and resubmit if needed."
             : "Your request status has been updated.";
           const html = `<h2>SUVIDHA Update</h2><p>Request <b>${doc.applicationId}</b> is now <b>${statusLabel}</b>.</p><p>${statusNote}</p><p>Remarks: ${remarks}</p>`;
           require('../utils/notificationService').dispatchEmail(citizenEmail, `SUVIDHA Update: ${statusLabel}`, html).catch(console.error);
         }

         const targetPhone = doc.formData?.phone || (citizen ? citizen.mobile : null);
         if (targetPhone) {
           require('../utils/notificationService').sendStatusUpdateSMS(targetPhone, doc.citizenName || "Citizen", {
             itemId: doc.applicationId,
             status,
             remarks
           }).catch(console.error);
         }
      }
      return res.json({ success: true, data: doc });
    }

    if (itemType === "grievance") {
      let doc;
      if (getMockMode()) {
        doc = state.grievances.find((item) => item.complaintId === itemId);
        if (!doc) return res.status(404).json({ success: false, message: "Grievance not found" });
        doc.status = status;
        doc.timeline.push({ label: `Status changed to ${status}`, status, remarks, timestamp: new Date() });
        doc.updatedAt = new Date();
      } else {
        doc = await CivicGrievance.findOne({ complaintId: itemId });
        if (!doc) return res.status(404).json({ success: false, message: "Grievance not found" });
        doc.status = status;
        doc.timeline.push({ label: `Status changed to ${status}`, status, remarks, timestamp: new Date() });
        await doc.save();
      }

        if (["approved", "rejected", "resolved", "closed"].includes(status)) {
         const citizen = getMockMode()
             ? state.citizens?.find(c => (c.id === doc.citizenId || c._id === doc.citizenId)) 
             : await Citizen.findOne({ id: doc.citizenId });
         const citizenEmail = citizen?.email;

         if (citizenEmail) {
           const statusLabel = status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : status;
           const statusNote = status === "approved"
             ? "Your grievance has been approved. Departmental action has started."
             : status === "rejected"
             ? "Your grievance has been rejected. Please review remarks and submit updated details."
             : "Your grievance status has been updated.";
           const html = `<h2>SUVIDHA Update</h2><p>Grievance <b>${doc.complaintId}</b> is now <b>${statusLabel}</b>.</p><p>${statusNote}</p><p>Remarks: ${remarks}</p>`;
           require('../utils/notificationService').dispatchEmail(citizenEmail, `SUVIDHA Update: ${statusLabel}`, html).catch(console.error);
         }

         const targetPhone = citizen ? citizen.mobile : null;
         if (targetPhone) {
           require('../utils/notificationService').sendStatusUpdateSMS(targetPhone, doc.citizenName || "Citizen", {
             itemId: doc.complaintId,
             status,
             remarks
           }).catch(console.error);
         }
      }
      return res.json({ success: true, data: doc });
    }

    return res.status(400).json({ success: false, message: "Unsupported itemType" });
  } catch (error) {
    console.error("adminUpdateStatus error", error);
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

const dispatchReceipt = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const { receiptNo } = req.params;
    const { channel, destination = "kiosk" } = req.body;

    if (!["email", "sms", "whatsapp", "thermal_print"].includes(channel)) {
      return res.status(400).json({ success: false, message: "Invalid dispatch channel" });
    }

    let documentRecord;
    let type;
    if (getMockMode()) {
       documentRecord = state.payments.find((item) => item.receiptNo === receiptNo && item.citizenId === citizen.id);
       if (documentRecord) type = "payment";
       if (!documentRecord) {
           documentRecord = state.grievances.find((item) => item.complaintId === receiptNo && item.citizenId === citizen.id);
           if (documentRecord) type = "grievance";
       }
       if (!documentRecord) {
           documentRecord = state.applications.find((item) => item.applicationId === receiptNo && item.citizenId === citizen.id);
           if (documentRecord) type = "application";
       }
    } else {
       documentRecord = await CivicPayment.findOne({ receiptNo, citizenId: citizen.id });
       if (documentRecord) type = "payment";
       if (!documentRecord) {
           documentRecord = await CivicGrievance.findOne({ complaintId: receiptNo, citizenId: citizen.id });
           if (documentRecord) type = "grievance";
       }
       if (!documentRecord) {
           documentRecord = await CivicApplication.findOne({ applicationId: receiptNo, citizenId: citizen.id });
           if (documentRecord) type = "application";
       }
    }

    if (!documentRecord) return res.status(404).json({ success: false, message: "Record not found" });

    // Actually dispatch if it's email or sms/whatsapp
    let dispatchResult = { success: true };
    const notificationService = require('../utils/notificationService');
    
    if (channel === 'email') {
      const emailDest = destination !== "kiosk" ? destination : citizen.email;
      if (!emailDest) {
         return res.status(400).json({ success: false, message: "No email address found for user" });
      }
      
      if (type === "payment") {
          dispatchResult = await notificationService.sendReceiptEmail(emailDest, citizen.fullName || citizen.id, {
             receiptNo: documentRecord.receiptNo, amount: documentRecord.amount, department: documentRecord.department, serviceType: documentRecord.serviceType, date: documentRecord.createdAt || new Date()
          });
      } else if (type === "grievance") {
          dispatchResult = await notificationService.sendComplaintEmail(emailDest, citizen.fullName || citizen.id, {
             complaintId: documentRecord.complaintId, department: documentRecord.department, category: documentRecord.category, priority: documentRecord.priority, date: documentRecord.createdAt || new Date(), description: documentRecord.description
          });
      } else if (type === "application") {
          dispatchResult = await notificationService.sendApplicationEmail(emailDest, citizen.fullName || citizen.id, {
             applicationId: documentRecord.applicationId, department: documentRecord.department, serviceType: documentRecord.serviceType, date: documentRecord.createdAt || new Date(), formData: documentRecord.formData || {}
          });
      }
    } else if (channel === 'sms') {
       dispatchResult = await notificationService.dispatchSMS(
          destination !== "kiosk" ? destination : citizen.mobile,
          `SUVIDHA Alert: Reference ${receiptNo} for ${documentRecord.department || documentRecord.serviceType} success.`
       );
    } else if (channel === 'whatsapp') {
       dispatchResult = await notificationService.dispatchWhatsApp(
          destination !== "kiosk" ? destination : citizen.mobile,
          `SUVIDHA Alert: Reference ${receiptNo} for ${documentRecord.department || documentRecord.serviceType} success.`
       );
    }

    // Standardized logging for all types (Payment, Application, Grievance)
    if (!documentRecord.dispatchLogs) documentRecord.dispatchLogs = [];
    documentRecord.dispatchLogs.push({ 
       channel, 
       destination: destination !== "kiosk" ? destination : (channel === 'email' ? citizen.email : citizen.mobile), 
       status: dispatchResult.success ? "sent" : "failed", 
       previewUrl: dispatchResult.previewUrl || null,
       timestamp: new Date() 
    });
    documentRecord.updatedAt = new Date();
    if (!getMockMode()) await documentRecord.save();

    return res.json({
      success: dispatchResult.success,
      message: dispatchResult.success ? `Receipt dispatched via ${channel}` : `Failed to dispatch via ${channel}`,
      previewUrl: dispatchResult.previewUrl,
      data: documentRecord,
    });
  } catch (error) {
    console.error("dispatchReceipt error", error);
    return res.status(500).json({ success: false, message: "Failed to dispatch receipt" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    const { fullName, mobile, email } = req.body;

    if (getMockMode()) {
      if (fullName) citizen.fullName = fullName;
      if (mobile) citizen.mobile = mobile;
      if (typeof email !== "undefined") citizen.email = email;

      return res.json({
        success: true,
        message: "Profile updated",
        data: {
          id: citizen.id,
          fullName: citizen.fullName,
          aadhaar: citizen.aadhaar ? `****-****-${citizen.aadhaar.slice(-4)}` : "",
          mobile: citizen.mobile ? `${citizen.mobile.slice(0, 5)}-${citizen.mobile.slice(-5)}` : "",
          accountId: citizen.accountId,
          email: citizen.email,
        },
      });
    }

    if (fullName) citizen.fullName = fullName;
    if (mobile) citizen.mobile = mobile;
    if (typeof email !== "undefined") citizen.email = email;

    await citizen.save();

    return res.json({
      success: true,
      message: "Profile updated",
      data: {
        id: citizen.id,
        fullName: citizen.fullName,
        aadhaar: citizen.maskedAadhaar,
        mobile: citizen.maskedMobile,
        accountId: citizen.accountId,
        email: citizen.email,
      },
    });
  } catch (error) {
    console.error("updateProfile error", error);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

const getProfile = async (req, res) => {
  try {
    const citizen = await resolveCitizen(req);
    if (!citizen) {
      return res.status(401).json({ success: false, message: "Citizen session invalid" });
    }

    if (getMockMode()) {
      return res.json({
        success: true,
        data: {
          id: citizen.id,
          fullName: citizen.fullName,
          aadhaar: citizen.aadhaar ? `****-****-${citizen.aadhaar.slice(-4)}` : "",
          mobile: citizen.mobile ? `${citizen.mobile.slice(0, 5)}-${citizen.mobile.slice(-5)}` : "",
          accountId: citizen.accountId,
          email: citizen.email,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        id: citizen.id,
        fullName: citizen.fullName,
        aadhaar: citizen.maskedAadhaar,
        mobile: citizen.maskedMobile,
        accountId: citizen.accountId,
        email: citizen.email,
      },
    });
  } catch (error) {
    console.error("getProfile error", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

const chat = async (req, res) => {
  try {
    const { message = "" } = req.body;
    const text = String(message || "").trim().toLowerCase();

    if (!text) {
      return res.json({
        success: true,
        reply:
          "I can help with Bill Payment, New Connection, Grievance, Tracking, Documents, and OTP support.\nType your question, for example: 'How to apply for new electricity connection?'",
      });
    }

    const hasAny = (keywords) => keywords.some((k) => text.includes(k));

    const intents = [
      {
        keys: ["bill", "payment", "pay", "बिल", "पेमेंट", "भुगतान"],
        answer:
          "Bill Payment steps:\n1. Open Dashboard > Pay Bill.\n2. Select Electricity/Gas/Municipal.\n3. Enter account or consumer number.\n4. Confirm amount and choose UPI/Card/NetBanking.\n5. Submit to generate receipt instantly.\n\nIf payment failed but money was debited, save transaction ID and raise a grievance.",
      },
      {
        keys: ["new connection", "connection", "load", "नाम बदल", "नई कनेक्शन", "कनेक्शन"],
        answer:
          "New Connection / Service Request steps:\n1. Open Service Requests.\n2. Select utility and service type.\n3. Fill personal details and verify email OTP (if required).\n4. Upload Aadhaar, address proof, and supporting documents.\n5. Review and submit.\n\nYou will get an Application ID for tracking.",
      },
      {
        keys: ["complaint", "grievance", "issue", "problem", "शिकायत", "समस्या"],
        answer:
          "Register Complaint steps:\n1. Open Register Complaint.\n2. Choose utility and complaint category.\n3. Add clear description and photos/documents (optional).\n4. Submit to get Complaint ID.\n\nUse Tracking with Complaint ID to check progress.",
      },
      {
        keys: ["track", "status", "tracking", "application id", "complaint id", "स्थिति", "ट्रैक"],
        answer:
          "Tracking help:\n1. Open Tracking page.\n2. Enter Application ID / Complaint ID / Receipt No.\n3. View current status (submitted, under approval, approved, rejected, etc.).\n\nIf ID is not found, confirm exact number from your receipt.",
      },
      {
        keys: ["otp", "email otp", "mobile otp", "verify", "verification", "ओटीपी"],
        answer:
          "OTP support:\n1. Choose Email or Mobile verification.\n2. Click 'Send OTP'.\n3. Enter the 6-digit code received via Email or SMS.\n4. Click Verify to proceed.\n\nIf OTP is not received, check spam (for email) or signal (for mobile) and retry after 30 seconds.",
      },
      {
        keys: ["document", "upload", "aadhaar", "address proof", "दस्तावेज", "अपलोड"],
        answer:
          "Document upload help:\n1. Keep files clear and readable (JPG/PDF preferred).\n2. Upload Aadhaar proof and address proof first.\n3. Upload additional files if requested.\n4. Ensure upload count is visible before submission.",
      },
      {
        keys: ["hello", "hi", "hey", "namaste", "नमस्ते"],
        answer:
          "Namaste! I can help you with payments, new connection, complaints, tracking, OTP verification, and document upload. Tell me what you want to do.",
      },
    ];

    const matched = intents.find((intent) => hasAny(intent.keys));

    const reply = matched
      ? matched.answer
      : "I can help with:\n1. Bill payment\n2. New connection / service requests\n3. Complaint registration\n4. Tracking status\n5. OTP and document upload issues\n\nPlease type your question in English or Hindi with one keyword (bill, connection, complaint, tracking, otp, upload).";

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("chat error", error);
    return res.status(500).json({ success: false, message: "Failed to process chatbot request" });
  }
};

const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  global.emailOtpStore = global.emailOtpStore || {};
  global.emailOtpStore[email] = otp;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0ea5e9;">SUVIDHA Verification</h2>
        <p>Your one-time passcode for email verification is:</p>
        <h1 style="letter-spacing: 5px; color: #333; background: #f4f4f5; padding: 10px; text-align: center; border-radius: 4px;">${otp}</h1>
        <p style="color: #666; font-size: 13px;">Please enter this on the kiosk to proceed. It is valid for 10 minutes.</p>
    </div>
  `;

  const notificationService = require('../utils/notificationService');
  const result = await notificationService.dispatchEmail(email, "Your Verification OTP", html);
  
  const isDev = process.env.NODE_ENV !== "production";
  if (result.success) {
      return res.json({ success: true, message: "OTP sent to email", previewUrl: result.previewUrl, devOtp: isDev ? otp : undefined });
  } else {
      if (isDev) {
        console.warn(`Email OTP dispatch failed; fallback OTP active for ${email}. Reason: ${result.error}`);
        return res.json({
          success: true,
          message: "SMTP unavailable. OTP generated in fallback mode.",
          devOtp: otp,
          warning: result.error,
        });
      }
      return res.status(500).json({ success: false, message: "Failed to dispatch email", error: result.error });
  }
};

const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });
  
  global.emailOtpStore = global.emailOtpStore || {};
  const storedOtp = global.emailOtpStore[email];
  
  if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
  
  delete global.emailOtpStore[email];
  return res.json({ success: true, message: "Email verified successfully" });
};

const sendMobileOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ success: false, message: "Mobile number required" });
  
  const result = await otpService.sendMobileOTP(mobile);
  
  if (result.success) {
      return res.json({ success: true, message: "OTP sent to mobile", sid: result.sid });
  } else {
      return res.status(500).json({ success: false, message: result.message || "Failed to send mobile OTP" });
  }
};

const verifyMobileOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP required" });
  
  const result = await otpService.verifyMobileOTP(mobile, otp);
  
  if (result.success) {
      return res.json({ success: true, message: "Mobile verified successfully" });
  } else {
      return res.status(400).json({ success: false, message: result.message || "OTP verification failed" });
  }
};

module.exports = {
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
};
