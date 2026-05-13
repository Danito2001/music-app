import { UiSong } from "@/interfaces/song.interface";
import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";

type SearchEntry = {
	songIds: string[],
	artistId: string
}

interface SongsState {
	catalog: EntityState<UiSong, string>

	pinned: string[];
	liked: string[];
	history: string[];
	suggestions: {
		global: string[];
		loading: boolean;
	}
	currentQuery: string;
	searchCache: Record<string, SearchEntry>
}

export const catalogAdapter = createEntityAdapter<UiSong>();

const catalogInitialState  = catalogAdapter.getInitialState()

const songsInitialState: SongsState = {
	catalog: catalogInitialState,
	pinned: [],
	liked: [],
	history: [],
	suggestions: {
		global: [],
		loading: false
	},
	currentQuery: "",
	searchCache: {}
};

const songsSlice = createSlice({
	name: "songs",
	initialState: songsInitialState,
	reducers: {

		// Pinned
		addSongToPinned: (state, action:PayloadAction<string>) => {
			if (!state.pinned.includes(action.payload)) {
				state.pinned.push(action.payload)
			}
		},

		removeSongFromPinned: (state, action:PayloadAction<string>) => {
			state.pinned = state.pinned.filter(songId => songId !== action.payload)
		},

		

		// Liked
		addSongToLiked: (state, action:PayloadAction<string>) => {
			if (!state.liked.includes(action.payload)) {
				state.liked.push(action.payload)
			}		
		},

		toggleLike: (state, action:PayloadAction<string>) => {
			const song = state.catalog.entities[action.payload]

			if (song) {
				song.liked = song.liked === "liked" ? "neutral" : "liked"
			}
		},

		toggleDislike: (state, action:PayloadAction<string>) => {
			const song = state.catalog.entities[action.payload]

			if (song) {
				song.liked = song.liked === "disliked" ? "neutral" : "disliked"
			}
		},

		removeSongFromLiked: (state, action:PayloadAction<string>) => {
			state.liked = state.liked.filter(
				songId => songId !== action.payload
			)
		},

		// History
		addSongToHistory: (state, action:PayloadAction<string>) => {

			if (!state.history.includes(action.payload)) {
				state.history.push(action.payload)
			}

		},

		// Suggestions
		setGlobalSuggestions: (state, action: PayloadAction<string[]>) => {

			state.suggestions.global = action.payload;
		},

		removeFromGlobalSuggestions: (state, action: PayloadAction<string>) => {
			state.suggestions.global = state.suggestions.global.filter(
				id => id !== action.payload
			)
		},

		setLoading: (state, action: PayloadAction<boolean>) => {
            state.suggestions.loading = action.payload;
        },

		
		upsertManyToCatalog: (state, action:PayloadAction<UiSong[]>) => {
			catalogAdapter.upsertMany(state.catalog, action.payload)
		},

		setCurrentQuery: (state, action:PayloadAction<string>) => {
			state.currentQuery = action.payload
		},

		saveSearchCache: (state, action:PayloadAction<{query: string, ids: string[], artistId: string}>) => {

			const { query, ids, artistId } = action.payload;

			state.searchCache[query] = {songIds: ids, artistId: artistId}
		}

	}
})

export const { 
	addSongToLiked,
	removeSongFromLiked,
	toggleLike,
	toggleDislike,
	addSongToHistory,

	setGlobalSuggestions,
	removeFromGlobalSuggestions,
	setLoading,

	addSongToPinned,
	removeSongFromPinned,

	setCurrentQuery,
	upsertManyToCatalog,
	saveSearchCache
} = songsSlice.actions;
export default songsSlice.reducer;
