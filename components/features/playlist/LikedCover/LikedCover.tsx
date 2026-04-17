import { Icons } from "@/icons";

export default function LikedCover() {
    return (
            <div className="group relative flex items-center justify-center rounded-md w-[160px] h-[160px] bg-gradient-to-t from-pink-400 to-purple-500">
                <Icons.Liked size={100} className="relative z-0" />
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
            </div>
    )
}