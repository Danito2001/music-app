import { AppDispatch, RootState } from "@/store/store";
import { addPlaylistToQueue, clearQueue, setCurrentSong } from "@/store/player/player.slice";
import { loadSuggestionsForSource } from "@/store/songs/songs.thunk";
import { getSongIdsBySource, songSelectors } from "@/store/songs/songs.selector";
import { SourceType } from "@/interfaces/collection.interface";


export const startPlaylistPlayback = (
    dispatch: AppDispatch,
    songId: string,
    playlistId: string,
    state: RootState,
    type: SourceType
) => {

    const songIds = getSongIdsBySource[type](state, playlistId)
    const currentSong = songSelectors.selectById(state, songId)

    dispatch(clearQueue());
    dispatch(setCurrentSong(songId));
    dispatch(addPlaylistToQueue(songIds));
    
    if ( type === "playlist" ) {
        dispatch(loadSuggestionsForSource(currentSong.artistId, {
            source: "queue",
        }))
    } 
}