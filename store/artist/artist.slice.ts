import { UiArtist } from "@/interfaces/song.interface";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";


interface ArtistState {
    catalog: EntityState<UiArtist, string>;
    relatedArtist: string[]
}

export const artistAdapter = createEntityAdapter<UiArtist>();

const initialState: ArtistState = {
    catalog: artistAdapter.getInitialState(),
    relatedArtist: []
}

const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {
        upsertManyArtist: (state, action:PayloadAction<UiArtist[]>) => {
            artistAdapter.addMany(state.catalog, action.payload)
        },
        upsertOneArtist: (state, action:PayloadAction<UiArtist>) => {
            artistAdapter.addOne(state.catalog, action.payload)
        },
    }
})

export const { upsertManyArtist, upsertOneArtist } = artistSlice.actions;
export default artistSlice.reducer;
