import { Playlist } from "@/interfaces/playlist.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlaylistState {
  	playlists: Playlist[];
	pinnedPlaylists: string[];
}

const initialState: PlaylistState = {
	playlists: [],
	pinnedPlaylists: []
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        createPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.playlists.push(action.payload);
        },

		updatePlaylist: (
			state,
			action: PayloadAction<{
				playlistId: string,
				data: Partial<Pick<Playlist, "title" | "description" | "privacity">>
			}> 
		) => {

			const { playlistId, data } = action.payload;

			const playlist = state.playlists.find(pl => pl.id === playlistId)

			if (playlist) {
				Object.assign(playlist, data)
			}

		},

		addSongToPlaylist: (state, action: PayloadAction<{playlistId: string; songId: string;}>) => {
			const { playlistId, songId } = action.payload;
			
			const playlist = state.playlists.find(
				pl => pl.id === playlistId
			)

			if (!playlist) return

			if (!playlist.songIds.includes(songId)) {
				playlist.songIds.push(songId)
			}
		},

		addManySongsToPlaylist: (state, action: PayloadAction<{playlistId: string; songIds: string[];}>) => {
			const { playlistId, songIds } = action.payload;

			const playlist = state.playlists.find(
				pl => pl.id === playlistId
			)
			if (playlist) {
				playlist.songIds.push(...songIds);
			}
		},

		removePlaylist: (state, action:PayloadAction<string>) => {
			state.playlists = state.playlists.filter(playlist => playlist.id !== action.payload)
		},

		removeSongFromPlaylist: (state, action: PayloadAction<{playlistId: string; songId: string}>) => {
			const { playlistId, songId } = action.payload;

			const playlist = state.playlists.find(pl => pl.id === playlistId);
			if (!playlist) return;

			playlist.songIds = playlist.songIds.filter(song => song !== songId)
		},

		addPlaylistToPinned: (state, action: PayloadAction<string>) => {
			if (!state.pinnedPlaylists.includes(action.payload)) {
				state.pinnedPlaylists.push(action.payload)
			}
		},

		removePlaylistFromPinned: (state, action: PayloadAction<string>) => {
			state.pinnedPlaylists = state.pinnedPlaylists.filter(
				id => id !== action.payload
			)
		}
    },
});


export const { 
	createPlaylist, 
	updatePlaylist,
	removePlaylist, 
	addSongToPlaylist, 
	addManySongsToPlaylist,
	removeSongFromPlaylist,
	addPlaylistToPinned,
	removePlaylistFromPinned
} = playlistSlice.actions;

export default playlistSlice.reducer;
