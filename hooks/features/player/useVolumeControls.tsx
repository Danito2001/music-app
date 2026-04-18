import { useAudioPlayerContext } from "@/context/audio.context";
import { setVolume } from "@/store/player/playerSlice";
import { RootState } from "@/store/store";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useVolumeControls = () => {
    const dispatch = useDispatch();
    const audioRef = useAudioPlayerContext().audioRef;

    const volume = useSelector((state: RootState) => state.player.volume);

    const [ localVolume, setLocalVolume ] = useState(volume * 100);
    const [ open, setOpen ] = useState(false);
    const [ mobileOpen, setMobileOpen ] = useState(false);
    const lastVolumeRef = useRef(localVolume);

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (localVolume === 0) {
            setLocalVolume(lastVolumeRef.current);
            dispatch(setVolume(lastVolumeRef.current / 100));
            audioRef.current.muted = false;
        } else {
            lastVolumeRef.current = localVolume;
            setLocalVolume(0);
            dispatch(setVolume(0));
            audioRef.current.muted = true;
        }
    };


    return {
        localVolume,
        setLocalVolume,
        toggleMute,
        open, 
        setOpen,
        mobileOpen,
        setMobileOpen,
    };
};