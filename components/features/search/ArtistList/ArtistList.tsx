"use client";

import { Loading } from "@/components/common/Loading";
import axiosServer from "@/utils/axios.client";
import { useEffect, useState } from "react"
import { ArtistCard } from "../../song/ArtistCard";
import { Divider } from "@heroui/react";
import { UiArtist } from "@/interfaces/song.interface";
import { artistListService } from "@/services/deezer";


export default function ArtistList({ q }: { q: string | null }) {

    const [ loading, setLoading ] = useState(false);
    const [ artists, setArtists ] = useState<UiArtist[]>([]);

    const type = "artist"

    useEffect(() => {
        if (!q) return;

        const fetch = async() => {
            try {
                setLoading(true)
                
                const response = await artistListService(q, type)

                setArtists(response)
            } catch (error) {
                console.log({"error": error})
            } finally {
                setLoading(false)
            }
        }
        fetch();
    }, [q])


    return (
        <div>
            {loading ? (
                <Loading type="data"/>
            ) : (
                artists.map(artist =>
                    <div className="flex flex-col gap-y-2 py-1" key={artist.id}>
                        <ArtistCard
                            artist={artist}
                        />
                        <Divider/>
                    </div>
                )
            )}
        </div>
    )
}