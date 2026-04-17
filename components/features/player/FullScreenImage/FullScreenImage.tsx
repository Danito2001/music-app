"use client";

import { usePlayer } from "@/hooks/features/player/usePlayer";
import { pause, play } from "@/store/player/playerSlice";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRef, useState } from "react"
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { useDispatch } from "react-redux";


export default function FullScreenImage({ cover }: { cover: string; }) {

    const [ isFullScreen, setIsFullScreen ] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch();
    const isPlaying = usePlayer().isPlaying;

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement && containerRef.current) {
            await containerRef.current.requestFullscreen();
            setIsFullScreen(true)
        } else {
            await document.exitFullscreen();
            setIsFullScreen(false)
        }
    }

    let clickTimeout: NodeJS.Timeout

    const handleClick = () => {
        clearTimeout(clickTimeout);

        clickTimeout = setTimeout(() => {
            isPlaying ? dispatch(pause()) : dispatch(play());
        }, 200);
    }

    const handleDoubleClick = () => {
        clearTimeout(clickTimeout);
        toggleFullscreen();
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[250px] md:max-w-sm aspect-square"

        >
            <Image
                onDoubleClick={handleDoubleClick}
                onClick={handleClick}
                src={cover}
                alt="album"
                className={`rounded-lg shrink object-contain h-full ${isFullScreen ? "w-full" : "max-w-sm"}`}
                fill
            />
            <Button
                onPress={toggleFullscreen}
                className="absolute top-4 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                isIconOnly
            >
                {isFullScreen
                    ? <MdFullscreenExit size={20} className="mx-auto" />
                    : <MdFullscreen size={20} className="mx-auto" />}
            </Button>
        </div>
    );
}