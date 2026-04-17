import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addSongToPlaylist, removeSongFromPlaylist, removePlaylist as removePlaylistAction, addPlaylistToPinned, removePlaylistFromPinned } from "@/store/playlist/playlistSlice";
import { toast } from "@/helpers/toast";
import { addSongsToPlaylist } from "@/store/playlist/playlist.thunk";
import { AppDispatch } from "@/store/store";
import { setSuggestionSongsFromPlaylist } from "@/store/songs/songs.thunk";
import { useCallback } from "react";


export default function usePlaylistActions() {

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const addSong = (playlistId: string, playlistTitle: string, songId: string) => {
        dispatch(addSongToPlaylist({ playlistId, songId }));
        toast("", `Se guardó en ${playlistTitle}`)
    }

    const addManySongs = (playlistId: string, songIds: string[]) => {
       const result = dispatch(addSongsToPlaylist(playlistId, songIds))
       return { addedCount: result.addedCount }
    }

    const removeSong = (playlistId: string, songId: string) => 
        dispatch(removeSongFromPlaylist({ playlistId, songId }));

    const sugestionFromPlaylist = useCallback((playlistId?: string) => {
        dispatch(setSuggestionSongsFromPlaylist(playlistId))
    }, [dispatch])
    
    const removePlaylist = (id: string) => {
        toast(null, "Se borró la playlist")
        dispatch(removePlaylistAction(id))

        router.push("/library")
    }

    const addPinned = (playlistId: string) => {
        dispatch(addPlaylistToPinned(playlistId))
        toast("Playlist añadida", "La playlist se anclo a volver a escuchar")
    }

    const removePinned = (playlistId: string) => {
        dispatch(removePlaylistFromPinned(playlistId))
        toast("Playlist retirada", "La playlist se quito de volver a escuchar")
    }
    
    return {
        addSong,
        addManySongs,
        removeSong,
        sugestionFromPlaylist,
        removePlaylist,
        addPinned,
        removePinned
    }
}