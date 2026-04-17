"use client";

import SongRowSuggestion from "../SongRowSuggestion/SongRowSuggestion";
import { SongLargeView } from "../SongLargeView";
import { useSongOptions } from "@/hooks/features/song/useSongOptions";
import { OptionKeyResult, PlayType, ViewCard } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";

type CardProps = {
    song: UiSong;
    view: ViewCard;
    mode: PlayType;
    queueId?: string;
    playlistId?: string;
    isPinned?: boolean;
    optionKey: OptionKeyResult;
}

export default function SongCard({
    song,
    view,
    playlistId,
    queueId,
    mode,
    isPinned,
    optionKey
}: CardProps) {

    const { currentSongId, options } = useSongOptions({
        song,
        mode,
        playlistId,
        queueId
    });

    return (
        <>
            {view !== "large" ? (
                <SongRowSuggestion
                    song={song}
                    options={options}           
                    playlistId={playlistId}
                    currentSongId={currentSongId}
                    view={view}
                    mode={mode}
                    optionKey={optionKey}
                />
            ) : (
                <SongLargeView
                    song={song}
                    options={options}
                    currentSongId={currentSongId}
                    isPinned={isPinned}
                    mode={mode}
                    optionKey={optionKey}
                />
            )}
        </>
    )
}