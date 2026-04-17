import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { catalogAdapter } from "./songsSlice";
import { useSelector } from "react-redux";
import { SourceType, GetSongIdsFn } from "@/interfaces/collection.interface";


export const songSelectors = catalogAdapter.getSelectors(
    (state: RootState) => state.songs.catalog
)

export const selectGlobalSuggestionSong = createSelector(
    [
        (state:RootState) => state.songs.globalSuggestions,
        (state:RootState) => state.songs.catalog.entities
    ], (ids, entities) => {

        return ids.map(id => entities[id]).filter(Boolean)
    }
)

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

export const selectReplaySong = createSelector(
    [
        (state:RootState) => state.songs.pinned,
        (state:RootState) => state.songs.catalog.entities,
    ], (ids, entities) => {

        const pinned = ids.map(id => entities[id])
        const history = useSelector(selectHistorySong)
        const liked = useSelector(selectLikedSong)

        if (pinned.length > 0) return pinned
        if (history.length > 0) return history.slice(0,9)
        if (liked.length > 0) return history.slice(0,9)

        return [];

    }
)


export const selectSearchSong = createSelector(
    [
        (state:RootState) => state.songs.currentQuery,
        (state:RootState) => state.songs.searchCache,
        (state:RootState) => state.songs.catalog.entities,
    ], (query, cache, entities) => {
        const entry = cache[query]

        if (!entry) return [];

        return entry.songIds.map(id => entities[id])
    }
)

export const getSongIdsBySource: Record<SourceType, GetSongIdsFn> = {

    playlist: (state: RootState, id: string) => {
        const playlist = state.playlist.playlists.find(pl => pl.id === id)
        if (!playlist) return []

        return playlist?.songIds ?? [] 
    },

    album: (state: RootState, id: string) => {
        const album = state.album.catalog.entities[id]
        return album?.songIds ?? []
    },

    liked: (state) => state.songs.liked ?? []

}