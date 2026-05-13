"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useUIContext } from "@/context/ui.context";
import classNames from "classnames";
import { RelatedSongs } from "../RelatedSongs";
import FullScreenImage from "../FullScreenImage/FullScreenImage";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { pause, setCurrentTime, setDuration, setVolume } from "@/store/player/player.slice";
import { useAudio } from "@/hooks/features/player/useAudio";
import { usePlayer } from "@/hooks/features/player/usePlayer";
import { selectCurrentSong, selectQueueSongs } from "@/store/player/player.selector";
import { toast } from "@/helpers/toast";
import { useLockScroll } from "@/hooks/common/useLockScroll";
import { VolumeControls } from "../VolumeControls";
import { PlayerControls } from "../PlayerControls";


export default function MusicPlayer() {

    const playNext = usePlayerActions().playNext;
    const player = usePlayer();
    const { togglePlayer, playerOpen, sidebarOpen } = useUIContext();

    const { loading, error, setError, handlers } = useAudio(player.audioRef);

    const currentSong = useSelector(selectCurrentSong)
    const queueSongs = useSelector(selectQueueSongs)

    useLockScroll(playerOpen)

    useEffect(() => {
        if (error !== null) {
            { } toast("Error", error)
            player.dispatch(pause())
        }

    }, [error])

    useEffect(() => {
        if (player.currentSongId) {
            setError(null);
        }
    }, [player.currentSongId])

    if (!currentSong) return null;

    const currentProgress = player.isSeeking ? player.tempValue : player.progress

    return (
        <>
            <div className={`fixed bottom-0 flex items-center transition-height z-40 w-full h-17.5 bg-neutral-800`}>

                <div className="absolute bottom-15 w-full">
                    <input
                        type="range"
                        className="w-full h-1 slider-audio"
                        style={{
                            background: `linear-gradient(to right, red ${currentProgress}%, rgba(255,255,255,0.2) ${currentProgress}%)`
                        }}
                        min={0}
                        max={100}
                        value={player.isSeeking ? player.tempValue : player.progress}
                        onPointerDown={() => player.setIsSeeking(true)}
                        onChange={(e) => {
                            player.setTempValue(Number(e.target.value));
                        }}
                        onPointerUp={(e) => {
                            if (!player.audioRef.current) return;

                            const value = Number((e.target as HTMLInputElement).value);
                            const newTime = (value / 100) * player.duration;

                            player.audioRef.current.currentTime = newTime;
                            player.dispatch(setCurrentTime(newTime));
                            player.setIsSeeking(false);
                        }}
                    />
                </div>

                <div onClick={togglePlayer} className="relative flex items-center justify-between w-full">
                    <PlayerControls
                        loading={loading}
                        queueSongs={queueSongs}
                        currentSong={currentSong}
                        error={!!error}
                    />
                    <VolumeControls />
                </div>
            </div>

            {/* queue */}
            <div className={classNames(
                "fixed z-min-w-0 flex-1 30 overflow-y-auto transition-height duration-300 bottom-0 bg-black inset-x-0",
                playerOpen ? "h-[calc(100vh-60px)]" : "h-17.5",
                sidebarOpen ? "lg:ml-55" : "ml-0 sm:ml-18.75"
            )}
            >
                <div className="flex flex-col items-center justify-center mx-4 lg:mx-20 lg:gap-x-20 lg:flex-row">
                    <FullScreenImage cover={currentSong.cover}/>

                    <div className="flex-1 min-w-0 w-full">
                        <RelatedSongs queueSongs={queueSongs} />
                    </div>
                </div>
            </div>
            
            <audio
                src={currentSong.preview}
                ref={player.audioRef}
                onTimeUpdate={() => {
                    if (!player.audioRef.current) return;
                    player.dispatch(setCurrentTime(player.audioRef.current.currentTime))
                }}
                onLoadedMetadata={() => {
                    if (!player.audioRef.current) return;
                    player.dispatch(setDuration(player.audioRef.current.duration));
                }}
                onEnded={() => playNext()}
                onVolumeChange={(e) => {
                    const audio = e.currentTarget.volume;
                    player.dispatch(setVolume(audio));
                }}
                onPlaying={handlers.onCanPlay}
                onWaiting={handlers.onLoadStart}
                {...handlers}
            />
        </>
    )

}