import { UiAlbum } from "@/interfaces/playlist.interface";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";


interface AlbumState {
    catalog: EntityState<UiAlbum, string>;
    topTracks: Record<string, string[]>;
    liked: string[],
}

export const albumAdapter = createEntityAdapter<UiAlbum>();

const initialState: AlbumState = {
    catalog: albumAdapter.getInitialState(),
    topTracks: {},
    liked: []
}

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        upsertManyAlbums: (state, action:PayloadAction<UiAlbum[]>) => {
            albumAdapter.upsertMany(state.catalog, action.payload)
        },

        upsertOneAlbum: (state, action:PayloadAction<UiAlbum>) => {
            albumAdapter.upsertOne(state.catalog, action.payload)
        },

        setAlbumSongs: (state, action:PayloadAction<{albumId: string, songIds: string[] }>) => {
            const { albumId, songIds } = action.payload;

            const album = state.catalog.entities[albumId]
            if (album) {
                album.songIds = songIds
            }
        },

        setTopTracks: (state, action:PayloadAction<{artistId: string, ids: string[]}>) => {
            state.topTracks[action.payload.artistId] = action.payload.ids
        }
    }
})

export const { upsertManyAlbums, setAlbumSongs, setTopTracks, upsertOneAlbum } = albumSlice.actions;
export default albumSlice.reducer;
