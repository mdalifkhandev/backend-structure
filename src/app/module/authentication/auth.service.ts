import AppError from "../../error/appError";
import { TUser } from "./auth.interface";
import { User } from "./auth.model";
import httpStatus from "http-status";
import { createToken, generateVerificationCode, sendVerificationEmail } from "./auth.utils";
import bcrypt from "bcrypt";

const userCreatedFromDB = async (data: TUser) => {
    const user = await User.findOne({ email: data.email });
    if (user) {
        throw AppError(httpStatus.BAD_REQUEST, "Email is already exist");
    }

    const password = await bcrypt.hash(data.password, 10);

    const verificationCode = generateVerificationCode();

    const newData = {
        ...data,
        password,
        verificationCode
    };

    const jwtPayloads = {
        email: data.email,
        role: data.role
    };

    const accessToken = createToken(jwtPayloads, process.env.JWT_SECRET as string, 100);

    const result = await User.create(newData);

    // Send verification email
    await sendVerificationEmail(data.email, verificationCode);

    return {
        result,
        accessToken
    };
};

const loginUser = async (data: { email: string, password: string }) => {
    const user = await User.findOne({ email: data.email });
    if (!user) {
        throw AppError(httpStatus.BAD_REQUEST, "Email is not exist");
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw AppError(httpStatus.BAD_REQUEST, "Password is not valid");
    }
    if (user.isDeleted) {
        throw AppError(httpStatus.BAD_REQUEST, "User is deleted");
    }
    if (!user.isVerified) {
        throw AppError(httpStatus.BAD_REQUEST, "Please verify your email first");
    }

    const jwtPayloads = {
        email: user.email,
        role: user.role
    };
    const hours = 48;
    const expiresIn = 3600 * hours;
    const accessToken = createToken(jwtPayloads, process.env.JWT_SECRET as string, expiresIn);

     const datas = await User.findOne({ email: data.email }).select('-password -verificationCode -__v');

    return {
        accessToken,
        user: datas
    };
};

const verifyEmail = async (email: string, code: string) => {
    const user = await User.findOne({ email, verificationCode: code });
    if (!user) {
        throw AppError(httpStatus.BAD_REQUEST, "Invalid verification code");
    }
    if (user.isVerified) {
        throw AppError(httpStatus.BAD_REQUEST, "Email already verified");
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    return { message: "Email verified successfully" };
};

export const UserService = {
    userCreatedFromDB,
    loginUser,
    verifyEmail
};