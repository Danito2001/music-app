"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useUIContext } from "@/context/ui.context";


export default function UserProfile() {

    const [ openMenu, setOpenMenu ] = useState(false);
    const { modalOpen } = useUIContext();
    

    return (
        <div className="relative text-white">
            <div>
                <Button
                    radius="none"
                    onPress={() => setOpenMenu(prev => !prev)}
                >
                    <Image
                        className="rounded-full"
                        height={30}
                        width={30}
                        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                        alt=""
                    />
                </Button>
            </div>
            {
                openMenu && (
                    <div className="absolute right-0 flex flex-col rounded-lg py-4 w-[300px] h-[400px] bg-neutral-800">
                        <div className="px-6">
                            <div className="flex items-center space-x-2">
                                <Image
                                    className="rounded-full"
                                    height={50}
                                    width={50}
                                    src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                                    alt=""
                                />
                                <div>
                                    <h5>Nombre de usuario</h5>
                                    <span>@nombreusuario</span>
                                </div>
                            </div>
                            <span className="text-sm cursor-pointer text-blue-500">Administra tu cuenta de Google</span>
                        </div>

                        <div className="border-t border-t-white/10 my-auto" />

                        <div className="flex flex-col w-full">
                            <Button
                                className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                startContent={<FaCircleUser size={18} />}
                            >
                                <span className="text-sm">Tu canal</span>
                            </Button>
                            <Button
                                className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                startContent={<FaCircleUser size={18} />}
                            >
                                <span className="text-sm">Cambiar de cuenta</span>
                            </Button>
                            <div>
                                <Button
                                    className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                    startContent={<FaCircleUser size={18} />}
                                >
                                    <span className="text-sm">Salir</span>
                                </Button>
                            </div>

                        </div>

                        <div className="border-t border-t-white/10 my-auto" />

                        <div>
                            <Button
                                className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                startContent={<FaCircleUser size={18} />}
                            >
                                Historial
                            </Button>
                            <Button
                                className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                startContent={<FaCircleUser size={18} />}
                                onPress={() => modalOpen({type: "config"})}
                            >
                                Configuración
                            </Button>
                            <Button
                                className="flex justify-start gap-x-2 w-full hover:bg-neutral-700"
                                startContent={<FaCircleUser size={18} />}

                            >
                                Ayuda
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}