import Link from "next/link";
import { CoverImage } from "../../playlist/CoverImage/CoverImage";
import { UiAlbum } from "@/interfaces/song.interface";

type Sizes = "sm" | "md" | "lg";
type ViewType = "album" | "playlist"

export default function AlbumCard({
    album,
    isRow,
    size,
    viewType
}: {
    album: UiAlbum;
    isRow?: boolean;
    size: Sizes;
    viewType?: ViewType;
}) {
    return (
        <div className={`flex gap-3 w-full min-w-0 ${isRow ? "flex-row items-center justify-between" : "flex-col"}`}>
            
            <Link
                className="group relative shrink-0"
                href={{
                    pathname: "/playlist",
                    query: { list: album.id }
                }}
            >
                <CoverImage images={album.cover} size={size} />
                <div className="group-hover:bg-black/40 absolute inset-0"/>
            </Link>

            <div className="flex flex-col flex-1 min-w-0 justify-center">

                <span className="font-semibold text-xs md:text-sm block truncate">
                    {album.title}
                </span>

                <div className="flex items-center min-w-0 text-xs md:text-sm">
                    {album.artistName && (
                        <div className="flex flex-nowrap opacity-80">
                            <span>Álbum •</span>
                            <Link 
                                className="min-w-0 truncate block hover:underline"
                                href={{
                                    pathname: "/playlist",
                                    query: { list: album.id }
                                }} 
                            >
                                {album.artistName}
                            </Link>
                        </div>
                    )}

                    {viewType === "album" && album.year && (
                        <span className="opacity-80 shrink-0 ml-1 whitespace-nowrap">
                            {album.artistName ? `• ${album.year}` : album.year}
                        </span>
                    )}

                    {viewType === "playlist" && (
                        <span className="opacity-80 shrink-0 ml-1 whitespace-nowrap">
                            {album.songIds.length} canciones
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}