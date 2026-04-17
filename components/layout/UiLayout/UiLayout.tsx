"use client"

import { useUIContext } from "@/context/ui.context"
import { Navbar } from "../Navbar"
import { PlayerBar } from "../../features/player/PlayerBar"
import ModalRender from "../ModalRender/ModalRender"
import ToastRendered from "../../common/ToastRendered/ToastRendered"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "../Sidebar"
import classNames from "classnames"

export default function UiLayout({ children }: { children: React.ReactNode }) {

    const { sidebarOpen, setColor, color } = useUIContext()
    const pathname = usePathname()

    const sectionPaths = ["/playlist", "/listen_again", "/librery"]

    const isHome = pathname === "/"
    const isSection = sectionPaths.some(path => pathname.startsWith(path))
    const isValidPath = isHome || isSection

    useEffect(() => {
        if (isValidPath) {
        const randomDarkColor = `hsl(${Math.random() * 360}, 60%, 5%)`
        setColor(randomDarkColor)
        }
    }, [pathname])

    return (
        <>
            <ToastRendered />
                <div
                    style={{
                        background: isValidPath
                            ? `linear-gradient(to bottom, ${color}, #000000)`
                            : "#000000",
                        }}
                    className="flex min-h-screen"
                >
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                        <Navbar />
                        <main className={classNames(
                            "mb-[80px]",
                            "ml-0 px-2 sm:ml-[90px] sm:px-12",
                            sidebarOpen && "lg:ml-[220px]"
                        )}>
                            <ModalRender />
                            {children}
                        </main>
                    </div>
                </div>

            <PlayerBar />
        </>
    )  
}