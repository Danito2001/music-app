import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mapAlbumToCollection, mapLikedToCollection, mapPlaylistToCollection } from "@/mapper/playlist.mapper";
import { songSelectors } from "../songs/songs.selector";
import { UiSong } from "@/interfaces/song.interface";

export const selectCollectionById = createSelector(
    [
        (state: RootState, playlistId: string | null) => playlistId,
        (state: RootState) => state.playlist.playlists,
        (state: RootState) => state.album.catalog.entities,
        (state: RootState) => state.songs.liked,
        songSelectors.selectEntities
    ],
    (playlistId, playlists, albums, likedIds, entities) => {

        if (!playlistId) return null;
        
        const playlist = playlists.find(p => p.id === playlistId);
        const album = albums[playlistId];

        if (playlistId === "LM") return mapLikedToCollection(likedIds);
    
        if (album) return mapAlbumToCollection(album)

        if (playlist) return mapPlaylistToCollection(playlist, entities)

        return null;
    }
);

const EMPTY_ARRAY: UiSong[] = []

export const selectPlaylistSongs = createSelector(
    [
        (state:RootState) => state.playlist?.playlists,
        (state:RootState) => state.songs?.catalog?.entities,
        (_:RootState, playlistId: string | null) => playlistId,
        
    ], (playlists, allSongsEntities, playlistId): UiSong[] => {
        
        if (!playlistId) return EMPTY_ARRAY;
        
        const playlist = playlists.find((pl) => pl.id === playlistId);
        if (!playlist) return EMPTY_ARRAY;

        return playlist.songIds
            .map((id) => allSongsEntities[id])
            .filter((song): song is UiSong => Boolean(song))
    }
);