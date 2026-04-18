import { useScreen } from "@/context/screen.context";
import { useUIContext } from "@/context/ui.context";
import { usePlayer } from "@/hooks/features/player/usePlayer";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { useVolumeControls } from "@/hooks/features/player/useVolumeControls";
import { Icons } from "@/icons";
import { setVolume } from "@/store/player/playerSlice";
import { Button } from "@heroui/react";
import { FaCaretLeft, FaCaretUp } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";

export default function VolumeControls() {
    const { dispatch, audioRef } = usePlayer();
    const { 
        localVolume, 
        setLocalVolume, 
        toggleMute, 
        open, 
        setOpen, 
        mobileOpen,
        setMobileOpen,
    } = useVolumeControls();

    const { setLoop, repeat, setShuffle } = usePlayerActions();
    const { togglePlayer, playerOpen } = useUIContext();
    const isMobile = useScreen();

    return (
        <div
            className="flex items-center gap-x-2"
            onMouseLeave={() => setOpen(false)}
        >
            <div className={`absolute right-16 flex items-center gap-x-1 bg-neutral-800 h-full px-2 rounded-lg transition-all duration-300 text-white
                lg:static lg:bg-transparent lg:opacity-100 lg:pointer-events-auto
                ${open || mobileOpen
                    ? "opacity-100 translate-x-0 pointer-events-auto" 
                    : "opacity-0 translate-x-4 pointer-events-none"}
                `}>

                <div onClick={(e) => e.stopPropagation()} className="group flex items-center">

                    <input
                        className="opacity-100 slider transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                        style={{
                            background: `linear-gradient(to right, white ${localVolume}%, rgba(255,255,255,0.2) ${localVolume}%)`
                        }}
                        type="range"
                        min={0}
                        max={100}
                        value={localVolume}
                        onChange={(e) => {
                            const audio = Number(e.target.value);

                            setLocalVolume(audio)
                            dispatch(setVolume(audio))
                            audioRef.current!.volume = audio / 100
                        }}
                        onMouseUp={() => {
                            dispatch(setVolume(localVolume / 100))
                        }}
                        size={10}
                    />
                    <Button
                        onPress={() => toggleMute()}
                    >
                        { localVolume === 0 ? <Icons.Mute size={22} /> : <Icons.Volume size={22} /> }
                    </Button>

                </div>
                
                <Button
                    className="hover:bg-white/30"
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={setLoop}
                >
                    <FiRepeat className={`mx-auto ${repeat ? "text-white" : "text-neutral-500"}`} size={22} />
                </Button>

                <Button
                    className="hover:bg-white/30" 
                    radius="full"
                    isIconOnly
                    variant="light"
                    onPress={setShuffle}
                >
                    <Icons.Shuffle size={22} className="mx-auto" />
                </Button>
            </div>

            <div className="flex items-center text-white lg:hidden">
                <Button
                    isIconOnly
                    variant="light"
                    className="flex sm:hidden"
                    onPress={() => {
                        if (isMobile) setMobileOpen(prev => !prev)
                    }}
                >
                    <FaCaretLeft size={25} />
                </Button>

                <Button
                    isIconOnly
                    variant="light"
                    className="hidden sm:flex"
                    onMouseEnter={() => {
                        if (!isMobile) setOpen(true)
                    }}
                >
                    <FaCaretLeft size={25} />
                </Button>
            </div>
            
            <Button
                className="hover:bg-white/30" 
                isIconOnly 
                radius="full"
                variant="light"
                onPress={togglePlayer}
            >
                <FaCaretUp size={25} className={`transition-transform duration-300 mx-auto ${playerOpen ? "rotate-180" : "rotate-0"}`} />
            </Button>
        </div>
    );
}