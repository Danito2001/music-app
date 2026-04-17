import { useAudioPlayerContext } from "@/context/audio.context";
import { useUIContext } from "@/context/ui.context";
import { toast } from "@/helpers/toast";
import { SourceType } from "@/interfaces/collection.interface";
import { PlayType } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";
import { addPlaylistToQueueEnd, addSongToPlayNext, playFirstSongFromPlaylist, playNextSong, playPrevSong, playRandomSongFromPlaylist, playRandomTrack, playSongSmart, playStandaloneSong, playSuggestionSong, removeSongFromQueueThunk, shuffledQueue } from "@/store/player/player.thunk";
import { clearQueue, setCurrentSong, setRepeatMode, stop } from "@/store/player/playerSlice";
import { addSuggestionToPlaylist, dislikedSongThunk, likedSongThunk } from "@/store/songs/songs.thunk";
import { addSongToPinned, removeSongFromPinned } from "@/store/songs/songsSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"
import { usePlayer } from "./usePlayer";


export default function usePlayerActions() {

    const audioRef = useAudioPlayerContext().audioRef;
    const closePlayer = useUIContext().closePlayer;
    const repeat = usePlayer().repeat;

    const dispatch:AppDispatch = useDispatch();
    const router = useRouter();

    const clearQueueAction  = () => {
        closePlayer()
        setTimeout(() => {
            dispatch(setCurrentSong(null))
            dispatch(clearQueue())
            dispatch(stop())
        }, 400);
    }

    const playNext = () => {
        dispatch(playNextSong())
    }

    const playPrev = (currentTime: number) => {
        dispatch(playPrevSong(currentTime))
    }

    const setShuffle = () => dispatch(shuffledQueue())
    
    const setLoop = () => {
        if (!audioRef.current) return;

        if (repeat) {
            dispatch(setRepeatMode(false))
            audioRef.current.loop = false
        } else {
            dispatch(setRepeatMode(true))
            audioRef.current.loop = true
        }
    }

    const goToArtist = (artistId: string, artistName: string) => router.push(`/channel/${artistId}/${artistName}`)

    const addSong = (songId: string) => dispatch(playSuggestionSong(songId));

    const addSuggestion = (songId: string, playlistId: string) => dispatch(addSuggestionToPlaylist(playlistId, songId));

    const addNextSong = (songId: string) => dispatch(addSongToPlayNext(songId));

    const removeSong = (queueId: string, songId: string) => dispatch(removeSongFromQueueThunk(queueId, songId));

    const playSong = (songId: string, type:PlayType, playlistId?: string) => dispatch(playSongSmart(songId, type, playlistId));

    const playRandom = (tracks: UiSong[]) => dispatch(playRandomTrack(tracks))

    const playSingleSong = (songId: string) => dispatch(playStandaloneSong(songId))

    const likedSong = (songId: string) => dispatch(likedSongThunk(songId))

    const dislikedSong = (songId: string) => dispatch(dislikedSongThunk(songId))

    const addPinned = (songId: string) => {
        toast("", "La canción se ancló a la volver a escuchar")
        dispatch(addSongToPinned(songId))
    }

    const removePinned = (songId: string) => {
        toast("", "La canción se quitó de volver a escuchar")
        dispatch(removeSongFromPinned(songId))
    } 

    const selectRandomSong = (playlistId: string, type: SourceType) => dispatch(playRandomSongFromPlaylist(playlistId, type))

    const addPlaylistQueue = (playlistId: string) => {
        toast("Playlist Añadida", "La playlist se añadió a la fila")
        dispatch(addPlaylistToQueueEnd(playlistId))
    }

    const playPlaylist = (playlistId: string, type: SourceType) => dispatch(playFirstSongFromPlaylist(playlistId, type))

    return {
        clearQueueAction,
        playNext,
        playPrev,
        setShuffle,
        addNextSong,
        setLoop,
        goToArtist,
        repeat,
        addSong,
        addSuggestion,
        removeSong,
        playSong,
        playRandom,
        playSingleSong,
        likedSong,
        dislikedSong,
        addPinned,
        removePinned,
        selectRandomSong,
        addPlaylistQueue,
        playPlaylist
    }
}