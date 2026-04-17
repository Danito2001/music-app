import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { mapAlbumToCollection, mapLikedToCollection, mapPlaylistToCollection } from "@/mapper/playlist.mapper";
import { songSelectors } from "../songs/songs.selector";

export const selectCollectionById = createSelector(
    [
        (state: RootState, playlistId: string) => playlistId,
        (state: RootState) => state.playlist.playlists,
        (state: RootState) => state.album.catalog.entities,
        (state: RootState) => state.songs.liked,
        songSelectors.selectEntities
    ],
    (playlistId, playlists, albums, likedIds, entities) => {

        if (!playlistId) return;

        if (playlistId === "LM") return mapLikedToCollection(likedIds);
        
        const playlist = playlists.find(p => p.id === playlistId);
        const album = albums[playlistId];

        if (playlist) return mapPlaylistToCollection(playlist, entities)
        
        if (album) return mapAlbumToCollection(album)
        
        return null;
    }
);

export const selectPlaylistSongIds = (playlistId: string) =>
    createSelector(
        [
            (state:RootState) => state.playlist.playlists,
        ],
        (playlists) => {
            const playlist = playlists.find(pl => pl.id === playlistId);
            return playlist ? playlist.songIds : [];
        }
    );

export const selectPlaylistSongs = (playlistId: string) =>
    createSelector(
        [
            (state:RootState) => state.playlist.playlists,
            (state:RootState) => state.songs.catalog.entities,
            
        ], (playlists, allSongsEntities) => {
            
            if (!playlistId) return [];
            
            const playlist = playlists.find((pl) => pl.id === playlistId);
            if (!playlist) return [];

            return playlist.songIds
                .map((id) => allSongsEntities[id])
                .filter(Boolean);
        }
);

export const selectPlaylistSuggestionSong = createSelector(
    [
        (state:RootState) => state.songs.playlistSuggestions.ids,
        (state:RootState) => state.songs.catalog.entities
    ], (ids, entities) => {

        return ids.map(id => entities[id]).filter(Boolean)
    }
)