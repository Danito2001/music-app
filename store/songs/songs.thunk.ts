import { addSongToPlaylist, setPlaylistSuggestion } from "../playlist/playlist.slice";
import {
	removeFromGlobalSuggestions,
	toggleLike,
	addSongToLiked,
	removeSongFromLiked,
	toggleDislike,
	upsertManyToCatalog,
	saveSearchCache,
	setCurrentQuery,
	setLoading,
	setGlobalSuggestions
} from "./songs.slice";
import { AppDispatch, RootState } from "../store";
import { songSelectors } from "./songs.selector";
import { toast } from "@/helpers/toast";
import { shuffle } from "@/helpers/shuffle";
import { getRelatedService, getTracksService, previewSearchService } from "@/services/deezer";
import { upsertOneArtist } from "../artist/artist.slice";
import { selectPlaylistSongs } from "../playlist/playlist.selector";
import { setSuggestionsQueue } from "../player/player.slice";


export const addSuggestionToPlaylist =
  	(playlistId: string, songId: string) => (dispatch: AppDispatch) => {
		dispatch(addSongToPlaylist({ playlistId, songId }));
		dispatch(removeFromGlobalSuggestions(songId));
};

export const setGlobalSuggestionsFallBack =
	() => (dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();
		
		const allSongs = songSelectors.selectAll(state);

		const shuffledIds = shuffle(allSongs.map(song => song.id))
		const suggestions = shuffledIds.slice(0,10);

		dispatch(setGlobalSuggestions(suggestions))
	};

export const setPlaylistSuggestionsFromPlaylist =
	(playlistId: string) =>
	async (dispatch: AppDispatch, getState: () => RootState) => {

		const state = getState();
		const playlistSongs = selectPlaylistSongs(state, playlistId);

		if (playlistSongs.length === 0) {
			dispatch(setPlaylistSuggestion({
				playlistId,
				ids: []
			}))
			return;
		}

		const artistIds = [...new Set(playlistSongs.map(s => s.artistId))];

		const selectedArtists = shuffle(artistIds).slice(0, 3);

		const results = await Promise.allSettled(
			selectedArtists.map(artistId =>
				dispatch(fetchSuggestions(artistId))
			)
		);

		const tracks = results
			.filter(r => r.status === "fulfilled")
			.flatMap(r => r.value ?? []);

		const songIds = tracks.map(track => track.id)

		const shuffled = shuffle(songIds).slice(0, 10);

		dispatch(upsertManyToCatalog(tracks));

		dispatch(setPlaylistSuggestion({
			playlistId,
			ids: shuffled
		}))
  };

export const loadSuggestions =
	(playlistId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
		const state = getState();
		const playlistSongs = selectPlaylistSongs(state, playlistId);

		if (playlistSongs.length === 0) {
			dispatch(setGlobalSuggestionsFallBack());
		} else {
			dispatch(setPlaylistSuggestionsFromPlaylist(playlistId));
		}
	};

export const likedSongThunk = (songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

	const state = getState();
	const song = state.songs.catalog.entities[songId]

	if (!song) return;

	if (song.liked === "liked") {
		dispatch(removeSongFromLiked(songId))
		toast("Canción retirada", "Se quito de tu lista de me gusta");
	} else {
		dispatch(addSongToLiked(songId))
		toast("Canción añadida", "Se agregó a tu lista de me gusta");
	}

	dispatch(toggleLike(songId))
}

export const dislikedSongThunk = (songId: string) => (dispatch: AppDispatch, getState: () => RootState) => {

	const state = getState();
	const song = songSelectors.selectById(state, songId)

	if (!song) return;

	if (song.liked === "liked") {
		dispatch(removeSongFromLiked(songId))
		dispatch(toggleDislike(songId))
	} else {
		dispatch(toggleDislike(songId))
	}

}

export const searchTracks = 
	(query: string) => async (dispatch: AppDispatch, getState: () => RootState) => {

		try {
			const state = getState();
			const normalizedQuery = query.toLowerCase().trim();

			dispatch(setCurrentQuery(normalizedQuery))

			const cached = state.songs.searchCache[normalizedQuery];

			if (cached) return;

			const { tracks, artist } = await previewSearchService(normalizedQuery);

			const uniqueTracks = Array.from(
				new Map(tracks.data.map(song => [song.id, song])).values()
			)

			dispatch(upsertManyToCatalog(uniqueTracks))
			dispatch(upsertOneArtist(artist.data[0]))

			const songsIds = uniqueTracks.map(song => song.id)

			dispatch(saveSearchCache({
				query: normalizedQuery,
				ids: songsIds,
				artistId: artist.data[0].id
			}))

		} catch (error) {
			console.log(error)
		}
}

export const fetchSuggestions = (artistId: string) => async(dispatch: AppDispatch) => {

	dispatch(setLoading(true));

	try {
		const related = await getRelatedService(artistId)

		const tracks = await Promise.allSettled(
			related.map(artist => 
				getTracksService(artist.id, 3)
			)
		) 

		const flattedTracks = tracks.filter(track => track.status == "fulfilled").flatMap(track => track.value);
		const shuffled = flattedTracks.sort(() => Math.random() - 0.5)

		dispatch(upsertManyToCatalog(shuffled))

		return shuffled
		
	} catch (error) {
		console.log({error: error})
		return [];
	} finally {
		dispatch(setLoading(false));
	}

}

export const loadSuggestionsForSource = 
	(artistId: string, options: {source: "queue" | "playlist" | "global", playlistId?: string}) => 
	async (dispatch: AppDispatch) => {

		const tracks = await dispatch(fetchSuggestions(artistId));

		const ids = tracks.map(t => t.id);

		if (options.source === "queue") {
			dispatch(setSuggestionsQueue(ids))
		}

		if (options.source === "playlist" && options.playlistId) {
			dispatch(setPlaylistSuggestion({
				playlistId: options.playlistId, 
				ids
			}))
		}

		if (options.source === "global") {
			dispatch(setGlobalSuggestions(ids));
		}
  	};