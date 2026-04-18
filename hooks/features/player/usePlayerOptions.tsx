import { useUIContext } from "@/context/ui.context";
import usePlayerActions from "./usePlayerActions";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Icons } from "@/icons";
import { selectCurrentPinned } from "@/store/songs/songs.selector";
import { UiSong } from "@/interfaces/song.interface";
import { useScreen } from "@/context/screen.context";

interface OptionProps {
    currentSong: UiSong; 
    queueSongs: { queueId: string; song: UiSong }[]
}

export const usePlayerOptions = (
    currentSong: OptionProps["currentSong"], 
    queueSongs: OptionProps["queueSongs"]
) => {
    const { addSong, addNextSong, removeSong, goToArtist, clearQueueAction, addPinned, removePinned, likedSong } = usePlayerActions();
    const modalOpen = useUIContext().modalOpen;
    const path = usePathname();
    const {isMobile } = useScreen();

    const alreadyPinned = useSelector(selectCurrentPinned);

    const currentQueueItem = queueSongs.find(
        item => item.queueId === currentSong.id
    );

    const queueId = currentQueueItem?.queueId;

    return [
        ...(isMobile ? [{ 
            icon: currentSong.liked === "liked" ? Icons.Liked : Icons.Like,
            label: "Agregar a Me Gusta", 
            action: () => likedSong(currentSong.id) }] : []
        ),
        { icon: Icons.Playlist, label: "Reproducir a continuación", action: () => addNextSong(currentSong.id) }, 
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => addSong(currentSong.id) }, 
        { 
            icon: Icons.PlaylistAdd, label: "Guardar en una playlist", 
            action: () => modalOpen({ type: "saveSong", props: { songId: currentSong.id } }) 
        },
        ...(queueId 
            ? [{ icon: Icons.PlaylistRemove, label: "Quitar de la fila", action: () => removeSong(queueId, currentSong.id), }] 
            : []), 
        ...(!path.includes(currentSong.artistId) 
            ? [{ icon: Icons.User, label: "Ir al artista", action: () => goToArtist(currentSong.artistId, currentSong.artistName) }] 
            : []),
        alreadyPinned 
            ? { icon: Icons.Close, label: "Dejar de fijar en volver a escuchar", action: () => removePinned(currentSong.id) } 
            : { icon: Icons.Pin, label: "Fijar en volver a escuchar", action: () => addPinned(currentSong.id) }, { icon: Icons.Close, label: "Descartar fila", action: () => clearQueueAction() },
    ];
};