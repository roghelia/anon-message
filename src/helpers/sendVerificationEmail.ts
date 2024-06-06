import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";

import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string, // verification code.
): Promise<apiResponse>{
    try {
        await resend.emails.send({
            from: "", // email to send mails.
            to: email,
            subject: "Verify your email for anon-me",
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return { success: true, message: "Verification email sent successfully." }
    } catch (emailError) {
        console.log("Error sending verification email: ", emailError)
        return { success: false, message: "Error sending verification email." }
    }
}