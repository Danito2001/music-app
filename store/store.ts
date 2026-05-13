import { configureStore } from "@reduxjs/toolkit";
import playlistSlice from "./playlist/playlist.slice";
import songsSlice from "./songs/songs.slice";
import playerSlice from "./player/player.slice";
import toastSlice from "./toast/toast.slice";
import albumSlice from "./album/album.slice";
import artistSlice from "./artist/artist.slice";


export const store = configureStore({
 	reducer: {
    	playlist: playlistSlice,
		songs: songsSlice,
		player: playerSlice,
		toast: toastSlice,
		album: albumSlice,
		artist: artistSlice,
  	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
