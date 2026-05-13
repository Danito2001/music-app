import { useUIContext } from "@/context/ui.context";
import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import { createPortal } from "react-dom";
import { Divider } from "../../../common/Divider";
import { AlbumCard } from "../AlbumCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getPlaylistCover } from "@/helpers/getPlaylistCover";
import usePlaylistActions from "@/hooks/features/playlist/usePlaylistActions";
import { toast } from "@/helpers/toast";


interface SaveSongProps {
    onClose: () => void;
    songId?: string;
    songIds?: string[];
}
export default function SaveSongModal({ onClose, songId, songIds }: SaveSongProps) {

    const { modalOpen, closeModal } = useUIContext();
    const playlistActions = usePlaylistActions();
    
    const playlists = useSelector((state: RootState) => state.playlist.playlists)
    const entities = useSelector((state: RootState) => state.songs.catalog.entities);

    return (
        createPortal(
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">

                <div className="relative flex flex-col gap-y-2 border border-neutral-700 rounded-2xl w-full max-w-md h-[80vh] bg-neutral-800 text-white">

                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-xl font-bold">Guardar en una playlist</h3>
                        <Button
                            className="w-fit"
                            size="lg"
                            onPress={onClose}
                            isIconOnly
                        >
                            <Icons.Close size={25} />
                        </Button>
                    </div>

                    <Divider />

                    <div className="scrollbar">

                        <div className="p-4 space-y-4">
                            <h4 className="font-semibold text-sm">Todas las playlists</h4>
                            <div className="flex flex-col gap-y-4">
                                {playlists.map((playlist) => (
                                    <div 
                                        key={playlist.id}
                                        onClick={() => {
                                            const songsToSave = songIds ?? (songId ? [songId]: [])

                                            const result = playlistActions.addManySongs(playlist.id, songsToSave)

                                            if (result.addedCount === 0) {
                                                toast("", "Ya estaba en la playlist");
                                            } else if (result.addedCount < songsToSave.length) {
                                                toast("", "Algunas ya estaban en la playlist");
                                            } else {
                                                toast("", "Agregada/s correctamente");
                                            }

                                            closeModal()
                                        }}
                                    >
                                        <AlbumCard
                                            album={{
                                                ...playlist,
                                                cover: getPlaylistCover(playlist, entities)
                                            }}
                                            size="sm"
                                            isRow
                                            viewType="playlist"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        className="absolute bottom-2 right-2 rounded-full bg-white text-black"
                        onPress={() => modalOpen({ type: "playlistForm" })}
                    >
                        Nueva playlist
                    </Button>

                </div>
            </div>, document.body
        )
    )
}
