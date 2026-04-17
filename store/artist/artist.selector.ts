import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { artistAdapter } from "./artist.slice";

export const artistSelector = artistAdapter.getSelectors(
    (state: RootState) => state.artist.catalog
);

export const selectArtistById = (state:RootState, playlistId:string) => artistSelector.selectById(state, playlistId)


export const selectRelatedArtistByArtistId = (artistId:string) => createSelector(

    (state:RootState) => state,
    (state) => {
        
        const artist = selectArtistById(state, artistId)
        if (!artist?.relatedArtist) return [];

        return artist.relatedArtist.map(id => selectArtistById(state, id)).filter(Boolean);
    }
)

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

export const selectTopTracksByArtist = (artistId: string) => createSelector(
    [
        (state: RootState) => state.songs.catalog.entities,
        (state: RootState) => state.album.topTracks[artistId]
    ], (entities, tracks) => {

        if (!tracks) return [];

        return tracks.map(id => entities[id]).filter(Boolean)
    }
)