import usePlayerActions from "@/hooks/features/player/usePlayerActions";
import { Icons } from "@/icons";
import { UiArtist, UiSong } from "@/interfaces/song.interface";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

type ArtistCardVariant = "default" | "large" | "first";

interface ArtistProps {
    artist: UiArtist;
    variant?: ArtistCardVariant;
    tracks?: UiSong[]
}

export default function ArtistCard({ artist, variant = "default", tracks }: ArtistProps) {

    const playRandom = usePlayerActions().playRandom;

    const isLarge = variant === "large";
    const isFirst = variant === "first";

    const variants = {
        default: { size: 60 },
        first: { size: 90 },
        large: { size: 160 }
    }

    const size = variants[variant].size;

    return (
        <div className={`flex shrink-0 gap-x-6 min-w-0 ${isLarge ? "flex-col " : "flex-row"}`}>
            <Link
                className="relative group"
                href={`/channel/${artist.id}/${artist.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
                <Image
                    className="rounded-full"
                    width={size}
                    height={size}
                    src={artist.cover_profile}
                    alt={artist.name}
                />
                <div className="group-hover:bg-black/40 absolute inset-0"/>
            </Link>
            <div className={`flex flex-col gap-y-1 ${isLarge ? "items-center" : "items-start"} justify-center`}>
                <span className={`font-semibold ${isFirst ? "text-xl" : "text-sm"}`}>{artist.name}</span>
                <div className="opacity-80 text-sm">
                    {variant !== "large" && <span>Artista • </span>}
                    <span>{artist.fans && `Público mensual: ${artist.fans.slice(0, 2)}M`}</span>
                </div>
                {isFirst && tracks && (
                    <Button
                        size="sm"
                        className="flex justify-center py-2 rounded-3xl bg-white hover:bg-white/80"
                        startContent={<Icons.Shuffle size={15} className="text-black" />}
                        onPress={() => playRandom(tracks)}
                    >
                        <span className="text-black text-sm">Aleatorio</span>
                    </Button>
                )}
            </div>
        </div>
    )
}