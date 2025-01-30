"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { register, login, logout } from "@/lib/models/access";
import dynamic from "next/dynamic";

const Access = dynamic(() => Promise.resolve(AccessComponent), { ssr: false });

function AccessComponent() {
    const registrationMode = useSearchParams().has("register");
    const logoutMode = useSearchParams().has("logout");
    const [ tokenAvail, setTokenAvail ] = useState(false);
    function switchToken() {
        if(tokenAvail) {
            setTokenAvail(false);
        } else {
            setTokenAvail(true);
        }
    }

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData();
        for(const [k,v] of Object.entries(formData)) {
            if(!registrationMode) {
                if(k!=="token") {
                    data.append(k,v);
                }
            } else {
                data.append(k,v);
            }
        }

        if(!registrationMode) {
            setFormStatus(await login(data));
            window.location.href = "/";
        } else {
            setFormStatus(await register(data));
            window.location.href = "/access";
        }
    }

    const [ formData, setFormData ] = useState({
        email: "",
        pwd: "",
        token: ""
    });
    const [ formStatus, setFormStatus ] = useState(false);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
      
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: fieldValue
        }));
    }

    useEffect(() => {
        if(logoutMode) {
            (async () => {
                await logout();
                window.location.href = "/";
            })();
        }
    }, [logoutMode]);

    return (
        <div className="flex justify-center items-center h-[calc(50vh)] font-[family-name:var(--font-quantico-sans)] text-black font-outline-0">
            <div className="flex w-1/2 h-[calc(40vh)] border-black border-2 border-solid">
                <div className="flex flex-col items-baseline h-full justify-end border-dashed border-black border-r-2">
                    <span className=" text-black -rotate-90 text-lg md:text-4xl origin-bottom-left transform translate-x-[100%]">ACCESS</span>
                </div>

                <form className="grid p-4 w-full border-solid border-black" onSubmit={formSubmit}>
                    <input className="h-16 bg-transparent border-b-2 border-solid border-black placeholder-stone-700" type="text" name="email" placeholder="E-Mail" onChange={handleInput}/>
                    <input className="h-16 bg-transparent border-b-2 border-solid border-black placeholder-stone-700" type="password" name="pwd" placeholder="Password" onChange={handleInput}/>
                    {registrationMode &&
                        <div>
                            <input type="checkbox" onChange={switchToken}/>
                            {tokenAvail ? (
                                <input className="ml-2 h-16 bg-transparent border-l-2 border-solid border-black placeholder-stone-700" type="text" name="token" placeholder="Registration Token" onChange={handleInput}/>
                            ): (
                                <span className="ml-2">Punya token registrasi?</span>
                            )}
                        </div>
                    }
                    <div>
                        <input className="mr-4 h-16 w-16 border-dotted border-black border-b-2" type="submit" value={registrationMode ? "Register" : "Log In"}/>
                        {registrationMode ? (
                            <Link href="/access">Atau login...</Link>
                        ): (
                            <Link href="/access?register">Atau register akun baru...</Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Access;