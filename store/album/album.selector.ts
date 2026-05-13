import { createSelector } from "@reduxjs/toolkit";
import { albumAdapter } from "./album.slice";
import { RootState } from "../store";
import { UiSong } from "@/interfaces/song.interface";

export const albumSelector = albumAdapter.getSelectors(
    (state: RootState) => state.album.catalog
);

export const selectAlbumSongIdsById = createSelector(
    [
        (state: RootState, albumId: string) =>
            albumSelector.selectById(state, albumId)
    ],
        album => album.songIds
)

const EMPTY_ARRAY: string[] = [];

export const selectTracksForAlbum = createSelector(
    [
        (state: RootState) => state.album.catalog.entities,
        (state: RootState) => state.songs.catalog.entities,
        (_: RootState, albumId: string | null) => albumId
    ],
    (albums, songs, albumId): UiSong[] => {
        if (!albumId) return [];

        const songIds = albums[albumId]?.songIds ?? [];

        return songIds
            .map(id => songs[id])
            .filter(Boolean);
    }
);

export const selectAlbumSongIds = createSelector(
    [
        (state: RootState) => state.album.catalog.entities,
        (_: RootState, albumId: string) => albumId
    ],
    (entities, albumId) => {
        return entities[albumId]?.songIds ?? EMPTY_ARRAY;
    }
);