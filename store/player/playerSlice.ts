import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

interface QueueItem {
  queueId: string;
  songId: string;
}

interface PlayerState {
	currentSongId: string | null;
	isPlaying: boolean;
	shuffle: boolean;
	repeat: boolean;
	seekTo: number | null;
	volume: number;
	currentTime: number;
	duration: number;
	queue: QueueItem[];
}

const initialState: PlayerState = {
	currentSongId: null,
	isPlaying: false,
	shuffle: false,
	repeat: false,
	seekTo: null,
	volume: 0.4,
	currentTime: 0,
	duration: 0,
	queue: []
};

const playerSlice = createSlice({
	name: "player",
	initialState,
	reducers: {

		play: (state) => {
			state.isPlaying = true;
		},

		pause: (state) => {
			state.isPlaying = false;
		},

		stop: (state) => {
			state.isPlaying = false;
			state.currentSongId = null;
			state.currentTime = 0;
		},

		setSeekTo: (state, action: PayloadAction<number | null>) => {
			state.seekTo = action.payload;
		},

		toggleShuffle: (state) => {
			state.shuffle = !state.shuffle
		},

		setRepeatMode: (state, action:PayloadAction<boolean>) => {
			state.repeat = action.payload;
		},

		setCurrentSong: (state, action:PayloadAction<string | null>) => {
			state.currentSongId = action.payload;
		},

		setVolume: (state, action:PayloadAction<number>) => {
			state.volume = Math.max(0, Math.min(1, action.payload))
		},

		setCurrentTime: (state, action:PayloadAction<number>) => {
			state.currentTime = action.payload;
		},

		setDuration: (state, action: PayloadAction<number>) => {
			state.duration = action.payload;
		},

		// Queue
		addSongToQueue: (state, action:PayloadAction<string>) => {
			state.queue.push({
				queueId: nanoid(),
 				songId: action.payload
			})
		},

		addPlaylistToQueue: (state, action:PayloadAction<string[]>) => {
			action.payload.forEach(songId => {
				state.queue.push({
					queueId: nanoid(),
					songId
				})
			})
		},

		insertSongToQueue: (state, action:PayloadAction<{ songId: string, index: number }>) => {

			state.queue.splice(action.payload.index, 0, {
				queueId: nanoid(),
				songId: action.payload.songId
			})
		},

		shuffleQueue: (state, action:PayloadAction<string[]>) => {
			const map = new Map(
				state.queue.map(item => [item.songId, item])
			)

			state.queue = action.payload
				.map(songId => map.get(songId))
				.filter((item): item is QueueItem => Boolean(item))
		},

		removeSongFromQueue: (state, action:PayloadAction<string>) => {
			state.queue = state.queue.filter(
				({queueId}) => queueId !== action.payload
			)
		},

		clearQueue: (state) => {
			state.queue = []
		},

	},
});

export const {
	play,
	pause,
	stop,
	setSeekTo,
	toggleShuffle,
	setRepeatMode,
	setCurrentSong,
	setVolume,
	setCurrentTime,
	setDuration,
	addSongToQueue,
	addPlaylistToQueue,
	removeSongFromQueue,
	insertSongToQueue,
	shuffleQueue,
	clearQueue
} = playerSlice.actions;
export default playerSlice.reducer;
