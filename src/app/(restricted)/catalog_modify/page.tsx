"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getCatalog, createCatalog, updateCatalog } from "@/lib/models/catalog";

export default function CatalogModify() {
    const editMode = useSearchParams().has("id");
    const catalogID = useSearchParams().get("id");

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData();
        for(const [k,v] of Object.entries(formData)) {
            if(!editMode) {
                if(k!=="id") {
                    data.append(k,v as string);
                }
            } else {
                data.append(k,v as string);
            }
        }

        if(!editMode) {
            setFormStatus(await createCatalog(data));
            window.location.href="/catalog";
        }
        
        setFormStatus(await updateCatalog(data));
        window.location.href="/catalog";
    }

    const [ formData, setFormData ] = useState({
        id: -1,
        name: "",
        description: "",
        price: "",
        thumbnail: ""
    });
    const [ formStatus, setFormStatus ] = useState(false);

    const imgToB64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            }
            reader.readAsDataURL(file);
            reader.onerror= (error) => reject(error);
        })
    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
      
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if(file) {
            const b64Img: string = await imgToB64(file);
            setFormData((prevState) => ({
                ...prevState,
                "thumbnail": b64Img
            }));
        }
    }

    useEffect(() => {
        (async () => {
            if(editMode&&catalogID) {
                const catalog = await getCatalog(catalogID);
                if(catalog&&!Array.isArray(catalog)) {
                    setFormData({
                        id: catalog.id ?? -1,
                        name: catalog.name ?? "",
                        description: catalog.description ?? "",
                        price: catalog.price ?? "",
                        thumbnail: catalog.thumbnail ?? "",
                    });
                }
            }
        })();
    }, [editMode, catalogID]);

    return (
        <div className="flex justify-center items-center h-[calc(50vh)] font-[family-name:var(--font-quantico-sans)] text-black font-outline-0">
            <div className="flex w-1/2 h-[calc(40vh)] border-black border-2 border-solid">
                <div className="flex flex-col items-baseline h-full justify-end border-dashed border-black border-r-2">
                    <span className="text-black -rotate-90 text-lg md:text-4xl origin-bottom-left transform translate-x-[100%]">ADD TO CATALOG</span>
                </div>

                <form className="grid p-4 w-full border-solid border-black" encType="multipart/form-data" onSubmit={formSubmit}>
                    <input type="hidden" name="id" value={formData.id} onChange={handleInput}/>
                    <input type="file" accept="image/*" onChange={handleFileUpload}/>
                    <input className="h-16 bg-transparent border-b-2 border-solid border-black placeholder-stone-700" type="text" name="name" value={formData.name} placeholder="Name" onChange={handleInput}/>
                    <input className="h-16 bg-transparent border-b-2 border-solid border-black placeholder-stone-700" type="text" name="description" value={formData.description} placeholder="Description" onChange={handleInput}/>
                    <input className="h-16 bg-transparent border-b-2 border-solid border-black placeholder-stone-700" type="text" name="price" value={formData.price} placeholder="Price" onChange={handleInput}/>
                    <input className="h-16 w-full border-dotted border-black border-b-2" type="submit" value={editMode ? "Apply Changes" : "Add"}/>
                </form>
            </div>
        </div>
    );
}