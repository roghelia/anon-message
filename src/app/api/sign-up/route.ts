import dbConnect from "@/lib/dbConnection";
import User from "@/models/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    
    await dbConnect(). 
    then(() => 
        console.log("MongoDB connected")
    ).catch((error) => 
        console.log("MongoDB error: ", error)
    );

    try {
        
        const {username, email, password} = await request.json();
        
        const exists = await User.findOne({email}); // existing user verified by username.

        if(exists) {
            return Response.json({
                success: false,
                message: "Username is already taken."
            }, {status: 400})
        }

        const existingUserByEmail = await User.findOne({email}); // existing user verified by email.
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already registered with a user."
                }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();   
            }

        } else {    

            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            
            const newUser = await User.create({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            })

            await newUser.save();

            // send verification email.
            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            
            if(!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message,
                }, {status: 500})
            }

            return Response.json({
                success: true,
                message: "User registered successfully. Please check your email to verify your account.",
            }, {status: 201})

        }
    } catch (error) {
        
        console.error("Error registring user.", error);
        return Response.json(
            { success: false, message: "Error registring user." }, {status: 500}
        )
    
    }
}