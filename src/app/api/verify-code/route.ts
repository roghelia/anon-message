import dbConnect from "@/lib/dbConnection";
import User from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username); 
        const user = await User.findOne({username: decodedUsername});
        if(!user){
            return Response.json({
                success: false,
                message: "Invalid username."
            }, {status: 400});
        } 

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Code verified successfully."
            }, {status: 200});  
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Code has expired."
            }, {status: 400});
        } else {
            return Response.json({  
                success: false,
                message: "Invalid code."
            }, {status: 400});
        }
        
    } catch (error) {
        console.error(error);
        return Response.json({
            success: false,
            message: "Error verifying code."
        }, {status: 500});
    }
}