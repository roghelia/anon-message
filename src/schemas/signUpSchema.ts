import { z } from "zod";

export const usernameValidation = z.
    string()
    .min(2, "Username must be at least 2 characters long.")
    .max(20, "Username must be less than 20 characters long.")
    .regex(/^[a-zA-z0-9_]/, "Username must not contain special characters.")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Please enter a valid email."}),
    password: z.string().min(6, {message: "Password must be at least 8 characters long."}),
})