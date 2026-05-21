import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineSkipNext, MdOutlineSkipPrevious } from "react-icons/md";
import { pause, play } from "@/store/player/player.slice";
import { formatTime } from "@/helpers/formatTime";
import { usePlayer } from "@/hooks/features/player/usePlayer";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { usePlayerOptions } from "@/hooks/features/player/usePlayerOptions";
import { Loading } from "@/components/common/Loading";
import { getOptionKey } from "@/helpers/getOptionKey";
import { UiSong } from "@/interfaces/song.interface";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { QueueSections } from "@/interfaces/player.interface";
import { useFloatingOptions } from "@/context/playback.context";

interface PlayerProps {
    currentSong: UiSong;
    queueSongs: QueueSections;
    loading: boolean;
    error: boolean;
}

export default function PlayerControls({ queueSongs, currentSong, loading, error }: PlayerProps) {

    const options = usePlayerOptions(currentSong, queueSongs);
    const { isPlaying, dispatch, currentTime, duration } = usePlayer();
    const { playNext, playPrev, likedSong, dislikedSong } = usePlayerActions();
    const { openOptions, closeOptions, state, menuRef } = useFloatingOptions();

    useClickOutside(menuRef, () => {
        closeOptions()
    }, state.isOpen)

    const optionKey = getOptionKey("player", currentSong.id);

    return (
        <>
            <div className="flex items-center gap-x-2 mx-2 text-white">
                <Button className="hover:bg-white/30" isIconOnly radius="full" onPress={() => playPrev(currentTime)}>
                    <MdOutlineSkipPrevious size={30} className="mx-auto" />
                </Button>
                <Button className={`${error ? "opacity-80 pointer-events-none" : "hover:bg-white/30"}`} isIconOnly radius="full"
                    onPress={() => !isPlaying ? dispatch(play()) : dispatch(pause())}
                >
                    {loading
                        ? <Loading type="player" />
                        : (!isPlaying
                            ? <Icons.Play size={30} className="mx-auto" />
                            : <Icons.Pause size={30} />
                        )
                    }

                </Button>
                <Button className="hover:bg-white/30" isIconOnly radius="full" onPress={playNext}>
                    <MdOutlineSkipNext size={30} className="mx-auto" />
                </Button>
                <span className="text-xs opacity-80 whitespace-nowrap hidden md:flex">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="flex items-center min-w-0 text-white">
                <Image
                    className="rounded-md hidden sm:block"
                    height={45}
                    width={45}
                    src={currentSong.cover}
                    alt=""
                />
                <div className="mx-4 min-w-0">
                    <h4 className="font-semibold truncate text-xs">{currentSong.title}</h4>
                    <div onClick={(e) => e.stopPropagation()} className="flex gap-x-2 text-xs">
                        <Link
                            href={`/channel/${currentSong.artistId}/${currentSong.artistName.toLowerCase().replace(/\s+/g, "-")}`}
                            className="opacity-85 whitespace-nowrap hover:underline"
                        >
                            {currentSong.artistName}
                        </Link>
                        <Link
                            className="opacity-85 hidden truncate sm:block hover:underline"
                            href={{
                                pathname: "/playlist",
                                query: { list: currentSong.albumId }
                            }}
                        >
                            {currentSong.albumTitle}
                        </Link>
                    </div>
                </div>
                <div className="flex items-center">
                    <Button
                        className="hidden md:block hover:bg-white/30"
                        radius="full"
                        isIconOnly
                        onPress={() => likedSong(currentSong.id)}
                    >
                        {currentSong.liked === "liked" ? <Icons.Liked size={22} className="mx-auto" /> : <Icons.Like size={22} className="mx-auto" />}
                    </Button>
                    <Button
                        className="hidden md:block hover:bg-white/30"
                        radius="full"
                        isIconOnly
                        onPress={() => dislikedSong(currentSong.id)}
                    >
                        {currentSong.liked === "disliked" ? <Icons.DisLiked size={22} className="mx-auto" /> : <Icons.Dislike size={22} className="mx-auto" />}
                    </Button>
                    <div className="relative flex items-center">
                        <Button
                            onClick={(e) => {
                                openOptions({
                                    optionKey: optionKey.optionKey,
                                    options,
                                    anchorEl: e.currentTarget as HTMLElement,
                                    direction: "top"
                                });
                            }}
                            radius="full"
                            isIconOnly
                            className="flex hover:bg-white/30"
                        >
                            <Icons.Options size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}