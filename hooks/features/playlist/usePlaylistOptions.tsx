import usePlayerActions from "../player/usePlayerActions";
import usePlaylistActions from "./usePlaylistActions";
import { Icons } from "@/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { CollectionView, SourceType } from "@/interfaces/collection.interface";
import { Option } from "@/interfaces/ui.interface";

interface PlaylistOptionsProps {
    collection: CollectionView; 
    playlistId: string; 
    type: SourceType;
}

export const usePlaylistOptions = ({collection, playlistId, type} :PlaylistOptionsProps) => {

    const { removePlaylist, addPinned, removePinned } = usePlaylistActions();
    const { selectRandomSong, addPlaylistQueue } = usePlayerActions();

    const isLiked = playlistId === "LM";
    const isAlbum = collection.type === "album";
    

    const alreadyPinned = useSelector((state: RootState) =>
        playlistId ? state.playlist.pinnedPlaylists.includes(playlistId) : false
    )

    const options: Option[] = [
        { icon: Icons.Shuffle, label: "Reproducir aleatoriamente", action: () => selectRandomSong(playlistId, type) },
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => addPlaylistQueue(playlistId) },
        ...(!isLiked && !isAlbum
            ? [{ icon: Icons.Trash, label: "Eliminar playlist", action: () => removePlaylist(playlistId) }]
            : []),
        alreadyPinned
            ? { icon: Icons.Close, label: "Dejar de fijar en volver a escuchar", action: () => removePinned(playlistId) }
            : { icon: Icons.Pin, label: "Fijar en volver a escuchar", action: () => addPinned(playlistId) }
    ]

    return {
        isAlbum,
        options
    }
}