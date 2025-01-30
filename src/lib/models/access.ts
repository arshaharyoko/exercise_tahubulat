"use server";

import sql from "@/lib/db";
import { cookies } from "next/headers";
import { randomBytes, pbkdf2Sync } from "node:crypto";
import { REGISTRATION_PERMISSIONS_STR, JWT_KEY } from "@/lib/environment";
import jwt from "jsonwebtoken";

export interface User {
    id: number,
    email: string,
    access: string
}

export async function register(formData: FormData) {
    const email = formData.get("email") as string;
    if((await sql`SELECT * FROM users WHERE email = ${email}`).length!==0) {
        return false;
    }

    const token = formData.get("token") as string;
    const pwd = formData.get("pwd") as string;
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(pwd, salt, 8192, 64, "sha512").toString("hex");
    let access = "user";
    if(token===REGISTRATION_PERMISSIONS_STR) {
        access = "admin";
    }

    try {
        await sql`INSERT INTO users (email, hash, salt, access) VALUES (${email}, ${hash}, ${salt}, ${access})`;
    } catch(err) {
        console.error(err);
        return false;
    }

    return true;
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const pwd = formData.get("pwd") as string;
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if(user.length===1) {
        const hash = pbkdf2Sync(pwd, user[0].salt, 8192, 64, "sha512").toString("hex");
        if(user[0].hash===hash) {
            const cookieStore = await cookies();
            const jwtoken = jwt.sign(user[0], JWT_KEY as string, {expiresIn:"1d"});
            cookieStore.set("Authorization", jwtoken, {
                secure: true,
                httpOnly: true,
                sameSite: "strict",
                maxAge: 86400,
                path: "/"
            })
            return true;
        }
        return false;
    }
    return false;
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("Authorization");
    return;
}

export async function verifyToken(body=false): Promise<User|string> {
    const token = (await cookies()).get("Authorization")?.value;
    if(!token) {
        return "none";
    }

    return new Promise((resolve) => {
        jwt.verify(token, JWT_KEY as string, (err, decoded) => {
            if(err) {
                console.error(err);
                return resolve("none");
            }
            
            if(body) {
                return resolve(decoded as User)
            }

            return resolve((decoded as User).access || "none");
        });
    });
}