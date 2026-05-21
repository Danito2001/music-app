"use client"

import { HeroUIProvider, ToastProvider } from "@heroui/react"
import ReduxProvider from "@/store/Provider"
import { UIProvider } from "@/context/ui.context"
import AudioPlayerProvider from "@/context/audio.context"
import { OptionProvider } from "@/context/option.context"
import { ScreenProvider } from "@/context/screen.context"
import { FloatingOptionsProvider } from "@/context/playback.context"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider placement="bottom-left" />
            <ReduxProvider>
                <UIProvider>
                    <ScreenProvider>
                        <OptionProvider>
                            <AudioPlayerProvider>
                                <FloatingOptionsProvider>
                                    {children}
                                </FloatingOptionsProvider>
                            </AudioPlayerProvider>
                        </OptionProvider>
                    </ScreenProvider>
                </UIProvider>
            </ReduxProvider>
        </HeroUIProvider>
    )
}