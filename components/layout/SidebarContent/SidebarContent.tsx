import { useUIContext } from "@/context/ui.context";
import { useScrolled } from "@/hooks/common/useScrolled";
import { RootState } from "@/store/store";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { SidebarModule } from "../SidebarModule";
import { Icons } from "@/icons";
import { Button } from "@heroui/react";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { Playlist } from "@/components/features/playlist/Playlist";
import { useSearchParams } from "next/navigation";


export default function SidebarContent() {

    const { sidebarOpen, modalOpen, playerOpen } = useUIContext();
    const scrolled = useScrolled();

    const playlists = useSelector((state: RootState) => state.playlist.playlists);
    const currentSong = useSelector((state: RootState) => state.player.currentSongId)

    const searchParams = useSearchParams();
    const activeList = searchParams.get("list");

    const isActive = (id: string) => activeList === id;

    return (
        <nav
            className={classNames("fixed p-4 z-40 space-y-4 transition-colors sm:block",
                sidebarOpen ? "w-[220px] bg-primary border-r border-r-white/10" : "hidden sm:w-[75px]",
                currentSong ? "h-[calc(100vh-70px)]" : "h-full",
                playerOpen
                    ? "bg-primary border-r border-r-white/10"
                    : scrolled ? "bg-primary border-r border-r-white/10" : "bg-transparent border-none",
            )}
        >
            <div className="flex flex-col gap-y-6 pt-[60px] h-full">
                <div className="flex flex-col">
                    <SidebarModule isOpen={sidebarOpen} icon={<Icons.Home size={20} />} label={"Principal"} href={"/"} />
                    <SidebarModule isOpen={sidebarOpen} icon={<Icons.Library size={20} />} label={"Biblioteca"} href={"/library"} />
                </div>
                {
                    sidebarOpen && (
                        <>
                            <div className="border-t border-t-white/10 mt-auto" />
                                <Button
                                    startContent={<FaPlus size={20} />}
                                    className="flex justify-center p-2 hover:bg-white/20 transition-background rounded-full gap-x-4 bg-white/10 w-full"
                                    onPress={() => modalOpen({
                                        type: "playlistForm", props: {
                                            title: "Nueva Playlist"
                                        }
                                    })}
                                >
                                    <span className="text-xs font-semibold">Nueva Playlist</span>
                                </Button>
                            <div className="flex-1 scrollbar">
                                <Link href={"/playlist?list=LM"}
                                    className={`block p-2 rounded-lg hover:bg-white/10 transition-background 
                                        ${isActive("LM") && "bg-white/10"}`}
                                >
                                    <h5 className="font-semibold text-sm">Musica que te gustó</h5>
                                    <span className="text-xs opacity-80">Playlist autogenerada</span>
                                </Link>
                                {playlists.map(playlist =>
                                    <Playlist
                                        key={playlist.id}
                                        playlist={playlist}
                                        isActive={isActive(playlist.id)}
                                    />
                                )}
                            </div>
                        </>
                    )
                }
            </div>

        </nav>
    )
}