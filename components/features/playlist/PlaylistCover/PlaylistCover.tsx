import { useUIContext } from "@/context/ui.context";
import { getGridImages } from "@/helpers/getGridImages";
import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import { PlaybackOptions } from "../../player/PlaybackOptions";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { formatTime } from "@/helpers/formatTime";
import { LikedCover } from "../LikedCover";
import { CoverImage } from "../CoverImage/CoverImage";
import { usePlaylistOptions } from "@/hooks/features/playlist/usePlaylistOptions";
import { useFloatingPosition } from "@/hooks/common/useFloatingPosition";
import { getOptionKey } from "@/helpers/getOptionKey";
import { CollectionView } from "@/interfaces/collection.interface";
import { UiAlbum } from "@/interfaces/song.interface";
import { useClickOutside } from "@/hooks/common/useClickOutside";
import { CollectionType } from "@/hooks/features/playlist/useCollectionType";
import { EmptyCover } from "../EmptyCover";

interface CoverProps {
    collection: CollectionView | null;
    playlistId: string;
    album: UiAlbum | undefined;
    source: Exclude<CollectionType, "artist">;
}

export default function PlaylistCover({ collection, playlistId, album, source }: CoverProps) {
    
    
    const modalOpen = useUIContext().modalOpen;
    const playPlaylist = usePlayerActions().playPlaylist;
    const floating = useFloatingPosition();
    const { isAlbum, options } = usePlaylistOptions({playlistId, source});
    
    useClickOutside(floating.menuRef, () => {
        floating.closeOptions()
    }, floating.optionsOpen)
    
    if (!collection) {
        return <EmptyCover/>
    }

    const optionKey = getOptionKey("playlist")

    const isOpen = floating.optionsOpen === optionKey.optionKey
    const isPlaylist = collection.type === "playlist";
    const gridImages = getGridImages(collection.cover)

    return (
        <div className="flex flex-col items-center gap-y-2 text-center w-full lg:w-1/3 text-white">

            <div className="relative">
                {playlistId === "LM" 
                    ? <LikedCover/>
                    : <CoverImage images={gridImages} size="lg"/>
                }

                {isPlaylist && (
                    <Button
                        radius="full"
                        className="absolute bottom-2 right-2 bg-white"
                        isIconOnly
                        onPress={() => modalOpen({
                            type: "playlistForm", props: {
                                playlistId,
                                title: collection.title,
                                description: collection.description ?? "",
                                privacity: collection.privacity
                            }
                        })}
                    >
                        <Icons.Pencil size={20} className="mx-auto text-black" />
                    </Button>
                )}

            </div>

            <div>
                <h3 className="font-semibold text-3xl">{collection.title}</h3>
                <span className="text-sm">Nombre de usuario</span>
            </div>

            <div className="flex flex-col">
                {isPlaylist && <span className="text-sm">Playlist • {collection.privacity} • {collection.year}</span>}
                {isAlbum && <span className="text-sm">Álbum • {collection.year}</span>}
                <span className="text-sm">{collection.songIds.length} Canciones {album?.duration && `• ${formatTime(Number(album.duration))}`}</span>
            </div>

            <div>
                {isPlaylist && <span className="text-sm">{collection.description}</span>}
            </div>

            <div className="relative flex items-center gap-x-4">
                <Button
                    className="rounded-full bg-white"
                    isIconOnly
                    onPress={() => playPlaylist(playlistId, collection.type)}
                >
                    <Icons.Play size={20} className="mx-auto text-black" />
                </Button>

                <Button
                    ref={floating.buttonRef}
                    onPress={() => floating.handleOpen(optionKey.optionKey)}
                    isIconOnly
                    radius="full"
                    className="flex items-center text-white bg-neutral-800"
                >
                    <Icons.Options size={20} />
                </Button>

                <PlaybackOptions
                    options={options}
                    open={isOpen}
                    onSelect={floating.handleOptionSelect}
                    position={floating.position}
                    optionRef={floating.menuRef}
                />
            </div>
        </div>
    )
}