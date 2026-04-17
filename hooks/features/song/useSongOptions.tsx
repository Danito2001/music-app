import { useUIContext } from "@/context/ui.context";
import { usePathname } from "next/navigation";
import usePlaylistActions from "../playlist/usePlaylistActions";
import usePlayerActions from "../player/usePlayerActions";
import { useSelector } from "react-redux";
import { Icons } from "@/icons";
import { selectIsSongPinned } from "@/store/songs/songs.selector";
import { RootState } from "@/store/store";
import { UiSong } from "@/interfaces/song.interface";
import { PlayType } from "@/interfaces/common.interface";
import { Option } from "@/interfaces/ui.interface";
import { usePlayer } from "../player/usePlayer";

interface UseSongOptionsProps {
    song: UiSong;
    mode: PlayType;
    queueId?: string;
    playlistId?: string;
}

export const useSongOptions = ({
    song,
    queueId,
    mode,
    playlistId 
}: UseSongOptionsProps) => {

    const path = usePathname();

    const modalOpen = useUIContext().modalOpen;
    const removeSong = usePlaylistActions().removeSong;

    const player = usePlayerActions();
    const currentSongId = usePlayer().currentSongId;

    const isPinned = useSelector((state: RootState) => selectIsSongPinned(state, song.id));

    const options: Option[] = [
        { icon: Icons.Playlist, label: "Reproducir a continuación", action: () => player.addNextSong(song.id) },
        { icon: Icons.Playlist, label: "Agregar a la fila", action: () => player.addSong(song.id) },
        { icon: Icons.PlaylistAdd, label: "Guardar en una playlist", action: () => modalOpen({ type: "saveSong", props: {
            songId: song.id
        } }) },
        ...(playlistId && mode === "playlist"
            ? [{icon: Icons.PlaylistRemove, label: "Quitar de la playlist", action: () => removeSong(playlistId, song.id)}]
            : []),
        ...(queueId
            ? [{icon: Icons.PlaylistRemove, label: "Quitar de la fila", action: () => player.removeSong(queueId, song.id)}]
            : []),
        ...(!path.includes(song.artistId)
            ? [{icon: Icons.User, label: "Ir al artista", action: () => player.goToArtist(song.artistId, song.artistName)}]
            : [] ),
        isPinned
            ? { icon: Icons.Close, label: "Dejar de fijar en volver a escuchar", action: () => player.removePinned(song.id) }
            : { icon: Icons.Pin, label: "Fijar en volver a escuchar", action: () => player.addPinned(song.id) },
    ]

    return {
        currentSongId,
        options
    }
}