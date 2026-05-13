import { Button } from "@heroui/react";
import { useState } from "react";

import GeneralModal from "../GeneralModal/GeneralModal";
import { createPortal } from "react-dom";
import PrivacityModal from "../PrivacityModal/PrivacityModal";
import RecommendationsModal from "../RecommendationsModal/RecommendationsModal";
import AboutModal from "../AboutModal/AboutModal";
import { Icons } from "@/icons";
import { Divider } from "../Divider";

type ComponentsModal = "general" | "privacity" | "recommendations" | "language" | "about";

interface ConfigProps {
    onClose: () => void;
}

const views: { value: ComponentsModal, label: string }[] = [
    { value: "general", label: "General" },
    { value: "privacity", label: "Privacidad y datos" },
    { value: "recommendations", label: "Recomendaciones" },
    { value: "about", label: "Acerca de" }
];

export default function ConfigModal({ onClose }: ConfigProps) {

    const [ view, setView ] = useState<ComponentsModal>("general")

    const RenderComponents = () => {

        switch (view) {
            case "general": return <GeneralModal />
            case "privacity": return <PrivacityModal />
            case "recommendations": return <RecommendationsModal />
            case "about": return <AboutModal />
        }
    }

    return (
        createPortal(
            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">
                <div className="flex flex-col w-full max-w-md md:max-w-xl h-[80vh] border border-neutral-700 bg-neutral-800 rounded-md">

                    <div className="flex items-center justify-between p-4">
                        <h3 className="text-xl font-semibold text-white">Configuración</h3>
                        <Button 
                            size="lg" 
                            onPress={onClose} 
                            isIconOnly
                        >
                            <Icons.Close size={25}/>
                        </Button>
                    </div>

                    <Divider/>

                    <div className="flex h-full">
                        <div className="flex flex-col h-full">
                            {views.map(({ label, value }) => (
                                <Button
                                    className={`text-start text-sm pr-20 ${view === value ? "bg-neutral-700" : "bg-none"}`}
                                    key={value}
                                    onPress={() => setView(value)}
                                >
                                    {label.charAt(0).toUpperCase() + label.slice(1)}
                                </Button>
                            ))}
                        </div>
                        <div className="border-r border-r-neutral-700 h-full" />

                        <RenderComponents />
                    </div>
                </div>
            </div>, document.body
        )
    )
}