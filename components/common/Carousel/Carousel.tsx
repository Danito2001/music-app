"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


export default function Carousel({ title, children, history }: {title?: string, children:React.ReactNode, history?: boolean}) {

    const [ isAtStart, setIsAtStart ] = useState(false);
    const [ isAtEnd, setIsAtEnd ] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const moveRight = () => {
        containerRef.current?.scrollBy({
            left: 400,
            behavior: "smooth"
        })
    }

    const moveLeft = () => {
        containerRef.current?.scrollBy({
            left: -400,
            behavior: "smooth"
        })
    }

    useEffect(() => {

        const refScroll = containerRef.current
        if (!refScroll) return;

        const handleScroll = () => {
            const { scrollLeft, clientWidth, scrollWidth } = refScroll;
            setIsAtStart(scrollLeft <= 1)
            setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1)
        }

        refScroll.addEventListener("scroll", handleScroll)

        handleScroll();

        return () => {
            refScroll.removeEventListener("scroll", handleScroll)
        }

    }, [])
    

    return (
        <div className="relative flex flex-col h-[350px]">
            <div className="flex items-center justify-between gap-x-4">
                {!history ? (
                    <h3 className="pb-2 font-semibold text-lg md:text-xl">{title}</h3>
                ) : (
                    <div className="flex gap-x-4">
                        <Image
                            className="rounded-full"
                            width={60}
                            height={40}
                            src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                            alt=""
                        />
                        <div className="flex flex-col">
                            <span className="opacity-85 text-sm">Nombre Usuario</span>
                            <Link href="/listen_again" className="text-lg font-semibold md:text-xl hover:underline">Volver a escuchar</Link>
                        </div>
                    </div>
                )}
                <div className="flex gap-x-4">
                    <Button 
                        isDisabled={isAtStart}
                        isIconOnly 
                        className={`border border-white/10 hover:bg-white/10 transition-background w-10 h-10 
                            ${isAtStart ? "opacity-60 cursor-none" : "opacity-100 cursor-auto"}`} 
                        radius="full"
                        onPress={moveLeft}
                    >
                        <IoIosArrowBack size={18} className="mx-auto" />
                    </Button>
                    <Button 
                        isDisabled={isAtEnd}
                        isIconOnly 
                        className={`border border-white/10 hover:bg-white/10 transition-background w-10 h-10 
                            ${isAtEnd ? "opacity-60 cursor-none" : "opacity-100 cursor-auto"}`} 
                        radius="full"
                        onPress={moveRight}
                    >
                        <IoIosArrowForward size={18} className="mx-auto" />
                    </Button>
                </div>
            </div>

            <div ref={containerRef} className={`absolute top-14 flex gap-x-4 px-4 ${history && "pt-6"} scrollbar w-full`}>
                {children}
            </div>
        </div>
    )
}