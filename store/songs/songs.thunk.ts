import { addSongToPlaylist } from "../playlist/playlistSlice";
import {
	removeFromGlobalSuggestions,
	setGlobalSuggestions,
	setPlaylistSuggestions,
	toggleLike,
	addSongToLiked,
	removeSongFromLiked,
	toggleDislike,
	upsertManyToCatalog,
	saveSearchCache,
	setCurrentQuery,
	setLoading,
} from "../songs/songsSlice";
import { AppDispatch, RootState } from "../store";
import { songSelectors } from "./songs.selector";
import { toast } from "@/helpers/toast";
import { shuffle } from "@/helpers/shuffle";
import { getRelatedService, getTracksService, previewSearchService } from "@/services/deezer";
import { upsertOneArtist } from "../artist/artist.slice";
import { selectPlaylistSongs } from "../playlist/playlist.selector";


export const addSuggestionToPlaylist =
  	(playlistId: string, songId: string) => (dispatch: AppDispatch) => {
		dispatch(addSongToPlaylist({ playlistId, songId }));
		dispatch(removeFromGlobalSuggestions(songId));
};

export const setSuggestionSongsFromPlaylist =
	(playlistId?: string) => (dispatch: AppDispatch, getState: () => RootState) => {

		if (!playlistId) return;
		
		const state = getState();
		const playlist = state.playlist.playlists.find((p) => p.id === playlistId);
		
		if (!playlist) return;

		const allSongs = songSelectors.selectAll(state);

		const playlistSongs = selectPlaylistSongs(playlistId)
		
		if (playlistSongs.length === 0) {

			const shuffledIds = shuffle(allSongs.map(song => song.id))
			const suggestions = shuffledIds.slice(0,10);
			
			dispatch(setGlobalSuggestions(suggestions))
			return;
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
		dispatch(setPlaylistSuggestions(shuffled.map(song => song.id)))
		
	} catch (error) {
		console.log({error: error})
	} finally {
		dispatch(setLoading(false));
	}

}