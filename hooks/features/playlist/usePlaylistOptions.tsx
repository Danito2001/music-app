import usePlayerActions from "../player/usePlayerActions";
import usePlaylistActions from "./usePlaylistActions";
import { Icons } from "@/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Option } from "@/interfaces/ui.interface";
import { useRouter } from "next/navigation";
import { CollectionType } from "./useCollectionType";

interface PlaylistOptionsProps {
    playlistId: string; 
    source: Exclude<CollectionType, "artist">;
}

export const usePlaylistOptions = ({playlistId, source} :PlaylistOptionsProps) => {

    const { removePlaylist, addPinned, removePinned } = usePlaylistActions();
    const { selectRandomSong, addPlaylistQueue } = usePlayerActions();

    const router = useRouter();

    const isLiked = playlistId === "LM";
    const isAlbum = source === "album";

    const alreadyPinned = useSelector((state: RootState) =>
        playlistId ? state.playlist.pinnedPlaylists.includes(playlistId) : false
    )

    const options: Option[] = [
        { icon: Icons.Shuffle, label: "Reproducir aleatoriamente", action: () => selectRandomSong(playlistId, source) },
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => addPlaylistQueue(playlistId) },
        ...(!isLiked && !isAlbum
            ? [{ icon: Icons.Trash, label: "Eliminar playlist", action: () => {
                router.replace("/library")
                removePlaylist(playlistId)  
              }}]
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