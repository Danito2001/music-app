import { useAudioPlayerContext } from "@/context/audio.context";
import { RootState } from "@/store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export const usePlayer = () => {

    const dispatch = useDispatch();
    const { isPlaying, currentTime, duration, volume, currentSongId, repeat, currentSource } = useSelector(
        (state: RootState) => state.player
    );

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const [ tempValue, setTempValue ] = useState(progress);
    const [ isSeeking, setIsSeeking ] = useState(false);

    const audioRef = useAudioPlayerContext().audioRef;

    return {
        audioRef,
        dispatch,
        isPlaying,
        currentTime,
        duration,
        volume,
        currentSongId,
        repeat,
        currentSource,
        progress,
        tempValue,
        setTempValue,
        isSeeking, 
        setIsSeeking,
    };
};