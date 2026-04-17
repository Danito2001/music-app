    import { createSelector } from "@reduxjs/toolkit";
import { albumAdapter } from "./albumSlice";
import { RootState } from "../store";

export const albumSelector = albumAdapter.getSelectors(
    (state: RootState) => state.album.catalog
);

export const selectAlbumsByArtist = createSelector(
    [
        albumSelector.selectAll,
        (_:RootState, artistId: string) => artistId
    ],
    (albums, artistId) =>
        albums.filter(album => album.artistId === artistId)
)

export const selectAlbumSongIdsById = createSelector(
    [
        (state: RootState, albumId: string) =>
            albumSelector.selectById(state, albumId)
    ],
        album => album.songIds
)

export const selectTracksForAlbum = createSelector(
    [
        (state: RootState, albumId: string) => state.album.catalog.entities[albumId]?.songIds || [],
        (state: RootState) => state.songs.catalog.entities
    ], (ids, entities) => ids.map(id => entities[id]).filter(Boolean)
)

export const selectAlbumSongIds = (albumId: string, state: RootState) => {
    return state.album.catalog.entities[albumId].songIds
}