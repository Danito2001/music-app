import { Button } from "@heroui/react";
import { useState } from "react";
import { TbWorld } from "react-icons/tb";
import { MdOutlineLock } from "react-icons/md";
import { Privacity } from "@/interfaces/common.interface";

interface OptionsProps {
    selected: Privacity;
    setSelected: (value: Privacity) => void;
}

export default function OptionSelect({ selected, setSelected }: OptionsProps) {

    const [ open, setOpen ] = useState(false);

    const handleSelect = ( value:Privacity ) => {
        setSelected(value);
        setOpen(false);
    };

    return (
        <div className="relative inline-block w-48">
            <Button
                onPress={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2 border-b border-b-neutral-700 bg-neutral-800 text-white"
            >
                <span className="flex items-center gap-2">
                    <TbWorld size={20} />
                    {selected === "public" ? "Pública" : "Privada"}
                </span>
                <span>▾</span>
            </Button>

            {open && (
                <div className="absolute w-full bg-neutral-900 text-white">
                    <Button
                        onPress={() => handleSelect("public")}
                        startContent={<TbWorld size={20} />}
                        className="w-full flex justify-start gap-2 px-3 py-2 text-left hover:bg-neutral-700"
                    >
                        Pública
                    </Button>
                    <Button
                        onPress={() => handleSelect("private")}
                        className="w-full flex justify-start gap-2 px-3 py-2 text-left hover:bg-neutral-700"
                        startContent={<MdOutlineLock size={20}/>}
                    >
                        Privada
                    </Button>
                </div>
            )}
        </div>
    );
}
