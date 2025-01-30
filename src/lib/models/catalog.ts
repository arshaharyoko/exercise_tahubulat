"use server";

import sql from "@/lib/db";
import { verifyToken } from "@/lib/models/access";

export type CatalogItem = {
    id: number;
    name: string;
    description: string;
    price: string;
    thumbnail: string;
}

export async function getCatalog(id?: string): Promise<CatalogItem|CatalogItem[]|null> {
    if(!id) {
        return (await sql`SELECT * FROM items`) as CatalogItem[];
    }
    
    const res = await sql`SELECT * FROM items WHERE id = ${id}`;
    return res[0] as CatalogItem ?? null;
}

export async function createCatalog(formData: FormData) {
    if((await verifyToken())!=="admin") return false;

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const thumbnail = formData.get("thumbnail") as string;

    try {
        await sql`INSERT INTO items (name, description, price, thumbnail) VALUES (${name}, ${description}, ${price}, ${thumbnail})`;
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function updateCatalog(formData: FormData) {
    if((await verifyToken())!=="admin") return false;

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const thumbnail = formData.get("thumbnail") as string;

    try {
        await sql`UPDATE items SET name = ${name}, description = ${description}, price = ${price}, thumbnail = ${thumbnail} WHERE id = ${id}`;
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function deleteCatalog(id: number) {
    if((await verifyToken())!=="admin") return false;
    return (await sql`DELETE FROM items WHERE id = ${id}`);
}