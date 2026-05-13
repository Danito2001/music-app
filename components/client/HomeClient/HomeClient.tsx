"use client";

import { selectHistorySong, selectPinnedItems } from "@/store/songs/songs.selector";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "../../common/Carousel";
import { SongCard } from "../../features/song/SongCard";
import { AlbumCard } from "../../features/song/AlbumCard";
import { ArtistCard } from "../../features/song/ArtistCard";
import { useEffect } from "react";
import { upsertManyToCatalog } from "@/store/songs/songs.slice";
import { getPlaylistCover } from "@/helpers/getPlaylistCover";
import { RootState } from "@/store/store";
import { getOptionKey } from "@/helpers/getOptionKey";
import { ChartResponse } from "@/interfaces/api.interface";


export default function HomeClient({ data }: { data: ChartResponse }) {

    const dispatch = useDispatch()

    const historySongs = useSelector(selectHistorySong)
    const pinnedItems = useSelector(selectPinnedItems)
    const entities = useSelector((state: RootState) => state.songs.catalog.entities);

    const { albums, artists, tracks } = data;

    useEffect(() => {
        dispatch(upsertManyToCatalog(tracks))
    }, [tracks, dispatch])

    return (
        <div className="flex flex-col">
            {Object.values(pinnedItems).some(arr => arr.length > 0) &&
                (<Carousel title="Anclados">
                    <div className="flex gap-x-4">
                        {pinnedItems.songs.map((track) => {
                            const option = getOptionKey("pinned", track.id)

                            return (
                                <SongCard
                                    key={track.id}
                                    playlistId={null}
                                    song={track}
                                    view="large"
                                    mode="suggestion-standalone"
                                    optionKey={option}
                                    isPinned
                                />
                            )
                        })}
                        {pinnedItems.playlists.map((playlist) =>
                            <AlbumCard
                                key={playlist.id}
                                album={{
                                    ...playlist,
                                    cover: getPlaylistCover(playlist, entities)
                                }}
                                size="md"
                                viewType="playlist"
                            />
                        )}
                    </div>
                </Carousel>)
            }

            <div className="flex flex-col gap-y-4 mb-20">
                {historySongs.length > 0 && (
                    <Carousel history>
                        {historySongs.slice(0, 9).map((track) => {
                            const option = getOptionKey("song-history", track.id)

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
                <Carousel title="Top globales">
                    {tracks.map(track => {
                        const option = getOptionKey("song", track.id)

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
                <Carousel title="Playlist más populares">
                    <div className="flex gap-x-4">
                        {albums.map(album =>
                            <AlbumCard
                                key={album.id}
                                album={album}
                                size="md"
                                viewType="album"
                            />
                        )}
                    </div>
                </Carousel>
                <Carousel title="Canales de música que te podrían interesar">
                    {artists.map(artist =>
                        <ArtistCard key={artist.id} artist={artist} variant="large" />
                    )}
                </Carousel>
            </div>
        </div>
    )
}