import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UiSong } from "@/interfaces/song.interface";

export const selectCurrentSong = createSelector(
    [
        (state: RootState) => state.songs.catalog.entities,
        (state: RootState) => state.player.currentSongId,
    ], (entites, songId) => {
        return songId ? entites[songId] : null
    }
)

export const selectQueueSongs = createSelector(
    [
        (state: RootState) => state.player.queue,
        (state: RootState) => state.songs.catalog.entities

    ], (queue, entities) => {

        const parsed = queue.map(item => {
            const song = entities[item.songId]

            if (!song) return null;

            return {
                queueId: item.queueId,
                song,
                source: item.source
            }
        }).filter(
            (item): item is {
                queueId: string; 
                song: UiSong, source: "manual" | "suggestion";
            } => item !== null
        )

        return {
            manual: parsed.filter(item => item.source === "manual"),
            suggestions: parsed.filter(item => item.source === "suggestion")
        }

    }
)

export const selectQueueSongIds = createSelector(
    [selectQueueSongs],
    (queueSongs) => queueSongs.manual.map(item => item.song.id)
);