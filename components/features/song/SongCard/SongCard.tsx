"use client";

import SongRowSuggestion from "../SongRowSuggestion/SongRowSuggestion";
import { SongLargeView } from "../SongLargeView";
import { useSongOptions } from "@/hooks/features/song/useSongOptions";
import { OptionKeyResult, PlayType, ViewCard } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";
import { CollectionType } from "@/hooks/features/playlist/useCollectionType";

type CardProps = {
    song: UiSong;
    view: ViewCard;
    optionKey: OptionKeyResult;
    playlistId: string | null;
    mode?: PlayType;
    source?: CollectionType;
    queueId?: string;
    isPinned?: boolean;
}

export default function SongCard({
    song,
    view,
    playlistId,
    queueId,
    source,
    mode,
    isPinned,
    optionKey
}: CardProps) {

    const { currentSongId, options } = useSongOptions({
        song,
        source,
        playlistId,
        queueId
    });

    if (view !== "large") {
        return (
            <SongRowSuggestion
                song={song}
                options={options}
                playlistId={playlistId}
                currentSongId={currentSongId}
                view={view}
                source={source}
                mode={mode}
                optionKey={optionKey}
            />
        );
    }

    if (mode) {
        return (
            <SongLargeView
                song={song}
                options={options}
                currentSongId={currentSongId}
                isPinned={isPinned}
                mode={mode}
                optionKey={optionKey}
            />
        );
    }
}