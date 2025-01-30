"use server";

import sql from "@/lib/db";
import { verifyToken } from "@/lib/models/access";

export type Review = {
    id: number,
    email: string,
    rating: number,
    comment: string
}

export async function getReview(id=undefined): Promise<Review|Review[]|null> {
    if(!id) {
        return (await sql`SELECT reviews.id, users.email, reviews.rating, reviews.comment FROM reviews LEFT JOIN users ON reviews.user_id = users.id`) as Review[];
    }
    
    const res = (await sql`SELECT reviews.id, users.email, reviews.rating, reviews.comment FROM reviews LEFT JOIN users ON reviews.user_id = users.id WHERE id = ${id}`);
    return res[0] as Review ?? null;
}

export async function createReview(formData: FormData) {
    const tokenAccess = await verifyToken();
    if(tokenAccess!=="admin"&&tokenAccess!=="user") return false;
    
    const user_id = (formData.get("user_id") as unknown) as number;
    const rating = (formData.get("rating") as unknown) as number;
    const comment = formData.get("comment") as string;

    try {
        await sql`INSERT INTO reviews (user_id, rating, comment) VALUES (${user_id}, ${rating}, ${comment})`;
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}