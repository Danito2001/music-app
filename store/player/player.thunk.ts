import { AppDispatch, RootState } from "../store";
import { addSongToHistory, removeFromPlaylistSuggestions } from "../songs/songsSlice";

import { startPlaylistPlayback } from "@/helpers/startPlaylistPlayback";
import { getSongIdsBySource, songSelectors } from "../songs/songs.selector";
import { addPlaylistToQueue, addSongToQueue, clearQueue, insertSongToQueue, play, removeSongFromQueue, setCurrentSong, setSeekTo, shuffleQueue } from "./playerSlice";
import { selectAlbumSongIdsById } from "../album/album.selector";
import { fetchSuggestions } from "../songs/songs.thunk";
import { getPlaylistSongIds } from "@/helpers/getPlaylistSongIds";
import { selectQueueSongs } from "./player.selector";
import { shuffle } from "@/helpers/shuffle";
import { SourceType } from "@/interfaces/collection.interface";
import { PlayType } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";


export const playRandomSongFromSource = (songId: string, playlistId: string, type: SourceType) =>
  	(dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		startPlaylistPlayback(dispatch, songId, playlistId, state, type)
	};

export const playRandomSongFromPlaylist = (playlistId: string, type: SourceType) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState()

		const songIds = getSongIdsBySource[type](state, playlistId)

		const availableSongs = songIds.filter(s => s !== state.player.currentSongId)

		if (availableSongs.length === 0) return

		const randomSongId = availableSongs[Math.floor(Math.random() * availableSongs.length)]

		dispatch(playRandomSongFromSource(randomSongId, playlistId, type))
}

export const playFirstSongFromPlaylist = (playlistId: string, type: SourceType) => 
	(dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();
		const songIds = getSongIdsBySource[type](state, playlistId);

		const firstSongId = songIds.at(0);

		if (!firstSongId) return;

		startPlaylistPlayback(dispatch, firstSongId, playlistId, state, type)
} 

export const playSongSmart = (songId: string, type:PlayType, playlistId?: string) => 
	(dispatch: AppDispatch, getState: () => RootState) => {

		dispatch(addSongToHistory(songId))
		const state = getState();

		const actions: Record<PlayType, () => void> = {

			queue: () => dispatch(setCurrentSong(songId)),

			album: () => {
				if (!playlistId) return console.log(playlistId);
				const songIds = selectAlbumSongIdsById(state, playlistId)
				
				dispatch(playAlbum(songId, songIds));
			},

			liked: () => {	
				dispatch(playLiked(songId))
			},

			playlist: () => {
				if (!playlistId) return;
				dispatch(playRandomSongFromSource(songId, playlistId, "playlist"))
			},

			"suggestion-standalone": () => {
        		dispatch(playStandaloneSong(songId));
      		},

			"suggestion-queue": () => {
				dispatch(playSuggestionSong(songId));
			},
		}

		const action = actions[type]

		if (!action) {
			console.warn("PlayType inválido:", type)
			return
		}

		action()
		dispatch(play())
	}

export const playStandaloneSong =
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const currentSong = songSelectors.selectById(state, songId)
		if (!currentSong) return;

		dispatch(clearQueue());
		dispatch(setCurrentSong(songId));
		dispatch(addSongToQueue(songId));
		dispatch(fetchSuggestions(currentSong.artistId));
	};

export const playSuggestionSong = 
	(songId: string) => (dispatch: AppDispatch) => {
    	dispatch(removeFromPlaylistSuggestions(songId));
		dispatch(setCurrentSong(songId));
		dispatch(addSongToQueue(songId));
	};



export const playLiked = 
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();
		const likedIds = state.songs.liked;
		const allSongs = songSelectors.selectAll(state);
		const currentSong = allSongs.find(s => s.id === songId);

		if (!currentSong) return;

		dispatch(clearQueue())
		dispatch(setCurrentSong(songId))
		dispatch(addPlaylistToQueue(likedIds))
		dispatch(fetchSuggestions(currentSong.artistId));
}


export const playNextSong =
	() => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const queue = state.player.queue.map((q) => q.songId);
		const { currentSongId, repeat } = state.player;

		const index = queue.findIndex((id) => id === currentSongId);
		if (index === -1) return;

		let nextIndex = index + 1;

		if (nextIndex >= queue.length) {
			const nextSuggestion = state.songs.playlistSuggestions.ids[0]
			dispatch(playSuggestionSong(nextSuggestion))
		}

		if (nextIndex >= queue.length) {
			if (!repeat) return;
			nextIndex = 0;
		}

		dispatch(setCurrentSong(queue[nextIndex]));
	};

export const playPrevSong = (currentTime: number) => (dispatch: AppDispatch, getState: () => RootState) => {

	const state = getState();

	const queue = state.player.queue.map((q) => q.songId);
	const { currentSongId } = state.player;

	const index = queue.findIndex((id) => id === currentSongId);
	if (index === -1) return;

	if (currentTime > 3 || index === 0) {
		dispatch(setSeekTo(0))
		return;
	}

	const prevSong = queue[index - 1];
	if (!prevSong) return;

	dispatch(setCurrentSong(prevSong));
};

export const playRandomTrack = (tracks: UiSong[]) => (dispatch: AppDispatch) => {
    if (!tracks.length) return;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomId = tracks[randomIndex].id;

    dispatch(playSongSmart(randomId, "suggestion-standalone"));
};

export const addSongToPlayNext =
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const currentSongId = state.player.currentSongId;
		const queue = state.player.queue.map((q) => q.songId);

		if (!currentSongId) {
			dispatch(addSongToQueue(songId));
			return;
		}

		const index = queue.findIndex((id) => id === currentSongId);

		if (index === -1) {
			dispatch(addSongToQueue(songId));
			return;
		}

		dispatch(insertSongToQueue({
			index: index + 1,
			songId,
		}));
	};


export const removeSongFromQueueThunk =
	(queueId: string, songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

		const currentSongId = getState().player.currentSongId;

		dispatch(removeSongFromQueue(queueId));

		if (currentSongId === songId) dispatch(playNextSong());
	};

export const addPlaylistToQueueEnd = 
    (playlistId: string) => 
    (dispatch: AppDispatch, getState: () => RootState) => {

        const state = getState();
        const songIds = getPlaylistSongIds(playlistId, state)

        if (songIds.length === 0) return;

        dispatch(addPlaylistToQueue(songIds))
}

export const shuffledQueue = () => (dispatch: AppDispatch, getState: () => RootState) => {

    const state = getState();
    const songIds = selectQueueSongs(state)

    if (songIds.length === 0) return;

    const shuffled = shuffle(songIds.map(q => q.song.id))

    dispatch(shuffleQueue(shuffled))
}

export const playAlbum = (songId: string, songIds: string[]) => (dispatch: AppDispatch) => {
    dispatch(clearQueue())
    dispatch(setCurrentSong(songId))
    dispatch(addPlaylistToQueue(songIds))
}