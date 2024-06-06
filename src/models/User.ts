import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const messageSchema: Schema<Message> = new Schema({
    content: { 
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        trime: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please enter a valid email."]
    }, 
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required."],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required."],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [messageSchema]
})

const User = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))

export default User;