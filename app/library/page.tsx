"use client";

import { Divider } from "@/components/common/Divider";
import { LikedCover } from "@/components/features/playlist/LikedCover";
import { AlbumCard } from "@/components/features/song/AlbumCard";
import { getPlaylistCover } from "@/helpers/getPlaylistCover";
import { Icons } from "@/icons";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useSelector } from "react-redux";


export default function Library() {

    const { playlists } = useSelector((state: RootState) => state.playlist)
    const entities = useSelector((state: RootState) => state.songs.catalog.entities);

    return (
        <div className="flex flex-col gap-y-6">
            <div>
                <div className="flex gap-x-4">
                    <Link
                        href={"/library"}
                        className="border-b border-b-white font-semibold text-lg"
                    >
                        Biblioteca
                    </Link>
                </div>
                <Divider/>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-2">
                <div className="w-fit">
                    <Link
                        href={{
                            pathname: "playlist",
                            query: { list: "LM" }
                        }}
                    >
                        <LikedCover/>
                    </Link>
                    <div>
                        <span className="pt-4 font-semibold text-xs">
                            Música que te gustó
                        </span>
                        <div className="flex items-center gap-x-2 opacity-80">
                            <Icons.Pin size={12} />
                            <span className="text-xs">Playlist autogenerada</span>
                        </div>
                    </div>
                </div>
                {playlists.map((playlist) => {
                    return (
                        <Link 
                            key={playlist.id} 
                            className="w-fit"
                            href={{
                                pathname: "/playlist",
                                query: { list: playlist.id }
                            }}
                        >
                            <AlbumCard
                                key={playlist.id}
                                album={{
                                    ...playlist,
                                    cover: getPlaylistCover(playlist, entities)
                                }}
                                size="lg"
                                viewType="playlist"
                            />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}