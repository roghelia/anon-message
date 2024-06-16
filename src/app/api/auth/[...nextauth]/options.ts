import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnection"
import User from "@/models/User"

export const AuthOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize (credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await User.findOne({
                        $or: [
                            {username: credentials.identifier},
                            {email: credentials.identifier}
                        ]
                    })
                    
                    if(!user) {
                        throw new Error("User not found")
                    }

                    if(!user.isVerified){
                        throw new Error("User not verified, please verify your account first.");
                    }

                    const isPassCorrect = await bcrypt.compare(credentials.password, user.password)
                    
                    if(isPassCorrect){
                        return user
                    } else {
                        throw new Error("Incorrect password.")
                    }
                } catch (error: any) {
                    throw new Error("error: ", error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({session, token}) {
            if(token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET_KEY,
}