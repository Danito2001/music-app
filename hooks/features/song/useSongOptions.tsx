import { useUIContext } from "@/context/ui.context";
import { usePathname } from "next/navigation";
import usePlaylistActions from "../playlist/usePlaylistActions";
import usePlayerActions from "../player/usePlayerActions";
import { useSelector } from "react-redux";
import { Icons } from "@/icons";
import { selectIsSongPinned } from "@/store/songs/songs.selector";
import { RootState } from "@/store/store";
import { UiSong } from "@/interfaces/song.interface";
import { Option } from "@/interfaces/ui.interface";
import { usePlayer } from "../player/usePlayer";
import { CollectionType } from "../playlist/useCollectionType";
import { useScreen } from "@/context/screen.context";

interface UseSongOptionsProps {
    song: UiSong;
    playlistId: string | null;
    source?: CollectionType;
    queueId?: string;
}

export const useSongOptions = ({
    song,
    queueId,
    source,
    playlistId 
}: UseSongOptionsProps) => {

    const path = usePathname();

    const modalOpen = useUIContext().modalOpen;
    const removeSong = usePlaylistActions().removeSong;
    const isMobile = useScreen();

    const player = usePlayerActions();
    const currentSongId = usePlayer().currentSongId;

    const albumId = song.albumId;

    const isPinned = useSelector((state: RootState) => selectIsSongPinned(state, song.id));

    const options: Option[] = [
        ...(isMobile ? [{ 
            icon: song.liked === "liked" ? Icons.Liked : Icons.Like,
            label: "Agregar a Me Gusta", 
            action: () => player.likedSong(song.id) }] : []
        ),
        { icon: Icons.Playlist, label: "Reproducir a continuación", action: () => player.addNextSong(song.id) },
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => player.addEndToQueue(song.id) },
        { icon: Icons.PlaylistAdd, label: "Guardar en una playlist", action: () => modalOpen({ type: "saveSong", props: {
            songId: song.id
        }}) },
        ...(playlistId && source === "playlist"
            ? [{icon: Icons.PlaylistRemove, label: "Quitar de la playlist", action: () => removeSong(playlistId, song.id)}]
            : []),
        ...(queueId
            ? [{icon: Icons.PlaylistRemove, label: "Quitar de la fila", action: () => player.removeSong(queueId, song.id)}]
            : []),
        ...(!path.includes(song.artistId)
            ? [{icon: Icons.User, label: "Ir al artista", action: () => player.goToArtist(song.artistId, song.artistName)}]
            : [] ),
        ...(albumId
            ? [{ icon: Icons.Disc, label: "Ir al álbum", action: () => player.goToAlbum(albumId) }]
            : []), 
        isPinned
            ? { icon: Icons.Close, label: "Dejar de fijar en volver a escuchar", action: () => player.removePinned(song.id) }
            : { icon: Icons.Pin, label: "Fijar en volver a escuchar", action: () => player.addPinned(song.id) },
    ]

    return {
        currentSongId,
        options
    }
}