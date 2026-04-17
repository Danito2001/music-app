import { AppDispatch, RootState } from "@/store/store";
import { addPlaylistToQueue, clearQueue, setCurrentSong } from "@/store/player/playerSlice";
import { setSuggestionSongsFromPlaylist } from "@/store/songs/songs.thunk";
import { getSongIdsBySource } from "@/store/songs/songs.selector";
import { SourceType } from "@/interfaces/collection.interface";


export const startPlaylistPlayback = (
    dispatch: AppDispatch,
    songId: string,
    playlistId: string,
    state: RootState,
    type: SourceType
) => {

    const songIds = getSongIdsBySource[type](state, playlistId)

    dispatch(clearQueue());
    dispatch(setCurrentSong(songId));
    dispatch(addPlaylistToQueue(songIds));
    dispatch(setSuggestionSongsFromPlaylist(playlistId))
}