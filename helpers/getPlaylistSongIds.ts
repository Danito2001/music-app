import { RootState } from "@/store/store";


export const getPlaylistSongIds = (playlistId: string, getState: RootState) => {

    const playlist = getState.playlist.playlists.find(pl => pl.id === playlistId)
    return playlist?.songIds ?? []
}