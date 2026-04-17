"use client"

import { HeroUIProvider, ToastProvider } from "@heroui/react"
import ReduxProvider from "@/store/Provider"
import { UIProvider } from "@/context/ui.context"
import AudioPlayerProvider from "@/context/audio.context"
import { OptionProvider } from "@/context/option.context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
        <ToastProvider placement="bottom-left" />
        <ReduxProvider>
            <UIProvider>
                <OptionProvider>
                    <AudioPlayerProvider>
                        {children}
                    </AudioPlayerProvider>
                </OptionProvider>
            </UIProvider>
        </ReduxProvider>
    </HeroUIProvider>
  )
}