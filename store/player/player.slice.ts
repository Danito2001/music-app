import { PlaybackSource } from "@/interfaces/common.interface";
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";


interface QueueItem {
  	queueId: string;
  	songId: string;
	source: "manual" | "suggestion";
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
	currentSource: PlaybackSource;
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
	queue: [],
	currentSource: null
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
		setSuggestionsQueue: (state, action:PayloadAction<string[]>) => {
			const existingIds = new Set(
				state.queue.map(q => q.songId)
			)

			action.payload.forEach((id) => {

				if (existingIds.has(id)) return;

				state.queue.push({
					queueId: nanoid(),
					songId: id,
					source: "suggestion"
				})
				existingIds.add(id)
			})
		},

		addSongToQueue: (state, action:PayloadAction<string>) => {
			state.queue.push({
				queueId: nanoid(),
 				songId: action.payload,
				source: "manual"
			})
		},

		addPlaylistToQueue: (state, action:PayloadAction<string[]>) => {
			action.payload.forEach(songId => {
				state.queue.push({
					queueId: nanoid(),
					songId,
					source: "manual"
				})
			})
		},

		insertSongToQueue: (state, action:PayloadAction<{ songId: string, index: number }>) => {

			state.queue.splice(action.payload.index, 0, {
				queueId: nanoid(),
				songId: action.payload.songId,
				source: "manual"
			})
		},

		shuffleQueue: (state, action:PayloadAction<QueueItem[]>) => {
			state.queue = action.payload
		},

		setChangeSource: (state, action:PayloadAction<string>) => {
			const song = state.queue.find(s => s.songId === action.payload)

			if (song) {
				song.source = "manual";
			}
		},

		removeSongFromQueue: (state, action:PayloadAction<string>) => {
			state.queue = state.queue.filter(
				({queueId}) => queueId !== action.payload
			)
		},

		clearQueue: (state) => {
			state.queue = []
		},

		setPlaybackSource: (state, action:PayloadAction<PlaybackSource>) => {
			state.currentSource = action.payload
		}

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
	setSuggestionsQueue,
	addSongToQueue,
	addPlaylistToQueue,
	removeSongFromQueue,
	setChangeSource,
	insertSongToQueue,
	shuffleQueue,
	clearQueue,
	setPlaybackSource
} = playerSlice.actions;
export default playerSlice.reducer;
