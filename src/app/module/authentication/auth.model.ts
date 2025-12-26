import { model, Schema } from "mongoose";
import { TUser } from "./auth.interface";

const userSchema = new Schema<TUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"]
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    }
})

export const User = model('User', userSchema)