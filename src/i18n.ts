import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Centralized Language Detection Function
export function getCurrentLanguage(): string {
  try {
    const lang = i18n.language;
    if (!lang) {
      console.warn("Language detection failed: i18n.language is undefined. Defaulting to en.");
      return "en";
    }
    return lang.split("-")[0];
  } catch (error) {
    console.error("Language detection failed with error:", error);
    return "en";
  }
}

// English Statically Embedded Translations
const enTranslation = {
  "appTitle": "SUVIDHA",
  "appSubtitle": "Smart Urban Virtual Interactive Digital Helpdesk Assistant",
  "tagline3": "Where civic services become smart solutions.",
  "enterKiosk": "ENTER KIOSK",
  "heroTitle": "SUVIDHA",
  "heroSubtitle": "Your one-stop digital kiosk for all urban civic services. Fast, transparent, and accessible for every citizen.",
  "tagline1": "One kiosk. All civic services. Any citizen. Any language.",
  "tagline2": "Technology that listens, understands, and serves every citizen — equally.",
  "trackRequest": "TRACK REQUEST",
  "registerComplaint": "FILE COMPLAINT",
  "selectDepartment": "Select a Department",
  "selectDepartmentDesc": "Choose the service category you need assistance with",
  "quickActions": "Quick Actions",
  "myDashboard": "My Dashboard",
  "dashboardDesc": "View all your requests",
  "trackStatusDesc": "Check your request status",
  "submitGrievance": "Submit a new grievance",
  "footerText": "SUVIDHA – Smart Urban Digital Helpdesk Assistant • A Digital India Initiative",
  "adminLogin": "Admin Login",
  "back": "Back",
  "home": "Home",
  "departments": {
    "electricity": "Electricity",
    "gas": "Gas Distribution",
    "municipal": "Municipal Services",
    "water": "Water Supply",
    "waste": "Waste Management",
    "property": "Property & Tax"
  },
  "departmentDesc": {
    "electricity": "New connections, billing, outage reports & meter services",
    "gas": "New connections, cylinder booking & safety complaints",
    "municipal": "Property tax, civic grievances & local services",
    "water": "New connections, billing & leakage complaints",
    "waste": "Collection issues, missed pickups & sanitation",
    "property": "Property tax enquiry, assessment & payments"
  },
  "dept": {
    "electricity": {
      "title": "Electricity Utility Services",
      "desc": "Manage your electricity connections, bills, and report issues",
      "s1": "New Electricity Connection",
      "d1": "Apply for a new domestic or commercial electricity connection",
      "s2": "Bill Viewing & Payment",
      "d2": "View your current bill and get payment redirection",
      "s3": "Meter-Related Complaints",
      "d3": "Report faulty meters, meter reading disputes",
      "s4": "Power Outage Reporting",
      "d4": "Report power cuts and outages in your area",
      "s5": "Load Change Request",
      "d5": "Request increase or decrease in sanctioned load"
    },
    "gas": {
      "title": "Gas Distribution Services",
      "desc": "Gas connections, cylinder booking, and safety services",
      "s1": "New Gas Connection",
      "d1": "Apply for a new LPG gas connection",
      "s2": "Cylinder Booking Assistance",
      "d2": "Book refill cylinders and track delivery",
      "s3": "Leakage & Safety Complaints",
      "d3": "Report gas leaks and safety hazards",
      "s4": "Subsidy Status Enquiry",
      "d4": "Check your LPG subsidy credit status"
    },
    "municipal": {
      "title": "Municipal Corporation Services",
      "desc": "Property tax, civic grievances, and local governance services",
      "s1": "Property Tax Information",
      "d1": "View property tax details and payment status",
      "s2": "Local Grievance Submission",
      "d2": "Submit complaints about civic issues",
      "s3": "Contact Municipal Office",
      "d3": "Get helpline numbers and office addresses"
    },
    "water": {
      "title": "Water Supply Services",
      "desc": "Water connections, billing, and leakage complaints",
      "s1": "New Water Connection",
      "d1": "Apply for a new water supply connection",
      "s2": "Water Bill Enquiry",
      "d2": "View and pay your water supply bills",
      "s3": "Leakage Complaint",
      "d3": "Report water pipeline leaks and issues"
    },
    "waste": {
      "title": "Waste Management Services",
      "desc": "Garbage collection, sanitation, and cleanliness services",
      "s1": "Garbage Collection Issues",
      "d1": "Report irregular garbage collection",
      "s2": "Missed Pickup Reporting",
      "d2": "Report missed waste pickup from your area",
      "s3": "Sanitation Complaints",
      "d3": "Report sanitation and hygiene issues"
    },
    "property": {
      "title": "Property & Tax Services",
      "desc": "Property assessment, tax payments, and related services",
      "s1": "Property Tax Payment",
      "d1": "Pay your property tax online",
      "s2": "Assessment Details",
      "d2": "View your property assessment information",
      "s3": "New Property Registration",
      "d3": "Register a new property with municipal records"
    },
    "onlineKiosk": "Online & Kiosk Services",
    "walkIn": "Walk-in Services",
    "walkInDesc": "Visiting the office? Generate a digital token to skip the manual queue.",
    "getToken": "Get Digital Token",
    "needHelp": "Need Help?",
    "helplineDesc": "Call our helpline for immediate assistance with related issues."
  },
  "payment": {
    "title": "Pay Bill / Dues",
    "enterAccount": "Enter your Account / Consumer Number",
    "fetchBill": "Fetch Bill Details",
    "billSummary": "Bill Summary",
    "consumerName": "Consumer Name",
    "dueDate": "Due Date",
    "accountNo": "Account No.",
    "totalDue": "Total Amount Due",
    "proceedPay": "Proceed to Pay",
    "cancel": "Cancel",
    "success": "Payment Successful!",
    "successDesc": "Your payment was processed successfully.",
    "txnId": "Transaction ID",
    "totalPaid": "Total Paid",
    "returnHome": "Return to Home"
  },
  "application": {
    "title": "New Application",
    "step1": "Identity",
    "step2": "Address & Docs",
    "applicantDetails": "Applicant Details",
    "fullName": "Full Name",
    "aadhaar": "Aadhaar / PAN Number",
    "mobile": "Mobile Number",
    "next": "Next Step",
    "locationDocs": "Location & Documents",
    "serviceAddress": "Service Address",
    "city": "City/District",
    "pincode": "Valid Pincode",
    "uploadProof": "Upload Proof of Address/Identity",
    "tapUpload": "Tap to upload document",
    "back": "Back",
    "submit": "Submit Application",
    "submitting": "Submitting...",
    "success": "Application Submitted!",
    "successDesc": "Your request has been received successfully.",
    "trackingId": "Application Tracking ID",
    "saveIdInfo": "Please save this ID. We have also sent a confirmation SMS to your registered mobile."
  },
  "complaint": {
    "title": "Register Complaint",
    "successTitle": "Complaint Registered Successfully!",
    "successMsg": "Your complaint has been registered. Reference ID: ",
    "returnHome": "Return to Home",
    "fullName": "Full Name",
    "phone": "Phone Number",
    "category": "Category",
    "description": "Complaint Description",
    "submit": "Submit Complaint",
    "submitting": "Submitting..."
  },
  "track": {
    "title": "Track Request Status",
    "placeholder": "Enter Complaint/Request ID (e.g., CMP-1234)",
    "searchButton": "Search",
    "status": "Current Status",
    "submitted": "Date Submitted",
    "estimated": "Estimated Resolution"
  },
  "dashboard": {
    "title": "My Dashboard",
    "welcome": "Welcome back, Citizen",
    "total": "Total Requests",
    "pending": "Pending",
    "resolved": "Resolved",
    "recent": "Recent Requests",
    "id": "Request ID",
    "service": "Service",
    "date": "Date",
    "status": "Status"
  },
  "admin": {
    "loginTitle": "Admin Login",
    "username": "Username",
    "password": "Password",
    "loginButton": "Login",
    "invalid": "Invalid credentials",
    "dashboardTitle": "Dashboard Overview",
    "dashboardWelcome": "Welcome back, Admin. Here's what's happening today.",
    "totalComplaints": "Total Complaints",
    "pending": "Pending",
    "resolved": "Resolved",
    "critical": "Critical",
    "recentActivity": "Recent Activity",
    "statusUpdated": "Status updated to In Progress",
    "newComplaint": "New complaint registered",
    "complaintResolved": "Complaint resolved",
    "assignedToOfficer": "Assigned to Field Officer",
    "minsAgo": "mins ago",
    "hourAgo": "hour ago",
    "hoursAgo": "hours ago"
  }
};

// Hindi Statically Embedded Translations
const hiTranslation = {
  "appTitle": "सुविधा",
  "appSubtitle": "स्मार्ट शहरी वर्चुअल इंटरैक्टिव डिजिटल हेल्पडेस्क सहायक",
  "tagline3": "जहाँ नागरिक सेवाएँ स्मार्ट समाधान बनती हैं।",
  "enterKiosk": "कियोस्क में प्रवेश करें",
  "heroTitle": "सुविधा",
  "heroSubtitle": "सभी शहरी नागरिक सेवाओं के लिए आपका वन-स्टॉप डिजिटल कियोस्क। हर नागरिक के लिए तेज़, पारदर्शी और सुलभ।",
  "tagline1": "एक कियोस्क। सभी नागरिक सेवाएं। कोई भी नागरिक। कोई भी भाषा।",
  "tagline2": "तकनीक जो सुनती है, समझती है, और हर नागरिक की सेवा करती है — समान रूप से।",
  "trackRequest": "अनुरोध ट्रैक करें",
  "registerComplaint": "शिकायत दर्ज करें",
  "selectDepartment": "विभाग चुनें",
  "selectDepartmentDesc": "उस सेवा श्रेणी को चुनें जिसमें आपको सहायता चाहिए",
  "quickActions": "त्वरित कार्रवाई",
  "myDashboard": "मेरा डैशबोर्ड",
  "dashboardDesc": "अपने सभी अनुरोध देखें",
  "trackStatusDesc": "अपने अनुरोध की स्थिति जांचें",
  "submitGrievance": "नई शिकायत दर्ज करें",
  "footerText": "सुविधा – स्मार्ट शहरी डिजिटल सहायता सहायक • एक डिजिटल इंडिया पहल",
  "adminLogin": "व्यवस्थापक लॉगिन",
  "back": "वापस",
  "home": "होम",
  "departments": {
    "electricity": "बिजली",
    "gas": "गैस वितरण",
    "municipal": "नगर निगम सेवाएं",
    "water": "जल आपूर्ति",
    "waste": "अपशिष्ट प्रबंधन",
    "property": "संपत्ति और कर"
  },
  "departmentDesc": {
    "electricity": "नए कनेक्शन, बिलिंग, आउटेज रिपोर्ट और मीटर सेवाएं",
    "gas": "नए कनेक्शन, सिलेंडर बुकिंग और सुरक्षा शिकायतें",
    "municipal": "संपत्ति कर, नागरिक शिकायतें और स्थानीय सेवाएं",
    "water": "नए कनेक्शन, बिलिंग और रिसाव शिकायतें",
    "waste": "संग्रहण समस्याएं, छूटे हुए पिकअप और स्वच्छता",
    "property": "संपत्ति कर पूछताछ, मूल्यांकन और भुगतान"
  },
  "dept": {
    "electricity": {
      "title": "बिजली उपयोगिता सेवाएं",
      "desc": "अपने बिजली कनेक्शन, बिल प्रबंधित करें और समस्याओं की रिपोर्ट करें",
      "s1": "नया बिजली कनेक्शन",
      "d1": "नए घरेलू या व्यावसायिक बिजली कनेक्शन के लिए आवेदन करें",
      "s2": "बिल देखना और भुगतान",
      "d2": "अपना वर्तमान बिल देखें और भुगतान करें",
      "s3": "मीटर से संबंधित शिकायतें",
      "d3": "दोषपूर्ण मीटर, मीटर रीडिंग विवादों की रिपोर्ट करें",
      "s4": "बिजली कटौती की रिपोर्टिंग",
      "d4": "अपने क्षेत्र में बिजली कटौती की रिपोर्ट करें",
      "s5": "लोड परिवर्तन अनुरोध",
      "d5": "स्वीकृत लोड में वृद्धि या कमी का अनुरोध करें"
    },
    "gas": {
      "title": "गैस वितरण सेवाएं",
      "desc": "गैस कनेक्शन, सिलेंडर बुकिंग और सुरक्षा सेवाएं",
      "s1": "नया गैस कनेक्शन",
      "d1": "नए एलपीजी गैस कनेक्शन के लिए आवेदन करें",
      "s2": "सिलेंडर बुकिंग सहायता",
      "d2": "रिफिल सिलेंडर बुक करें और डिलीवरी ट्रैक करें",
      "s3": "रिसाव और सुरक्षा शिकायतें",
      "d3": "गैस रिसाव और सुरक्षा खतरों की रिपोर्ट करें",
      "s4": "सब्सिडी स्थिति पूछताछ",
      "d4": "अपनी एलपीजी सब्सिडी क्रेडिट स्थिति की जांच करें"
    },
    "municipal": {
      "title": "नगर निगम सेवाएं",
      "desc": "संपत्ति कर, नागरिक शिकायतें और स्थानीय शासन सेवाएं",
      "s1": "संपत्ति कर जानकारी",
      "d1": "संपत्ति कर विवरण और भुगतान स्थिति देखें",
      "s2": "स्थानीय शिकायत जमा करें",
      "d2": "नागरिक समस्याओं के बारे में शिकायतें दर्ज करें",
      "s3": "नगर निगम कार्यालय से संपर्क करें",
      "d3": " हेल्पलाइन नंबर और कार्यालय के पते प्राप्त करें"
    },
    "water": {
      "title": "जल आपूर्ति सेवाएं",
      "desc": "पानी के कनेक्शन, बिलिंग और रिसाव की शिकायतें",
      "s1": "नया पानी कनेक्शन",
      "d1": "नए पानी के कनेक्शन के लिए आवेदन करें",
      "s2": "पानी का बिल पूछताछ",
      "d2": "अपने पानी के बिल देखें और भुगतान करें",
      "s3": "रिसाव शिकायत",
      "d3": "पानी की पाइपलाइन लीकेज और मुद्दों की रिपोर्ट करें"
    },
    "waste": {
      "title": "अपशिष्ट प्रबंधन सेवाएं",
      "desc": "कचरा संग्रहण, स्वच्छता और सफाई सेवाएं",
      "s1": "कचरा संग्रहण मुद्दे",
      "d1": "अनियमित कचरा संग्रहण की रिपोर्ट करें",
      "s2": "मिस्ड पिकअप रिपोर्टिंग",
      "d2": "अपने क्षेत्र से छूटे हुए कचरे की रिपोर्ट करें",
      "s3": "स्वच्छता शिकायतें",
      "d3": "स्वच्छता और हाइजीन के मुद्दों की रिपोर्ट करें"
    },
    "property": {
      "title": "संपत्ति और कर सेवाएं",
      "desc": "संपत्ति मूल्यांकन, कर भुगतान और संबंधित सेवाएं",
      "s1": "संपत्ति कर भुगतान",
      "d1": "अपना संपत्ति कर ऑनलाइन भुगतान करें",
      "s2": "मूल्यांकन विवरण",
      "d2": "अपनी संपत्ति मूल्यांकन जानकारी देखें",
      "s3": "नई संपत्ति पंजीकरण",
      "d3": "नगर निगम रिकॉर्ड के साथ नई संपत्ति पंजीकृत करें"
    },
    "onlineKiosk": "ऑनलाइन और कियोस्क सेवाएं",
    "walkIn": "वॉक-इन सेवाएं",
    "walkInDesc": "कार्यालय जा रहे हैं? मैन्युअल कतार से बचने के लिए एक डिजिटल टोकन जनरेट करें।",
    "getToken": "डिजिटल टोकन प्राप्त करें",
    "needHelp": "मदद चाहिए?",
    "helplineDesc": "संबंधित समस्याओं पर तत्काल सहायता के लिए हमारी हेल्पलाइन पर कॉल करें।"
  },
  "payment": {
    "title": "बिल / देय भुगतान करें",
    "enterAccount": "अपना खाता / उपभोक्ता नंबर दर्ज करें",
    "fetchBill": "बिल विवरण प्राप्त करें",
    "billSummary": "बिल सारांश",
    "consumerName": "उपभोक्ता का नाम",
    "dueDate": "नियत तिथि",
    "accountNo": "खाता सं.",
    "totalDue": "कुल देय राशि",
    "proceedPay": "भुगतान करने के लिए आगे बढ़ें",
    "cancel": "रद्द करें",
    "success": "भुगतान सफल!",
    "successDesc": "आपका भुगतान सफलतापूर्वक पूरा हो गया।",
    "txnId": "लेनदेन आईडी",
    "totalPaid": "कुल भुगतान",
    "returnHome": "होम पर वापस लौटें"
  },
  "application": {
    "title": "नया आवेदन",
    "step1": "पहचान",
    "step2": "पता और दस्तावेज़",
    "applicantDetails": "आवेदक का विवरण",
    "fullName": "पूरा नाम",
    "aadhaar": "आधार / पैन नंबर",
    "mobile": "मोबाइल नंबर",
    "next": "अगला कदम",
    "locationDocs": "स्थान और दस्तावेज़",
    "serviceAddress": "सेवा का पता",
    "city": "शहर/जिला",
    "pincode": "पिनकोड",
    "uploadProof": "पता/पहचान प्रमाण अपलोड करें",
    "tapUpload": "दस्तावेज़ अपलोड करने के लिए टैप करें",
    "back": "पीछे",
    "submit": "आवेदन जमा करें",
    "submitting": "जमा हो रहा है...",
    "success": "आवेदन जमा किया गया!",
    "successDesc": "आपका अनुरोध सफलतापूर्वक प्राप्त हो गया है।",
    "trackingId": "आवेदन ट्रैकिंग आईडी",
    "saveIdInfo": "कृपया इस आईडी को सहेजें। हमने आपके पंजीकृत मोबाइल पर एक पुष्टिकरण एसएमएस भी भेजा है।"
  },
  "complaint": {
    "title": "शिकायत दर्ज करें",
    "successTitle": "शिकायत सफलतापूर्वक दर्ज की गई!",
    "successMsg": "आपकी शिकायत दर्ज कर ली गई है। संदर्भ आईडी: ",
    "returnHome": "होम पर वापस जाएं",
    "fullName": "पूरा नाम",
    "phone": "फ़ोन नंबर",
    "category": "श्रेणी",
    "description": "शिकायत विवरण",
    "submit": "शिकायत जमा करें",
    "submitting": "जमा हो रहा है..."
  },
  "track": {
    "title": "अनुरोध स्थिति ट्रैक करें",
    "placeholder": "शिकायत/अनुरोध आईडी दर्ज करें (जैसे, CMP-1234)",
    "searchButton": "खोजें",
    "status": "वर्तमान स्थिति",
    "submitted": "जमा करने की तिथि",
    "estimated": "अनुमानित समाधान"
  },
  "dashboard": {
    "title": "मेरा डैशबोर्ड",
    "welcome": "वापसी पर स्वागत है, नागरिक",
    "total": "कुल अनुरोध",
    "pending": "लंबित",
    "resolved": "हल किया गया",
    "recent": "हाल के अनुरोध",
    "id": "अनुरोध आईडी",
    "service": "सेवा",
    "date": "तिथे",
    "status": "स्थिति"
  },
  "admin": {
    "loginTitle": "व्यवस्थापक लॉगिन",
    "username": "उपयोगकर्ता नाम",
    "password": "पासवर्ड",
    "loginButton": "लॉग इन करें",
    "invalid": "अमान्य क्रेडेंशियल",
    "dashboardTitle": "डैशबोर्ड अवलोकन",
    "dashboardWelcome": "वापसी पर स्वागत है, व्यवस्थापक। आज यह हो रहा है।",
    "totalComplaints": "कुल शिकायतें",
    "pending": "लंबित",
    "resolved": "हल किया गया",
    "critical": "गंभीर",
    "recentActivity": "हाल की गतिविधि",
    "statusUpdated": "स्थिति प्रगति पर अपडेट की गई",
    "newComplaint": "नई शिकायत दर्ज की गई",
    "complaintResolved": "शिकायत हल हो गई",
    "assignedToOfficer": "फील्ड अधिकारी को सौंपा गया",
    "minsAgo": "मिनट पहले",
    "hourAgo": "घंटा पहले",
    "hoursAgo": "घंटे पहले"
  }
};

// Marathi Statically Embedded Translations
const mrTranslation = {
  "appTitle": "नागरिक सुविधा केंद्र",
  "appSubtitle": "स्मार्ट शहरी व्हर्च्युअल परस्परसंवादी डिजिटल हेल्पडेस्क सहाय्यक",
  "tagline3": "जिथे नागरी सेवा स्मार्ट उपाय बनतात.",
  "enterKiosk": "कियोस्कमध्ये प्रवेश करा",
  "welcome": "आपले स्वागत आहे",
  "welcomeDesc": "तुमचा वन-स्टॉप सेवा साथी: केव्हांही, कुठेही.",
  "selectService": "आपली सेवा निवडा",
  "getStarted": "सुरुवात करूया",
  "departments": "विभाग",
  "quickActions": "जलद कृती",
  "registerComplaint": "तक्रार नोंदवा",
  "trackRequest": "विनंती ट्रॅक करा",
  "payBills": "बिले भरा",
  "newConnection": "नवीन जोडणी",
  "dept": {
    "electricity": {
      "title": "वीज विभाग",
      "desc": "बिल पेमेंट्स, नवीन कनेक्शन्स आणि तक्रारी हाताळा.",
      "s1": "बिल भरा",
      "d1": "तुमचे वीज बिल त्वरित भरा",
      "s2": "नवीन कनेक्शन",
      "d2": "नवीन मीटर कनेक्शनसाठी अर्ज करा",
      "s3": "तक्रारी",
      "d3": "वीज पुरवठा किंवा मीटर समस्या नोंदवा",
      "s4": "लोड बदल",
      "d4": "मंजूर लोड वाढवण्यासाठी किंवा कमी करण्यासाठी विनंती"
    },
    "water": {
      "title": "पाणी पुरवठा",
      "desc": "पाणी बिल पेमेंट्स आणि नवीन कनेक्शन विनंत्या.",
      "s1": "पाणी बिल",
      "d1": "तुमचे पडून असलेले पाणी बिल भरा",
      "s2": "नवीन कनेक्शन",
      "d2": "नवीन पाईपलाईन कनेक्शनसाठी अर्ज"
    },
    "waste": {
      "title": "कचरा व्यवस्थापन",
      "desc": "कचरा संकलन वेळापत्रक आणि स्वच्छतेच्या तक्रारी.",
      "s1": "संकलन वेळापत्रक",
      "d1": "तुमच्या क्षेत्राचे वेळापत्रक पहा",
      "s2": "तक्रार नोंदवा",
      "d2": "कचरा उचलला नसल्यास कळवा"
    }
  },
  "complaint": {
    "title": "तक्रार नोंदणी",
    "desc": "तुमचा विभाग निवडा आणि समस्येचे वर्णन करा.",
    "category": "विभाग",
    "service": "सेवा प्रकार",
    "description": "तक्रार वर्णन",
    "descPlaceholder": "येथे टाईप करा...",
    "submit": "तक्रार जमा करा",
    "success": "तक्रार नोंदविली गेली!",
    "successDesc": "तुमचा ट्रॅकिंग आयडी:"
  },
  "dashboard": {
    "title": "नागरिक डॅशबोर्ड",
    "recent": "अलीकडील विनंत्या",
    "total": "एकूण तक्रारी",
    "pending": "प्रलंबित",
    "resolved": "निरस्त",
    "id": "आयडी"
  }
};

// Bengali Statically Embedded Translations
const bnTranslation = {
  "appTitle": "नागरिक सुविधा केंद्र",
  "appSubtitle": "স্মার্ট আরবান ভার্চুয়াল ইন্টারেক্টিভ ডিজিটাল হেল্পডেস্ক অ্যাসিস্ট্যান্ট",
  "tagline3": "যেখানে নাগরিক পরিষেবাগুলি স্মার্ট সমাধানে পরিণত হয়।",
  "enterKiosk": "কিওস্কে প্রবেশ করুন",
  "welcome": "স্বাগতম",
  "welcomeDesc": "আপনার ওয়ান-স্টপ পরিষেবা সঙ্গী: যেকোনো সময়, যেকোনো স্থানে।",
  "selectService": "আপনার পরিষেবা নির্বাচন করুন",
  "getStarted": "শুরু করা যাক",
  "departments": "বিভাগসমূহ",
  "quickActions": "द्रুত পদক্ষেপ",
  "registerComplaint": "অভিযোগ নথিভুক্ত করুন",
  "trackRequest": "অনুরোধ ট্র্যাক করুন",
  "payBills": "বিল প্রদান করুন",
  "newConnection": "নতুন সংযোগ",
  "dept": {
    "electricity": {
      "title": "বিদ্যুৎ বিভাগ",
      "desc": "বিল পরিশোধ, নতুন সংযোগ এবং অভিযোগ পরিচালনা করুন।",
      "s1": "বিল প্রদান",
      "d1": "আপনার বিদ্যুৎ बिल অবিলম্বে পরিশোধ করুন",
      "s2": "নতুন সংযোগ",
      "d2": "নতুন মিটার সংযোগের জন্য আবেদন করুন",
      "s3": "অভিযোগ",
      "d3": "পাওয়ার কাট বা মিটার সমস্যা রিপোর্ট করুন",
      "s4": "লোড পরিবর্তন",
      "d4": "মঞ্জুরকৃত লোড বাড়ানো বা কমানোর অনুরোধ"
    },
    "water": {
      "title": "জল সরবরাহ",
      "desc": "জলের বিল পরিশোধ এবং নতুন সংযোগের অনুরোধ।",
      "s1": "জলের বিল",
      "d1": "আপনার বকেয়া জল বিল পরিশোধ করুন",
      "s2": "নতুন সংযোগ",
      "d2": "নতুন পাইপলাইন সংযোগের জন্য আবেদন"
    },
    "waste": {
      "title": "বর্জ্য ব্যবস্থাপনা",
      "desc": "বর্জ্য সংগ্রহের সময়সূচী এবং স্যানিটেশন অভিযোগ।",
      "s1": "সংগ্রহের সময়সূচী",
      "d1": "আপনার এলাকার সময়সূচী দেখুন",
      "s2": "রিপোর্ট করুন",
      "d2": " মিস করা আবর্জনা বা ডাম্পিং রিপোর্ট করুন"
    }
  },
  "complaint": {
    "title": "অভিযোগ নিবন্ধন",
    "desc": "আপনার বিভাগ নির্বাচন করুন এবং সমস্যাটি বর্ণনা করুন।",
    "category": "বিভাগ",
    "service": "সেবার ধরন",
    "description": "অভিযোগ বিবরণ",
    "descPlaceholder": "এখানে লিখুন...",
    "submit": "জমা দিন",
    "success": "অভিযোগ নথিভুক্ত হয়েছে!",
    "successDesc": "আপনার ট্র্যাকিং আইডি:"
  },
  "dashboard": {
    "title": "নাগরিক ড্যাশবোর্ড",
    "recent": "সাম্প্রতিক অনুরোধ",
    "total": "মোট অভিযোগ",
    "pending": "অমীমাংসিত",
    "resolved": "সমাধান হয়েছে",
    "id": "আইডি"
  }
};

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  mr: { translation: mrTranslation },
  bn: { translation: bnTranslation }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "mr", "bn"],
    load: "languageOnly",
    debug: false, // Turn off debugger noise
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  });

// Validate all translation files are fully resolved
try {
  const allLangs = ["hi", "mr", "bn"];
  allLangs.forEach(lang => {
    const translation = resources[lang]?.translation;
    if (!translation) {
      console.warn(`Translation validation warning: Language ${lang} has no statically declared resources.`);
    }
  });
} catch (e) {
  console.error("Translation validation failed:", e);
}

export default i18n;
