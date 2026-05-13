import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { catalogAdapter } from "./songs.slice";
import { SourceType, GetSongIdsFn } from "@/interfaces/collection.interface";
import { UiSong } from "@/interfaces/song.interface";


export const songSelectors = catalogAdapter.getSelectors(
    (state: RootState) => state.songs.catalog
)

export const selectSuggestions = createSelector(
   [
      (state: RootState) => state.songs.suggestions.global,
      (state: RootState) => state.playlist.suggestions,
      (state: RootState) => state.songs.catalog.entities,
      (_: RootState, source?: "global" | "playlist") => source ?? "global",
      (_: RootState, _source: string, playlistId?: string | null) => playlistId,
    ],
    (global, playlist, entities, source, playlistId) => {

        let ids: string[] = [];

        if (source === "playlist") {
            const playlistIds = playlistId
                ? playlist[playlistId]
                : undefined;

            if (playlistIds && playlistIds.length > 0) {
                ids = playlistIds;
            } else {
                ids = global ?? [];
            }
                
        } else {
            ids = global ?? [];
        }

        return ids?.map(id => entities[id]).filter(Boolean)
    }
);

export const selectHistorySong = createSelector(
    [
        (state:RootState) => state.songs.history,
        (state:RootState) => state.songs.catalog.entities,
    ], (ids, entities) => {
        return ids.map(id => entities[id]).filter(Boolean)
    }
)

export const selectPinnedItems = createSelector(
    [
        (state:RootState) => state.songs.pinned,
        (state:RootState) => state.playlist.pinnedPlaylists,
        (state:RootState) => state.songs.catalog.entities,
        (state:RootState) => state.playlist.playlists,
    ], (songIds, playlistIds, entities, allPlaylist) => {

        const songs = songIds.map(id => entities[id]).filter(Boolean)
        const playlists = allPlaylist.filter(pl => playlistIds.includes(pl.id))

        return {
            songs,
            playlists
        }
    }
)

export const selectPinnedSongs = createSelector(
    [
        (state:RootState) => state.songs.pinned,
        (state:RootState) => state.songs.catalog.entities,
    ], (songIds, entities) => songIds.map(id => entities[id]).filter(Boolean)
)

export const selectIsSongPinned = createSelector(
    [
        (_:RootState, songId: string) => songId,
        (state:RootState) =>  state.songs.pinned
    ], (songId, pinned) => pinned.includes(songId)
)

export const selectLikedSong = createSelector(
    [
        (state:RootState) => state.songs.liked,
        (state:RootState) => state.songs.catalog.entities,
    ], (ids, entities) => {
        return ids.map(id => entities[id]).filter(Boolean)
    }
)

export const selectCurrentPinned = createSelector(
    [
        (state:RootState) => state.songs.pinned,
        (state:RootState) => state.player.currentSongId,
    ], (ids, songId) => {
        return songId ? ids.includes(songId) : false 
    }
)

const EMPTY_ARRAY: string[] = [];

export const selectSearchSong = createSelector(
    [
        (state:RootState) => state.songs.currentQuery,
        (state:RootState) => state.songs.searchCache,
        (state:RootState) => state.songs.catalog.entities,
    ], (query, cache, entities): UiSong[] => {
        const entry = cache[query]

        if (!entry) return EMPTY_ARRAY as unknown as UiSong[];

        return entry.songIds.map(id => entities[id])
    }
)

export const getSongIdsBySource: Record<SourceType, GetSongIdsFn> = {

    playlist: (state: RootState, id: string) => {
        const playlist = state.playlist.playlists.find(pl => pl.id === id)
        if (!playlist) return EMPTY_ARRAY

        return playlist?.songIds ?? EMPTY_ARRAY
    },

    album: (state: RootState, id: string) => {
        const album = state.album.catalog.entities[id]
        return album?.songIds ?? EMPTY_ARRAY
    },

    liked: (state) => state.songs.liked ?? EMPTY_ARRAY

}