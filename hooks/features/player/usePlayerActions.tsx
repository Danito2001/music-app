import { useAudioPlayerContext } from "@/context/audio.context";
import { useUIContext } from "@/context/ui.context";
import { toast } from "@/helpers/toast";
import { SourceType } from "@/interfaces/collection.interface";
import { PlayType } from "@/interfaces/common.interface";
import { UiSong } from "@/interfaces/song.interface";
import { addPlaylistQueueThunk, addSongToPlayNext, addToManualQueue, playFirstSongFromPlaylist, playNextSong, playPrevSong, playRandomSongFromPlaylist, playRandomTrack, playSongSmart, playStandaloneSong, playSuggestionSong, removeSongFromQueueThunk, shuffledQueue } from "@/store/player/player.thunk";
import { clearQueue, setCurrentSong, setRepeatMode, stop } from "@/store/player/player.slice";
import { addSuggestionToPlaylist, dislikedSongThunk, likedSongThunk } from "@/store/songs/songs.thunk";
import { addSongToPinned, removeSongFromPinned } from "@/store/songs/songs.slice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"
import { usePlayer } from "./usePlayer";
import { CollectionType } from "../playlist/useCollectionType";

type PlaySongArgs = {
    songId: string;
    playlistId: string | null;
    mode?: PlayType;
    source?: CollectionType;
};


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

    const goToArtist = (artistId: string, artistName: string) => router.push(`/channel/${artistId}/${artistName}`);
    
    const goToAlbum = (albumId: string) => router.push(`/playlist?list=${albumId}&type=album`);

    const addSong = (songId: string) => dispatch(playSuggestionSong(songId));

    const addSuggestion = (songId: string, playlistId: string) => dispatch(addSuggestionToPlaylist(playlistId, songId));

    const addNextSong = (songId: string) => dispatch(addSongToPlayNext(songId));

    const removeSong = (queueId: string, songId: string) => dispatch(removeSongFromQueueThunk(queueId, songId));

    const playSong = ({ songId, mode, source, playlistId }: PlaySongArgs) => {
        dispatch(playSongSmart(songId, playlistId, mode, source));
    }
    
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
        const result = dispatch(addPlaylistQueueThunk(playlistId))
        
        if (result.added > 0) {
            toast("Playlist Añadida", `${result?.added} canciones agregadas`)
        }
        
        if (result.skipped > 0) {
            toast("Playlist Añadida", `${result.skipped} ya estaban en la cola`)
        }

        if (result.added === 0 && result.skipped === 0) {
            toast("", "La playlist ya esta en la cola")
        }
    }

    const playPlaylist = (playlistId: string, type: SourceType) => dispatch(playFirstSongFromPlaylist(playlistId, type))

    const addEndToQueue = (songId: string) => {
        const result = dispatch(addToManualQueue(songId)) 

        if (result.added > 0) {
            toast("Canción Añadida", "La canción se añadio a la cola")
        } else {
            toast("", "La canción ya se encuentra en la cola")
        }
    }

    return {
        clearQueueAction,
        playNext,
        playPrev,
        setShuffle,
        addNextSong,
        setLoop,
        goToArtist,
        goToAlbum,
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
        playPlaylist,
        addEndToQueue
    }
}