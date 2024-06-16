import dbConnect from "@/lib/dbConnection";
import User from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { queryObjects } from "v8";
import { messagesSchema } from "@/schemas/messageSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam);
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false, 
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "invalid query parameters."
            })
        } else {
            const {username} = result.data;
            const user = await User.findOne({username});
            if(user) {
                return Response.json({
                    success: false, 
                    message: "Username is already taken."
                }, {status: 400})
            } else {
                return Response.json({
                    success: true,
                    message: "username is available."
                }, {status: 200})
            }
        }
    }
    catch (error) {
        console.error(error);
        return Response.json({
            success: false, 
            message: "error checking username"
        }, {status: 500});
    }
}