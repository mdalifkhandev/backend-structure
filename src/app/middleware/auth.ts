import { NextFunction, Request, Response } from "express";
import { TUserRole } from "../Interface/types";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/appError";
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "../module/authentication/auth.model";

const auth = (...requiredRole: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.token;
        if (!token) {
            throw AppError(httpStatus.BAD_REQUEST, 'You Have not authorized')
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        const { email, role, iat, exp } = decoded
        if (requiredRole && !requiredRole.includes(role)) {
            throw AppError(httpStatus.FORBIDDEN, 'You are not allowed to access this route')
        }

        const user = await User.findOne({ email })
        if (!user) {
            throw AppError(httpStatus.BAD_REQUEST, 'User not found')
        }

        if (user.isDeleted) {
            throw AppError(httpStatus.BAD_REQUEST, 'User is deleted')
        }

        if (!user.isVerified) {
            throw AppError(httpStatus.BAD_REQUEST, 'Please verify your email first')
        }

        req.user = decoded
        next()


    })
}

export default auth