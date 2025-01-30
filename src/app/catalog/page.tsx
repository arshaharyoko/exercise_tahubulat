"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCatalog, deleteCatalog } from "@/lib/models/catalog";
import type { CatalogItem } from "@/lib/models/catalog";
import { accessCtx } from "@/components/access_context";

export default function Catalog() {
    const { logged } = accessCtx();
    const [ catalog, setCatalog ] = useState<CatalogItem[]>([]); 

    const handleUpdate = async (id: number) => {
        window.location.href = `/catalog_modify?id=${id}`;
    }

    const handleDeletion = async (id: number) => {
        if(await deleteCatalog(id)) {
            const res = await getCatalog();
            if(res&&Array.isArray(res)) {
                setCatalog(res);
            }
        };
    }

    useEffect(() => {
        (async () => {
            const res = await getCatalog();
            if(res&&Array.isArray(res)) {
                setCatalog(res);
            }
        })();
    }, []);

    return (
        <div className="flex flex-row mt-8 md:mt-6 lg:mt-4 overflow-scroll">
            {logged==="admin" && 
                <div className="h-full">
                    <Link href="/catalog_modify"><svg className="w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg></Link>
                </div>
            }
            {catalog.length!==0 ? (
                <div className="grid gap-x-1 gap-y-4 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                    {catalog.map((item) => (
                        <div key={item.id} className="flex flex-col p-4 border-2 border-solid border-black min-w-44 max-w-52 min-h-36 max-h-52 md:min-w-64 md:max-w-72 md:min-h-56 md:max-h-72 text-2xl">
                            <Image
                                src={item?.thumbnail ? item.thumbnail : "/favicon.ico"}
                                alt="Thumbnail"
                                className="min-h-24 max-h-24"
                                width={128}
                                height={128}
                            />
                            <span>{item.name}</span>
                            <hr className="border-black border-dashed border-2" />
                            <span className="h-screen overflow-hidden">{item.description}</span>
                            <div className="grid grid-flow-col w-full">
                                <span>{item.price}</span>
                                {logged==="admin" &&
                                    <div className="grid justify-end">
                                        <svg onClick={() => handleUpdate(item.id)} className="w-6 pb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 125.7-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z"/></svg>
                                        <svg onClick={() => handleDeletion(item.id)} className="w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                                    </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex w-full justify-center items-center h-[calc(50vh)]">
                    <h1>Nothing to see here... Come back later for a surprise...</h1>
                </div>
            )}
        </div>
    );
}