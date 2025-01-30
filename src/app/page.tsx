"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { JSX } from "react";
import { accessCtx } from "@/components/access_context";
import { verifyToken } from "@/lib/models/access";
import type { User } from "@/lib/models/access";
import { getReview, createReview } from "@/lib/models/reviews";
import type { Review } from "@/lib/models/reviews";
import { getCatalog } from "@/lib/models/catalog";
import type { CatalogItem } from "@/lib/models/catalog";

interface FakeReview {
    name: {
        first: string;
    };
}

export default function Home() {
    const { logged } = accessCtx();
    const [ formSuccess, setFormSuccess ] = useState(true);
    const [ formStatus, setFormStatus ] = useState(false);
    const [ catalog, setCatalog ] = useState<CatalogItem[]>([]); 
    const [ fakeReviews, setFakeReviews ] = useState([]);
    const [ reviews, setReviews ] = useState<Review[]>([]); 
    const [ reviewElements, setReviewElements ] = useState<JSX.Element[]>([]);

    const initialForm = {
        user_id: undefined as number|undefined,
        rating: 0 as number,
        comment: ""
    };
    const [ formData, setFormData ] = useState(initialForm);
    
    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData();
        for(const [k,v] of Object.entries(formData)) {
            if(!v) {
                setFormSuccess(false);
                break;
            }
            data.append(k,v as string);
        }

        if(formSuccess) {
            setFormStatus(await createReview(data)); // TODO: add more error msgs
        } else {
            setFormStatus(false);
        }
    }

    const handleText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            "comment": event.target.value
        }));
    }

    const changeRating = (ratingLvl: number) => {
        setFormData((prevState) => ({
            ...prevState,
            "rating": ratingLvl
        }));
    }

    const  constructReviews = useCallback(() => {
        const _reviewElements: JSX.Element[] = [];
        let n=0;
        while(reviews.length!==0&&n!==30) {
            if((Math.floor(Math.random()*10)>5)&&reviews.length!==0) { // its crazy this framework needs double safety checks
                const selected = Math.floor(Math.random()*reviews.length);
                const review: Review = reviews.splice(selected, 1)[0];
                _reviewElements.push(
                    <div key={review.id} className="flex flex-col min-w-44 min-h-28 max-h-44 lg:min-w-64 lg:max-w-72 lg:min-h-48 lg:max-h-64 p-4 border-2 border-dashed border-black">
                        <span>{review.email}</span>
                        <div className="text-3xl select-none">
                            <span className={`${review.rating>0 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${review.rating>1 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${review.rating>2 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${review.rating>3 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${review.rating>4 ? "text-yellow-500":""}`}>*</span>
                        </div>
                        <span>{review.comment}</span>
                    </div>
                )
            } else if(fakeReviews.length!==0) {
                const review = fakeReviews.splice(0, 1)[0] as FakeReview;
                const rating = Math.round(Math.random())+4;
                _reviewElements.push(
                    <div key={`${review.name.first}-${Date.now()}`} className="flex flex-col min-w-44 min-h-28 max-h-44 lg:min-w-64 lg:max-w-72 lg:min-h-48 lg:max-h-64 p-4 border-2 border-dashed border-black">
                        <span>{review.name.first}</span>
                        <div className="text-3xl select-none">
                            <span className={`${rating>0 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${rating>1 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${rating>2 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${rating>3 ? "text-yellow-500":""}`}>*</span>
                            <span className={`${rating>4 ? "text-yellow-500":""}`}>*</span>
                        </div>
                        <span>Enak very good i like nice very nice.</span>
                    </div>
                )
            }
            n++;
        }
        setReviewElements(_reviewElements);
    }, [reviews, fakeReviews]);

    useEffect(() => {
        if(logged) {
            (async () => {
                const res = await fetch("https://randomuser.me/api?results=10", {cache: "no-cache"});
                const data = await res.json();
                setFakeReviews(data.results);

                const res2 = await getCatalog() as CatalogItem[];
                setCatalog(res2);

                const res3 = await getReview() as Review[];
                setReviews(res3);

                if(logged!=="none") {
                    const resToken = await verifyToken(true);
                    setFormData((prevState) => ({
                        ...prevState,
                        "user_id": (resToken as User).id
                    }));
                }
            })();
        }
    }, [logged]);

    useEffect(() => {
        if(reviews!==undefined&&fakeReviews!==undefined) {
            constructReviews();
        }
    }, [reviews, fakeReviews, constructReviews]);

    useEffect(() => {
        setFormData(initialForm);
    }, []);

    return (
    <div className="flex flex-row justify-center my-32 sm:my-8 md:my-0 h-[calc(80vh)] items-center">
        <div className="flex flex-col w-full h-full mr-12 sm:mr-24 md:mr-32">
            <div className="grid grid-flow-col grid-rows-2 gap-4 w-full h-full">
                <div className="relative border-2 border-dashed border-black overflow-hidden">
                    <Image
                        src={catalog[0]?.thumbnail ? catalog[0].thumbnail : "/favicon.ico"}
                        alt="Featured Thumbnail"
                        className="object-cover"
                        fill
                    />
                </div>
                <div className="relative border-2 border-dashed border-black">
                    <Image
                        src={catalog[1]?.thumbnail ? catalog[1].thumbnail : "/favicon.ico"}
                        alt="Featured Thumbnail"
                        className="object-cover"
                        fill
                    />
                </div>
                <div className="relative border-2 border-dashed border-black row-span-2">
                    <Image
                        src={catalog[2]?.thumbnail ? catalog[2].thumbnail : "/favicon.ico"}
                        alt="Featured Thumbnail"
                        className="object-cover"
                        fill
                    />
                </div>
            </div>
            <div className="relative flex flex-col w-full h-full justify-end overflow-hidden">
                <div className="absolute bg-gradient-to-b lg:bg-gradient-to-r from-orange-200 to-10% size-full z-10"/>
                <div className="absolute top-0 lg:left-0 pt-0 sm:pt-[calc(10vh)] md:pt-[calc(15vh)] w-full">
                    <div className="grid grid-flow-row lg:grid-flow-col gap-4 animate-scroll-top animate-scroll-right">
                        {reviewElements}
                    </div>
                </div>
                <div className="absolute bg-gradient-to-t lg:bg-gradient-to-l from-orange-200 to-20% size-full z-10"/>
            </div>
        </div>
        <div className="flex flex-col w-[calc(30vw)] h-full justify-top items-center">
            <Image
                className="hidden md:block max-w-32 max-h-32 md:max-w-64 md:max-h-64"
                src="/angkringan.svg"
                alt="Angkringan"
                width={300}
                height={120}
            />
            <h1 className="text-lg md:text-xl w-full text-center">Gimana tahunya? 😋 Yuk beri reviewnya...</h1>
            {logged!=="none" ? (
                <form onSubmit={formSubmit}>
                    <div className="text-3xl text-center select-none">
                        <span className={`${(formData.rating ?? 0)>0 ? "text-yellow-500":""}`} onClick={()=>{changeRating(1)}}>*</span>
                        <span className={`${(formData.rating ?? 0)>1 ? "text-yellow-500":""}`} onClick={()=>{changeRating(2)}}>*</span>
                        <span className={`${(formData.rating ?? 0)>2 ? "text-yellow-500":""}`} onClick={()=>{changeRating(3)}}>*</span>
                        <span className={`${(formData.rating ?? 0)>3 ? "text-yellow-500":""}`} onClick={()=>{changeRating(4)}}>*</span>
                        <span className={`${(formData.rating ?? 0)>4 ? "text-yellow-500":""}`} onClick={()=>{changeRating(5)}}>*</span>
                    </div>
                    <textarea className="mt-4 bg-transparent border-2 border-black rounded-md w-full h-[calc(20vh)]" onChange={handleText} value={formData.comment} placeholder="Kami nanti review kamu.."/>
                    {!formSuccess &&
                        <span className="text-orange-500">Mohon isi semua data untuk memberi review.</span>
                    }
                    {formStatus &&
                        <span className="text-orange-500">Terima kasih atas reviewnya.</span>
                    }
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>
            ) : (
                <Link href="/access" className="transform transition delay-50 duration-200 hover:-translate-y-1 ease-in-out hover:border-solid border-dashed border-black border-b-2 text-lg">Login to Review</Link>
            )}
        </div>
    </div>
    );
}
