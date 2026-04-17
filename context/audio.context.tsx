"use client";

import { setSeekTo } from "@/store/player/playerSlice";
import { RootState } from "@/store/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

type AudioContextType = {
    audioRef: React.RefObject<HTMLAudioElement | null>
}

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export default function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dispatch = useDispatch();

    const { isPlaying, currentSongId, seekTo } = useSelector((state: RootState) => state.player)

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.play().catch(() => {})
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, currentSongId])

    useEffect(() => {
        if (seekTo !== null && audioRef.current) {
            audioRef.current.currentTime = seekTo
        }

        dispatch(setSeekTo(null));
    }, [seekTo])
    

	return <AudioPlayerContext.Provider value={{ audioRef }}>{children}</AudioPlayerContext.Provider>
}

export function useAudioPlayerContext() {
    const context = useContext(AudioPlayerContext);
    if (!context) {
        throw new Error('useAudioPlayerContext debe usarse dentro de un <UIProvider>');
    }
    return context;
}