"use client";

import { ArtistCard } from "../../features/song/ArtistCard";
import { Divider } from "../../common/Divider";
import { SongCard } from "../../features/song/SongCard";
import AlbumList from "../../features/search/AlbumList/AlbumList";
import { JSX, useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { AlbumCard } from "../../features/song/AlbumCard";
import { Icons } from "@/icons";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { upsertManyToCatalog } from "@/store/songs/songsSlice";
import { TrackList } from "../../features/search/TrackList";
import { ArtistList } from "../../features/search/ArtistList";
import { getOptionKey } from "@/helpers/getOptionKey";
import { SearchResponse } from "@/interfaces/api.interface";

type RenderType = "album" | "artist" | "track";

export default function SearchClient({ initialData, q }: { initialData: SearchResponse, q: string }) {

    const dispatch = useDispatch();

    const [ activeType, setActiveType ] = useState<RenderType | null>(null)
    const [ bgColor, setBgColor ] = useState<string | null>(null);

    const { albums, artists, tracks } = initialData;

    const filters: { label: string, value: RenderType }[] = [
        { label: "Álbumes", value: "album" },
        { label: "Canciones", value: "track" },
        { label: "Artistas", value: "artist" },
    ]

    const renderMap: Record<RenderType, () => JSX.Element> = {
        track: () => <TrackList q={q} />,
        album: () => <AlbumList q={q} />,
        artist: () => <ArtistList q={q} />
    }

    const firstArtist = artists[0]

    useEffect(() => {
        setBgColor(`hsl(${Math.random() * 360}, 80%, 10%)`);
    }, []);


    useEffect(() => {
        dispatch(upsertManyToCatalog(tracks))
    }, [dispatch, tracks])


    return (
        <div className="flex flex-col gap-y-8 w-full overflow-x-hidden">
            <div className="flex items-center">
                {activeType && (
                    <Button
                        size="sm"
                        className="rounded-md bg-white text-black"
                        isIconOnly
                        onPress={() => setActiveType(null)}
                    >
                        <Icons.Close size={30} className="mx-auto" />
                    </Button>
                )}
                {filters.map(item =>
                    <Button
                        key={item.label}
                        size="sm"
                        className={`${activeType !== item.value ? "bg-neutral-900" : "bg-white text-black"} rounded-md mx-2 py-1`}
                        onPress={() => setActiveType(item.value)}
                    >
                        <span className="text-sm">{item.label}</span>
                    </Button>
                )}
            </div>

            {activeType ? (
                renderMap[activeType]()
            ) : (
                <>
                    {artists.length > 0 && (
                        <div className="flex flex-col lg:flex-row text-white"
                            style={{
                                background: `linear-gradient(to bottom, ${bgColor}, #000000)`
                            }}
                        >
                            <div className="relative flex items-center p-2 min-w-0 lg:w-3/5 bg-white/5">
                                <Link className="absolute top-0 right-0" href={`/channel/${firstArtist.id}/${firstArtist.name.toLowerCase().replace(/\s+/g, "-")}`}>
                                    <Button className="hover:bg-white/10 rounded-full" isIconOnly startContent={<Icons.NextPage className="mx-auto" />} />
                                </Link>
                                <ArtistCard artist={firstArtist} variant="first" tracks={tracks} />
                            </div>
                            <div className="flex flex-col p-2 min-w-0 lg:w-1/2">
                                {tracks.slice(0, 3).map(track => {
                                    const option = getOptionKey("song", track.id);

                                    return (
                                        <SongCard
                                            key={track.id}
                                            song={track}
                                            view="search"
                                            mode="suggestion-standalone"
                                            optionKey={option}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-y-4 text-white">

                        <h3 className="font-semibold text-xl">Más resultados</h3>

                        {albums.map(album =>
                            <div className="flex flex-col gap-y-2 py-1" key={album.id}>
                                <div className="w-full min-w-0">
                                    <AlbumCard 
                                        album={album} 
                                        size="sm" 
                                        isRow
                                        viewType="album"
                                    />
                                </div>
                                <Divider />
                            </div>
                        )}

                        {tracks.map(track => {
                            const option = getOptionKey("song-search", track.id);
                            return (
                                <div className="flex flex-col gap-y-2 py-1" key={track.id}>
                                    <SongCard
                                        song={track}
                                        view="search"
                                        mode="suggestion-standalone"
                                        optionKey={option}
                                    />
                                    <Divider />
                                </div>
                            )
                        })}

                        {artists.slice(1).map(artist =>
                            <div className="flex flex-col gap-y-2 py-1" key={artist.id}>
                                <ArtistCard
                                    artist={artist}
                                />
                                <Divider />
                            </div>
                        )}
                    </div>
                </>
            )}

        </div>
    )

}