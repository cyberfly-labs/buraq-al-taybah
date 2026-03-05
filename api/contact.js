const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { name, phone, email, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !message) {
        res.status(400).json({ error: "Name, email, and message are required." });
        return;
    }

    // Create SMTP transporter (Microsoft 365)
    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            ciphers: "SSLv3",
            minVersion: "TLSv1.2",
        },
    });

    // Build email
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: "info@buraqaltaybah.com",
        replyTo: email,
        subject: `New Inquiry from ${name}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0b2c4d; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">📩 New Website Inquiry</h2>
        </div>
        <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333; width: 100px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;">${escapeHtml(phone || "Not provided")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e0e0e0; color: #555;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #333; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #555; white-space: pre-wrap;">${escapeHtml(message)}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            This message was sent from the contact form at buraqaltaybah.com
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Message sent successfully." });
    } catch (err) {
        console.error("Email send error:", err);
        res.status(500).json({ error: "Failed to send message. Please try again later.", detail: err.message });
    }
};

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
