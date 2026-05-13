import type { Playlist } from "@/interfaces/song.interface";
import Link from "next/link";

export default function Playlist({ playlist, isActive }: { playlist: Playlist, isActive: boolean }) {

    return (
        <section className={`rounded-lg ${isActive ? "bg-white/10" : ""}`}>
            <Link 
                key={playlist.id} 
                href={{
                    pathname: "/playlist",
                    query: { list: playlist.id, type: "playlist" }
                }}
                className="block p-2 rounded-lg hover:bg-white/10 transition-background"
            >
                <h5 className="font-semibold text-sm">{playlist.title}</h5>
                <span className="text-xs opacity-80">Nombre de usuario</span>
            </Link>
        </section>
    )

}