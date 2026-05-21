"use client";

import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import Image from "next/image";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { formatTime } from "@/helpers/formatTime";
import Link from "next/link";
import { pause, play } from "@/store/player/player.slice";
import { useDispatch } from "react-redux";
import { UiSong } from "@/interfaces/song.interface";
import { Option } from "@/interfaces/ui.interface";
import { OptionKeyResult, PlayType, ViewCard } from "@/interfaces/common.interface";
import { usePlayer } from "@/hooks/features/player/usePlayer";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { CollectionType } from "@/hooks/features/playlist/useCollectionType";
import { useScreen } from "@/context/screen.context";
import { useFloatingOptions } from "@/context/playback.context";

type SongRowData = {
    song: UiSong;
    options: Option[];
    currentSongId: string | null;
    view: Exclude<ViewCard, "large">;
    playlistId: string | null;
    mode?: PlayType;
    source?: CollectionType;
    optionKey: OptionKeyResult;
}

type CardVariantConfig = {
    showOptions?: boolean;
    showDuration?: boolean;
    showLike?: boolean;
    showAddPlaylist?: boolean;
    isLarge?: boolean;
};

export default function SongRowSuggestion({ song, currentSongId, options, view, playlistId, mode, source, optionKey }: SongRowData) {

    const dispatch = useDispatch();
    const player = usePlayerActions();
    const isPlaying = usePlayer().isPlaying;

    const { openOptions, closeOptions, state, menuRef } = useFloatingOptions();

    useClickOutside(menuRef, () => {
        closeOptions()
    }, state.isOpen)

    const isMobile = useScreen();
    const isActive = currentSongId === song.id

    // Controla que elementos mostrar segun el contexto
    const variants: Record<Exclude<ViewCard, "large">, CardVariantConfig> = {
        playlist: { showLike: true, showOptions: true, showDuration: true },
        queue: { showOptions: true, showDuration: true },
        search: { showOptions: true, showDuration: false },
        suggestion: { showLike: true, showAddPlaylist: true },
        "suggestion-queue": { showDuration: true },
    }

    const config = variants[view]

    return (
        <div className={`group flex items-center justify-between min-w-0 gap-x-4 p-2 rounded-lg ${isActive ? "bg-white/10" : ""} `}>

            <div className="flex items-center justify-between min-w-0">

                {/* left side */}
                <div className="flex gap-x-4 min-w-0">

                    <div className="group relative flex shrink-0 items-center justify-center min-w-0">
                        <Image
                            src={song.cover}
                            alt={song.albumTitle}
                            width={40}
                            height={40}
                            className="rounded-md shrink-0"
                        />

                        <div className="group-hover:bg-black/80 absolute inset-0" />

                        <Button
                            className="absolute opacity-0 group-hover:opacity-100"
                            onPress={() =>
                                !isActive
                                    ? player.playSong({
                                        songId: song.id,
                                        mode,
                                        source,
                                        playlistId
                                    })
                                    : isPlaying
                                        ? dispatch(pause())
                                        : dispatch(play())
                            }
                        >
                            {isActive && isPlaying ? <Icons.Pause size={20} className="mx-auto" /> : <Icons.Play size={20} />}
                        </Button>

                    </div>

                    <div className="flex flex-col justify-center min-w-0 text-white">
                        <h4 className="font-semibold truncate text-xs">
                            {song.title}
                        </h4>

                        <div className="flex gap-x-2 min-w-0 opacity-80 text-xs md:text-sm">

                            {optionKey.type === "song-search" && <span>Canción •</span>}

                            <Link
                                className="hover:underline truncate"
                                href={`/channel/${song.artistId}/${song.artistName.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                                {song.artistName}
                            </Link>

                            {song.albumTitle && <span>•</span>}

                            <Link
                                className="hover:underline truncate"
                                href={{
                                    pathname: "/playlist",
                                    query: {
                                        list: song.albumId,
                                        type: "album"
                                    }
                                }}
                            >
                                {song.albumTitle}
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

            {/* right side */}

            <div className="flex items-center gap-x-2">

                {/* like / dislike */}
                {config.showLike && (
                    <div className="hidden items-center group-hover:flex">

                        <Button
                            className="hover:bg-white/30"
                            radius="full"
                            isIconOnly
                            onPress={() => player.likedSong(song.id)}
                        >
                            {song.liked === "liked"
                                ? <Icons.Liked size={20} className="mx-auto" />
                                : <Icons.Like size={20} className="mx-auto" />}
                        </Button>

                        <Button
                            className="hover:bg-white/30"
                            radius="full"
                            isIconOnly
                            onPress={() => player.dislikedSong(song.id)}
                        >
                            {song.liked === "disliked"
                                ? <Icons.DisLiked size={20} className="mx-auto" />
                                : <Icons.Dislike size={20} className="mx-auto" />}
                        </Button>

                    </div>
                )}


                {/* add playlist */}
                {config.showAddPlaylist && playlistId && (
                    <Button onPress={() => player.addSuggestion(song.id, playlistId)}>
                        <MdOutlinePlaylistAdd size={20} />
                    </Button>
                )}


                {/* options */}
                {config.showOptions && (
                    <div className="">
                        <Button
                            onClick={(e) => {
                                openOptions({
                                    optionKey: optionKey.optionKey,
                                    options,
                                    anchorEl: e.currentTarget as HTMLElement
                                });
                            }}
                            radius="full"
                            isIconOnly
                            className={`items-center text-white hover:bg-white/30 ${isMobile ? "flex" : "hidden group-hover:flex"}`} 
                        >
                            <Icons.Options size={20} />
                        </Button>
                    </div>
                )}

                {/* duration */}
                {config.showDuration && (
                    <div className={`${view === "queue" && `${isMobile ? "" : "group-hover:hidden"}`} text-end`}>
                        <span className="text-sm opacity-85 text-white">
                            {formatTime(song.duration)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}