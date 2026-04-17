import { AppDispatch, RootState } from "../store";
import { addManySongsToPlaylist } from "./playlistSlice";


export const addSongsToPlaylist = 
    (playlistId: string, songIds: string[]) => (dispatch: AppDispatch, getState: () => RootState) => {

        const state = getState();

        const playlist = state.playlist.playlists.find(pl => pl.id === playlistId)
        if (!playlist) return { addedCount: 0 }

        const existing = new Set(playlist.songIds)
        const newSongIds = songIds.filter(id => !existing.has(id))

        const addedCount = newSongIds.length

        if (addedCount > 0) {
            dispatch(addManySongsToPlaylist({ playlistId, songIds: newSongIds }))
        }

        return { addedCount };
}