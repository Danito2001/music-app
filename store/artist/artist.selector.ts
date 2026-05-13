import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";


export const selectSearchArtist = createSelector(
    [
        (state: RootState) => state.songs.currentQuery,
        (state: RootState) => state.songs.searchCache,
        (state: RootState) => state.artist.catalog.entities,
    ],
    (query, cache, artistEntities) => {

        const entry = cache[query];
        if (!entry?.artistId) return null;

        return artistEntities[entry.artistId];
    } 
);

export const selectSongsByArtistId = createSelector(
    [
        (state: RootState) => state.songs.catalog.entities,
        (_: RootState, artistId: string | null) => artistId
    ],
    (entities, artistId) => {
        return Object.values(entities).filter(
            song => song?.artistId === artistId
        );
    }
);