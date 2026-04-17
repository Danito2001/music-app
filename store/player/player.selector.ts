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

    ], (queue, entities) => 
        queue.map(item => {
            const song = entities[item.songId]
            if (!song) return null;

            return {
                queueId: item.queueId,
                song
            }
        }).filter(
            (item): item is { queueId: string; song: UiSong } => item !== null
        )
)