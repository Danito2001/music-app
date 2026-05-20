import { useUIContext } from "@/context/ui.context";
import usePlayerActions from "./usePlayerActions";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Icons } from "@/icons";
import { selectCurrentPinned } from "@/store/songs/songs.selector";
import { UiSong } from "@/interfaces/song.interface";
import { useScreen } from "@/context/screen.context";
import { QueueSections } from "@/interfaces/player.interface";

interface OptionProps {
    currentSong: UiSong; 
    queueSongs: QueueSections;
}

export const usePlayerOptions = (
    currentSong: OptionProps["currentSong"], 
    queueSongs: OptionProps["queueSongs"]
) => {
    const player = usePlayerActions();
    const modalOpen = useUIContext().modalOpen;
    const path = usePathname();
    const isMobile = useScreen()

    const alreadyPinned = useSelector(selectCurrentPinned);

    const currentQueueItem = queueSongs.manual.find(
        item => item.queueId === currentSong.id
    );

    const queueId = currentQueueItem?.queueId;
    const albumId = currentSong.albumId;

    return [
        ...(isMobile ? [{ 
            icon: currentSong.liked === "liked" ? Icons.Liked : Icons.Like,
            label: "Agregar a Me Gusta", 
            action: () => player.likedSong(currentSong.id) }] : []
        ),
        { icon: Icons.Playlist, label: "Reproducir a continuación", action: () => player.addNextSong(currentSong.id) }, 
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => player.addEndToQueue(currentSong.id) }, 
        { 
            icon: Icons.PlaylistAdd, label: "Guardar en una playlist", 
            action: () => modalOpen({ type: "saveSong", props: { songId: currentSong.id } })
        },
        ...(queueId 
            ? [{ icon: Icons.PlaylistRemove, label: "Quitar de la fila", action: () => player.removeSong(queueId, currentSong.id), }] 
            : []), 
        ...(!path.includes(currentSong.artistId) 
            ? [{ icon: Icons.User, label: "Ir al artista", action: () => player.goToArtist(currentSong.artistId, currentSong.artistName) }] 
            : []),
        ...(albumId
            ? [{ icon: Icons.Disc, label: "Ir al álbum", action: () => player.goToAlbum(albumId) }]
            : []), 
        alreadyPinned 
            ? { icon: Icons.Close, label: "Dejar de fijar en volver a escuchar", action: () => player.removePinned(currentSong.id) } 
            : { icon: Icons.Pin, label: "Fijar en volver a escuchar", action: () => player.addPinned(currentSong.id) }, { icon: Icons.Close, label: "Descartar fila", action: () => player.clearQueueAction() },
    ];
};