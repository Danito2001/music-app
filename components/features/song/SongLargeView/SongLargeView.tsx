"use client";

import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import Image from "next/image";
import { PlaybackOptions } from "../../player/PlaybackOptions";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { pause, play } from "@/store/player/playerSlice";
import { useFloatingPosition } from "@/hooks/common/useFloatingPosition";
import { UiSong } from "@/interfaces/song.interface";
import { Option } from "@/interfaces/ui.interface";
import { OptionKeyResult, PlayType } from "@/interfaces/common.interface";
import { usePlayer } from "@/hooks/features/player/usePlayer";
import { useClickOutside } from "@/hooks/common/useClickOutside";

type SongLargeData = {
    song: Omit<UiSong, "liked">;
    options: Option[];
    currentSongId: string | null;
    mode: PlayType;
    optionKey: OptionKeyResult;
    isPinned?: boolean;
}

export default function SongLargeView({ song, options, currentSongId, mode, optionKey, isPinned }: SongLargeData) {

    const dispatch = useDispatch();
    const player = usePlayerActions();
    const floating = useFloatingPosition();
    const isPlaying = usePlayer().isPlaying;

    useClickOutside(floating.menuRef, () => {
        floating.closeOptions()
    }, floating.optionsOpen)

    const isActive = currentSongId === song.id
    const isOpen = floating.optionsOpen === optionKey.optionKey

    return (
        <div className="flex flex-col shrink-0 w-[160px] text-white">
            <div className="group relative flex items-center justify-center w-fit">
                <Image
                    src={song.cover}
                    alt="Portada del álbum"
                    width={160}
                    height={160}
                    className="group-hover:opacity-60 transition-opacity rounded-lg"
                />

                <div className="group-hover:bg-black/70 absolute inset-0" />

                <Button
                    className="absolute group"
                    onPress={() =>
                        !isActive
                            ? player.playSong(song.id, mode)
                            : isPlaying
                                ? dispatch(pause())
                                : dispatch(play())
                    }
                >
                    {!isActive && <Icons.Play size={40} />}

                    {isActive && isPlaying && (
                        <>
                            <Icons.Sound size={40} className="group-hover:opacity-0" />
                            <Icons.Pause size={40} className="absolute inset-0 opacity-0 mx-auto group-hover:opacity-100"/>
                        </>
                    )}

                    {isActive && !isPlaying && (
                        <Icons.Play size={40} />
                    )}
                </Button>

                <div className="absolute right-0 top-0">
                    <Button
                        ref={floating.buttonRef}
                        onPress={() => floating.handleOpen(optionKey.optionKey)}
                        isIconOnly
                        radius="full"
                        className="group-hover:opacity-100 opacity-0 flex items-center text-white hover:bg-white/30"
                    >
                        <Icons.Options size={20} />
                    </Button>
                    <PlaybackOptions
                        open={isOpen}
                        options={options}
                        onSelect={floating.handleOptionSelect}
                        position={floating.position}
                        optionRef={floating.menuRef}
                    />
                </div>
            </div>
            <div className="text-sm">
                <h3 className="font-semibold">{song.title}</h3>
                <div className="flex items-center flex-wrap">
                    <div className="flex items-center gap-x-1">
                        {isPinned && <Icons.FillPin size={14} />}
                    </div>
                    <Link
                        href={`/channel/${song.artistId}/${song.artistName.toLowerCase().replace(/\s+/g, "-")}`}
                        className="hover:underline"
                    >
                        {song.artistName}
                    </Link>
                </div>
            </div>
        </div>
    )
}