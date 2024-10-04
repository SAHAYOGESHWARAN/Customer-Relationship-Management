import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// OAuth2 Setup (for Gmail)
const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client with Google credentials
const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,     // Client ID
    process.env.GMAIL_CLIENT_SECRET, // Client Secret
    'https://developers.google.com/oauthplayground'  // Redirect URL for generating tokens
);

// Set refresh token for OAuth2
oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function getAccessToken() {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        return accessToken.token;
    } catch (error) {
        console.error('Error generating access token:', error);
        throw new Error('Failed to generate access token');
    }
}

// Create reusable transporter object using OAuth2
const createTransporter = async () => {
    const accessToken = await getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
};

// Send Email function
export const sendEmail = async (to, subject, text, html = '', attachments = []) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html, // HTML version of the email
            attachments, // Optional attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Failed to send email');
    }
};
