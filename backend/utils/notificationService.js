const nodemailer = require('nodemailer');
const twilio = require('twilio');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// For development, we use Ethereal Email which guarantees fake delivery testing
// You can replacing these with real SMTP details (SendGrid/AWS) when deploying.
let transporter;
let transportMode = 'none';

const setupTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
        try {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: process.env.SMTP_SECURE === 'true',
                auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                } : undefined,
            });
            transportMode = 'smtp';
            console.log(`SMTP Transporter Created: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
            return transporter;
        } catch (err) {
            console.warn('SMTP transporter setup failed, falling back:', err.message);
        }
    }
    
    // Check if .env contains live credentials
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const gmailPass = String(process.env.EMAIL_PASS).replace(/\s+/g, '').trim();
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: gmailPass,
                },
            });
            transportMode = 'gmail';
            console.log(`Live Gmail Transporter Created for: ${process.env.EMAIL_USER}`);
            return transporter;
        } catch (err) {
            console.warn('Gmail transporter setup failed, falling back:', err.message);
        }
    }

    // Create an ethereal test account on the fly if no credentials exist
    try {
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        transportMode = 'ethereal';
        console.log(`Ethereal Email Transporter Created: ${testAccount.user}`);
    } catch (err) {
        console.error("Failed to create email transporter", err);
    }
    return transporter;
};

// Generic email dispatcher
const dispatchEmail = async (to, subject, htmlContent) => {
    try {
        const mailer = await setupTransporter();
        if (!mailer) {
            return { success: false, error: "Mail transporter not ready", mode: transportMode };
        }

        let info = await mailer.sendMail({
            from: '"SUVIDHA Portal" <noreply@suvidha-smartcity.gov.in>',
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log(`Email sent: ${info.messageId}`);
        // Provides a URL to preview the email (only works with ethereal)
        console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        return { success: true, previewUrl: nodemailer.getTestMessageUrl(info), mode: transportMode };
    } catch (error) {
        console.error("Email Dispatch Error:", error);
        return { success: false, error: error.message, mode: transportMode };
    }
};

// Application/Complaint specific formatters
const sendReceiptEmail = async (citizenEmail, citizenName, receiptDetails) => {
    const { receiptNo, amount, department, serviceType, date } = receiptDetails;
    const html = `
        <div style="font-family: Arial, sans-serif; max-w-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0c1a32; padding: 20px; text-align: center; color: white;">
                <h2>SUVIDHA Kiosk E-Receipt</h2>
            </div>
            <div style="padding: 20px;">
                <p>Dear <strong>${citizenName}</strong>,</p>
                <p>We have successfully processed your transaction. Below are your receipt details:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Receipt No</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${receiptNo}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Department</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${department}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Service</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${serviceType}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Date</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; color: #333; font-size: 1.1em; font-weight: bold;">Amount Paid</td>
                        <td style="padding: 15px 0; font-weight: bold; text-align: right; font-size: 1.1em; color: #10b981;">₹${amount}</td>
                    </tr>
                </table>
                <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                    This is an auto-generated digital receipt. Please do not reply.<br/>
                    SUVIDHA Smart Urban Interactive Digital Helpdesk
                </p>
            </div>
        </div>
    `;
    
    return await dispatchEmail(citizenEmail, `Payment Receipt - ${receiptNo}`, html);
};

const sendComplaintEmail = async (citizenEmail, citizenName, details) => {
    const { complaintId, department, category, priority, date, description } = details;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0c1a32; padding: 20px; text-align: center; color: white;">
                <h2>Grievance Registration Receipt</h2>
            </div>
            <div style="padding: 20px;">
                <p>Dear <strong>${citizenName}</strong>,</p>
                <p>Your grievance has been successfully recorded. Below are your reference details:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Complaint ID</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0284c7;">${complaintId}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Department</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${department}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Category</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${category}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Priority</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${priority}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Date Registered</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 0; color: #666; vertical-align: top;">Description</td>
                        <td style="padding: 15px 0; font-style: italic; text-align: right; color: #333; line-height: 1.4;">${description || 'N/A'}</td>
                    </tr>
                </table>
                <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                    This is an auto-generated digital receipt. Please do not reply.<br/>
                    SUVIDHA Smart Urban Interactive Digital Helpdesk
                </p>
            </div>
        </div>
    `;
    return await dispatchEmail(citizenEmail, `Grievance Confirmation - ${complaintId}`, html);
};

const sendApplicationEmail = async (citizenEmail, citizenName, details) => {
    const { applicationId, department, serviceType, date, formData = {} } = details;
    
    // Convert formData object into table rows
    const customFieldsHtml = Object.entries(formData)
        .filter(([key, value]) => value && typeof value === 'string')
        .map(([key, value]) => `
            <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #666; text-transform: capitalize;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
                <td style="padding: 10px 0; font-weight: bold; text-align: right; word-break: break-all;">${value}</td>
            </tr>
        `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0c1a32; padding: 20px; text-align: center; color: white;">
                <h2>Service Request Registration</h2>
            </div>
            <div style="padding: 20px;">
                <p>Dear <strong>${citizenName}</strong>,</p>
                <p>Your new service request application has been successfully initiated. Reference details:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Application ID</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; color: #0284c7;">${applicationId}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Department</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${department}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Service Request</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${serviceType}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px 0; color: #666;">Date Initated</td>
                        <td style="padding: 10px 0; font-weight: bold; text-align: right;">${new Date(date).toLocaleString()}</td>
                    </tr>
                </table>
                
                ${customFieldsHtml ? `
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="font-size: 13px; font-weight: bold; margin-top: 0; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">Submitted Data</p>
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        ${customFieldsHtml}
                    </table>
                </div>
                ` : ''}

                <p style="font-size: 12px; color: #888; text-align: center; margin-top: 30px;">
                    This is an auto-generated digital receipt. Please do not reply.<br/>
                    SUVIDHA Smart Urban Interactive Digital Helpdesk
                </p>
            </div>
        </div>
    `;
    return await dispatchEmail(citizenEmail, `Service Application - ${applicationId}`, html);
};

// WhatsApp and SMS Mocks as per requirements (would use Twilio or Gupshup in prod)
const dispatchSMS = async (phone, message) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber) {
        try {
            const client = twilio(accountSid, authToken);
            // Basic formatting for Indian numbers if 10 digits
            let formattedPhone = phone.replace(/\D/g, '');
            if (formattedPhone.length === 10) formattedPhone = `+91${formattedPhone}`;
            else if (!phone.startsWith('+')) formattedPhone = `+${formattedPhone}`;
            else formattedPhone = phone;

            const result = await client.messages.create({
                body: message,
                from: fromNumber,
                to: formattedPhone
            });
            console.log(`Twilio SMS sent: ${result.sid}`);
            return { success: true, method: 'twilio-sms', sid: result.sid };
        } catch (error) {
            console.error('Twilio SMS Dispatch Error:', error);
            // Fallback to mock in case of failure or just return error
            return { success: false, error: error.message };
        }
    }

    console.log(`[SMS MOCK] Dispatching SMS to ${phone}: ${message}`);
    return { success: true, method: 'mock-sms' };
};

const dispatchWhatsApp = async (phone, message) => {
    console.log(`[WhatsApp MOCK] Dispatching WhatsApp to ${phone}: ${message}`);
    return { success: true, method: 'whatsapp' };
};

const sendReceiptSMS = async (phone, citizenName, receiptDetails) => {
    const { receiptNo, amount, department, serviceType } = receiptDetails;
    const message = `Dear ${citizenName}, your payment of ₹${amount} for ${serviceType} (${department}) was successful. Receipt No: ${receiptNo}. - SUVIDHA Kiosk`;
    return await dispatchSMS(phone, message);
};

const sendComplaintSMS = async (phone, citizenName, details) => {
    const { complaintId, category } = details;
    const message = `Dear ${citizenName}, your grievance regarding ${category} has been registered successfully. Complaint ID: ${complaintId}. - SUVIDHA Kiosk`;
    return await dispatchSMS(phone, message);
};

const sendApplicationSMS = async (phone, citizenName, details) => {
    const { applicationId, serviceType } = details;
    const message = `Dear ${citizenName}, your application for ${serviceType} has been submitted successfully. Application ID: ${applicationId}. - SUVIDHA Kiosk`;
    return await dispatchSMS(phone, message);
};

const sendStatusUpdateSMS = async (phone, citizenName, details) => {
    const { itemId, status, remarks } = details;
    const statusLabel = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status;
    const message = `Dear ${citizenName}, your request ${itemId} status is now ${statusLabel.toUpperCase()}. Remarks: ${remarks || 'N/A'}. - SUVIDHA Kiosk`;
    return await dispatchSMS(phone, message);
};

module.exports = {
    sendApplicationEmail,
    sendReceiptSMS,
    sendComplaintSMS,
    sendApplicationSMS,
    sendStatusUpdateSMS,
    dispatchEmail,
    dispatchSMS,
    dispatchWhatsApp
};
