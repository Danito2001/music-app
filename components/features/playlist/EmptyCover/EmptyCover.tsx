import { Icons } from "@/icons";


export default function EmptyCover() {
    return (
        <div className="flex items-center justify-center rounded-md bg-white/10 w-full h-full">
            <Icons.Playlist size={50} className="text-white/20" />
        </div>
    )
}