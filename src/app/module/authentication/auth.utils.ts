import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const createToken = (
    jwtPayloads: { email: string; role: string },
    secret: string,
    expiresIn: number
) => {
    return jwt.sign(jwtPayloads, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};

export const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${code}`
    };

    await transporter.sendMail(mailOptions);
};