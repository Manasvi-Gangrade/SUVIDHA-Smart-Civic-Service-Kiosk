# Suvidha Kiosk Gap Analysis

Based on the provided Hackathon Tentative Software Flow, here is a detailed breakdown of what is currently implemented, what needs adjustment, and what is entirely missing.

## 🟢 1. Currently Implemented & Working Well

- **Multilingual Support Structure**: `react-i18next` is installed and a basic structure is there.
- **Complaint Registration**: Implemented via `ComplaintPage.tsx` with document uploads, smart categorization, AI suggestions, and priority selection.
- **Application Forms**: Implemented via `ApplicationFormPage.tsx` with AI Scanner, DigiLocker mock flow, and form inputs.
- **Request Tracking**: `TrackPage.tsx` is present for ticket tracking.
- **User Dashboard**: `DashboardPage.tsx` allows users to see their requests.
- **Map & Geo-features**: `CivicMapPage.tsx` using Leaflet.
- **Kiosk-Specific UI**: Hover reader, Text-to-Speech (TTS Context), Voice Assistant, Offline queuing mechanism, Emergency SOS, Virtual Keyboard.
- **Admin Dashboard**: Analytics and admin layout are present.

---

## 🟡 2. Needs Adjustment (Partially Present)

### Home Page & Language Flow
- **Requirement**: "The system shall allow the user to select the preferred language before proceeding to any service or organization selection."
- **Current State**: `Index.tsx` currently displays all departments immediately. There is no forced language splash screen prior to selecting an organization.
- **Action Required**: Build a Splash Screen / Language Selection modal that blocks the app until English, Hindi, or Assamese is selected.

### Organization Selection constraint
- **Requirement**: "The system shall allow the user to select only one organization at a time. Upon organization selection, the system shall route the user to the respective organization-specific authentication or service entry screen."
- **Current State**: The homepage lists 6 departments, but clicking them routes to a generic `DepartmentPage`.
- **Action Required**: Create specific landing screens for **Electricity**, **Gas**, and **Municipal** after they click the organization, which then shows the sub-services specific to them (e.g. Meter replacement for Electricity).

### Receipt Generation
- **Requirement**: "Receipt generation for new connections... Thermal printing support. Digital receipt delivery via Email and SMS."
- **Current State**: Upon form submission, a success screen with a reference ID and QR code is shown.
- **Action Required**: Add a dedicated "Print Receipt" button that triggers a CSS `@media print` layout styled specifically for 80mm thermal printers.

---

## 🔴 3. Completely Missing Modules (High Priority)

### Authentication Flow (Welcome Screen & Login)
- **Requirement**: OTP-based verification or Consumer Account Number / Aadhaar Login *before* accessing personalized dashboards or specific organization services.
- **Current State**: `LoginPage.tsx` exists but seems generic. It needs to be integrated into the organization flow (e.g. "Login to Assam Gas Department").

### Specific Services (Electricity & Gas)
- **Meter Replacement/Shifting Request**
- **New Connection / Load Extension specifically** (Current app has generic application form)
- **Postpaid to Prepaid conversion** (Gas department)
- **Pipeline inspection / Maintenance scheduling**

### Credential Management / Profile Update
- **Requirement**: Secure mechanism to view and update consumer profile (Mobile number, name, ownership transfer).
- **Current State**: Missing. We need a `ProfileUpdatePage.tsx` connected to the dashboard.

### Specific Assamese Language Strings
- **Requirement**: Support for Assamese language.
- **Current State**: `react-i18next` is installed, but `as` translations likely need to be populated.

---

## Recommended Next Steps for Hackathon:
1. **Fix the Validation**: I've just updated the fields to strictly prevent typing invalid characters.
2. **Build the Language Selector**: Create a welcome screen that forces language choice (English/Hindi/Assamese).
3. **Build Organization Portals**: Create specific screens for `Electricity`, `Gas`, and `Municipality`.
4. **Thermal Receipt Printing**: Add a "Print Receipt" UI for success pages.
