"use client";

import { Carousel } from "@/components/common/Carousel";
import { AlbumCard } from "@/components/features/song/AlbumCard";
import { ArtistCard } from "@/components/features/song/ArtistCard";
import { SongCard } from "@/components/features/song/SongCard";
import { useUIContext } from "@/context/ui.context";
import { getOptionKey } from "@/helpers/getOptionKey";
import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { Icons } from "@/icons";
import { ArtistResponse } from "@/interfaces/api.interface";
import { selectLikedSong } from "@/store/songs/songs.selector";
import { upsertManyToCatalog } from "@/store/songs/songs.slice";
import { Button } from "@heroui/react";
import Image from "next/image"
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function ChannelClient({ data }: { data: ArtistResponse }) {

    const { artist, albums, relatedArtist, tracks } = data;
    const sidebarOpen = useUIContext().sidebarOpen;

    const playRandom = usePlayerActions().playRandom;

    const dispatch = useDispatch();
    const likedSongs = useSelector(selectLikedSong)

    useEffect(() => {
        dispatch(upsertManyToCatalog(tracks))
    }, [dispatch, tracks])

    console.log({tracks})

    return (
        <>
            <div className={`absolute overflow-hidden inset-0 z-0 h-[80vh] ${sidebarOpen && "lg:ml-[220px]"}`}>

                <Image
                    src={artist.cover_profile}
                    alt="Banner"
                    fill
                    className="object-fill"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                <div className={`relative h-full flex flex-col justify-end px-2 ml-0 sm:px-12 ${sidebarOpen ? "ml-0" : "sm:ml-[90px]"} text-white`}>

                    <div className="flex flex-col gap-y-2 max-w-2xl">
                        <h2 className="text-3xl font-semibold">{artist.name}</h2>

                        <span className="opacity-80 text-sm">
                            Número de fans: {artist.fans}
                        </span>

                        <p className="text-sm opacity-90">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt
                            voluptatum deleniti perferendis, commodi corrupti quis ipsa nulla ea ut,
                            fugit nisi magnam dolores.
                        </p>
                    </div>

                    <div className="flex gap-x-3 mt-6">
                        <Button
                            size="sm"
                            className="flex gap-x-2 rounded-full bg-white hover:bg-white/80"
                            startContent={<Icons.Shuffle size={20} className="text-black" />}
                            onPress={() => playRandom(tracks)}
                        >
                            <span className="text-black">Aleatorio</span>
                        </Button>

                        <Button
                            size="sm"
                            className="flex gap-x-2 rounded-full bg-white hover:bg-white/80"
                            startContent={<Icons.Share size={20} className="text-black" />}
                        >
                            <span className="text-black">Compartir</span>
                        </Button>

                        <Button className="rounded-full border border-red-400 px-4">
                            <span className="text-red-400 font-semibold">
                                Suscribirse 72k
                            </span>
                        </Button>
                    </div>

                </div>
            </div>
            <div className="flex flex-col gap-y-10 mt-[90vh] w-full text-white">
                <div className="space-y-6">
                    <div>
                        <h3 className="pb-2 font-semibold text-xl">Canciones más populares</h3>
                        {tracks.map(track => {
                            const option = getOptionKey("song", track.id)
                            return (
                                <SongCard
                                    key={track.id}
                                    playlistId={null}
                                    song={track}
                                    view="search"
                                    mode="suggestion-standalone"
                                    optionKey={option}
                                />
                            )
                        })}
                    </div>
                    <Link
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/30"
                        href={{
                            pathname: "/playlist",
                            query: { artist: artist.id, type: "artist" }
                        }}
                    >
                        Mostrar todo
                    </Link>
                </div>

                <Carousel title="Álbumes">
                    <div className="flex gap-x-4">
                        {albums.slice(0, 8).map(album =>
                            <AlbumCard
                                key={album.id}
                                album={album}
                                size="md"
                                viewType="album"
                            />
                        )}
                    </div>
                </Carousel>

                {likedSongs.length > 0 && (
                    <Carousel title="De tu biblioteca">
                        {likedSongs.map(track => {
                            const option = getOptionKey("song-liked", track.id)

                            return (
                                <SongCard
                                    key={track.id}
                                    playlistId={null}
                                    song={track}
                                    view="large"
                                    mode="suggestion-standalone"
                                    optionKey={option}
                                />
                            )
                        })}
                    </Carousel>
                )}

                <Carousel title="A los fans también podría gustarles">
                    {relatedArtist.map(artist => (
                        <ArtistCard key={artist.id} artist={artist} variant="large" />
                    ))}
                </Carousel>
            </div>

        </>
    )
}