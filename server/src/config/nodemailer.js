import nodemailer from 'nodemailer';

const transporter =  nodemailer.createTransport({
 host:"smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER, // your SMTP username
        pass: process.env.SMTP_PASSWORD // your SMTP password
    },
});

export default transporter;