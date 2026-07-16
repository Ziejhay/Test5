const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ziejhaycantalejo0909@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

const MASTER_PASSCODE = "Janna1003";

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { passcode, targetUrl } = req.body;

    if (passcode === MASTER_PASSCODE) {
        return res.status(200).json({ success: true, redirect: targetUrl });
    } else {
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

        const mailOptions = {
            from: 'ziejhaycantalejo0909@gmail.com',
            to: 'ziejhaycantalejo0909@gmail.com',
            subject: '⚠️ Security Alert: Failed Login Attempt on Class Pass',
            text: `An incorrect password attempt was detected.\n\nTime (PHT): ${timestamp}\nAttempted Password: "${passcode}"\nTarget Screen: ${targetUrl}\n\nIf this wasn't you, please monitor your dashboard access.`
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(401).json({ success: false, error: 'Incorrect password.' });
        } catch (emailError) {
            console.error(emailError);
            return res.status(401).json({ success: false, error: 'Incorrect password.' });
        }
    }
};
