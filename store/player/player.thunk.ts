import { AppDispatch, RootState } from "../store";
import { addSongToHistory } from "../songs/songs.slice";

import { startPlaylistPlayback } from "@/helpers/startPlaylistPlayback";
import { getSongIdsBySource, songSelectors } from "../songs/songs.selector";
import { addPlaylistToQueue, addSongToQueue, clearQueue, insertSongToQueue, play, removeSongFromQueue, setChangeSource, setCurrentSong, setPlaybackSource, setSeekTo, shuffleQueue } from "./player.slice";
import { selectAlbumSongIdsById } from "../album/album.selector";
import { loadSuggestionsForSource } from "../songs/songs.thunk";
import { getPlaylistSongIds } from "@/helpers/getPlaylistSongIds";
import { shuffle } from "@/helpers/shuffle";
import { SourceType } from "@/interfaces/collection.interface";
import { PlayType } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";
import { CollectionType } from "@/hooks/features/playlist/useCollectionType";
import { selectSongsByArtistId } from "../artist/artist.selector";


export const playRandomSongFromSource = (songId: string, playlistId: string, type: SourceType) =>
  	(dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		startPlaylistPlayback(dispatch, songId, playlistId, state, type)

		const currentSong = songSelectors.selectById(state, songId)

		if ( type === "playlist" ) {
			dispatch(loadSuggestionsForSource(currentSong.artistId, {
        		source: "queue",
      		}))
		} 
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

export const playSongSmart = (songId: string, id: string | null, mode?: PlayType, source?: CollectionType) => 
	(dispatch: AppDispatch, getState: () => RootState) => {

		dispatch(addSongToHistory(songId))
		const state = getState();

		let shouldPlay = false

		if (mode) {
			switch (mode) {
				case "queue":
					dispatch(setCurrentSong(songId));
					shouldPlay = true;
					break;
				case "suggestion-queue":
					dispatch(playSuggestionSong(songId));
					shouldPlay = true;
					break;
				case "suggestion-standalone":
					dispatch(playStandaloneSong(songId));
					shouldPlay = true;
					break;
			}

		} else {

			switch (source) {
				case "album": {
					if (!id) return;
					const songIds = selectAlbumSongIdsById(state, id);
					dispatch(playAlbum(songId, songIds, id));
					shouldPlay = true;
					break;
				}

				case "playlist": {
					if (!id) return;
					dispatch(playRandomSongFromSource(songId, id, "playlist"));
					shouldPlay = true;
					break;
				}

				case "liked": {
					dispatch(playLiked(songId));
					shouldPlay = true;
					break;
				}
	
				case "artist": {
					if (!id) return;
					dispatch(playArtistSongs(songId, id))
					shouldPlay = true;
					break
				}
	
				default:
					break;
			}
		}
		
		if (shouldPlay) {
			dispatch(play());
		}	
	}

	

export const playStandaloneSong =
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const currentSong = songSelectors.selectById(state, songId)
		if (!currentSong) return;

		dispatch(clearQueue());
		dispatch(setCurrentSong(songId));
		dispatch(addSongToQueue(songId));
		dispatch(loadSuggestionsForSource(currentSong.artistId, {source: "queue"}))
	};

export const playSuggestionSong = 
	(songId: string) => (dispatch: AppDispatch) => {
		dispatch(setChangeSource(songId));
		dispatch(setCurrentSong(songId));
	};

export const addToManualQueue = 
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const alreadyManual = state.player.queue.some(
			s => s.source === "manual" && s.songId === songId
		)

		if (alreadyManual) return { added: 0 }

		const suggestionQueueSong = state.player.queue.find(
      		s => s.source === "suggestion" && s.songId === songId
    	);

		if (suggestionQueueSong) {
			dispatch(removeSongFromQueue(suggestionQueueSong.queueId))
		}

		const lastManualIndex = 
			state.player.queue.findLastIndex(s => s.source === "manual")

		const insertIndex = lastManualIndex === undefined ? 0 : lastManualIndex + 1

		dispatch(insertSongToQueue({
			index: insertIndex,
			songId
		}))

		return { added: 1 }
	}


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
		dispatch(loadSuggestionsForSource(currentSong.artistId, {
        	source: "queue",
      	}))
}

export const playArtistSongs = 
	(songId: string, artistId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();
		const songsIds = selectSongsByArtistId(state, artistId).map(song => song.id)

		dispatch(clearQueue())
		dispatch(setCurrentSong(songId))
		dispatch(addPlaylistToQueue(songsIds))
	}


export const playNextSong =
	() => (dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();

		const queue = state.player.queue;
		const currentSongId = state.player.currentSongId;

		const index = queue.findIndex(
			(q) => q.songId === currentSongId
		);

		if (index === -1) return;

		const next = queue[index + 1];

		if (next) {

			if (next.source === "suggestion") {
				dispatch(setChangeSource(next.songId));
			}

			dispatch(setCurrentSong(next.songId));
			return;
		}	

		dispatch(setCurrentSong(queue[0].songId));
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

    dispatch(playSongSmart(randomId, null, "suggestion-standalone"));
};

export const addSongToPlayNext =
	(songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();

		const currentSongId = state.player.currentSongId;
		const queue = state.player.queue.map((q) => q.songId);

		const alreadyManual = state.player.queue.some(
			s => s.source === "manual" && s.songId === songId
		)

		if (alreadyManual) return;

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

export const addPlaylistQueueThunk = 
    (playlistId: string) => 
    (dispatch: AppDispatch, getState: () => RootState) => {

        const state = getState();

        const songIds = getPlaylistSongIds(playlistId, state)

		if (songIds.length === 0) return {
			added: 0,
			skipped: 0
		};

		const existingSongIds = new Set(
			state.player.queue.filter(s => s.source === "manual")
			.map(s => s.songId)
		)

		const filteredSongs = songIds.filter(
			id => !existingSongIds.has(id)
		)

		if (filteredSongs.length === 0) return {
			added: 0,
			skipped: 0
		};

		const lastManualIndex = 
			state.player.queue.findLastIndex(s => s.source === "manual")

		const insertIndex = lastManualIndex === undefined ? 0 : lastManualIndex + 1

		dispatch(insertSongToQueue({
			index: insertIndex,
			songIds: filteredSongs
		}))

		return {
			added: filteredSongs.length,
      		skipped: songIds.length - filteredSongs.length
		}
}

export const shuffledQueue = () => (dispatch: AppDispatch, getState: () => RootState) => {

    const state = getState();
	const queue = state.player.queue;

	const manual = queue.filter(q => q.source === "manual");
	const suggestions = queue.filter(q => q.source === "suggestion");
	
    if (manual.length === 0) return;

    const shuffled = [
		...shuffle(manual),
		...suggestions
	]

    dispatch(shuffleQueue(shuffled))
}

export const playAlbum = (songId: string, songIds: string[], id: string) => (dispatch: AppDispatch) => {
    dispatch(clearQueue())
    dispatch(setCurrentSong(songId))
    dispatch(addPlaylistToQueue(songIds))
	dispatch(setPlaybackSource({
		type: "album",
		id
	}))
}