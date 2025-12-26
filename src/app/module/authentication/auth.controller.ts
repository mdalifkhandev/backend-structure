import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./auth.service";
import httpStatus from 'http-status'

const userCreated = catchAsync(async (req, res) => {
    const {result, accessToken} = await UserService.userCreatedFromDB(req.body);
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 100 * 1000 // 100 seconds
    });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created successfully. Please check your email for verification code.",
        data: {
            result
        }
    })
})


const userLogin=catchAsync(async (req, res) => {
    const {accessToken,user}=await UserService.loginUser(req.body)
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 48 * 60 * 60 * 1000 // 48 hours
    });
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success:true,
        message:'User Loged In Sussessfully',
        data: { accessToken, user },
    })
})

const verifyUserEmail = catchAsync(async (req, res) => {
    const { email, code } = req.body;
    const result = await UserService.verifyEmail(email, code);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    })
})

const logoutUser = catchAsync(async (req, res) => {
    res.clearCookie('token');
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged out successfully',
        data: null
    })
})

export const UserController = {
    userCreated,
    userLogin,
    verifyUserEmail,
    logoutUser
}