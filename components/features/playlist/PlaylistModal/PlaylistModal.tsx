
import { useForm } from "@/hooks/common/useForm";
import { Button, Form, Input, Textarea } from "@heroui/react";
import PrivacitySelect from "@/components/common/OptionSelect/OptionSelect";
import { useDispatch } from "react-redux";
import { createPlaylist, updatePlaylist } from "@/store/playlist/playlistSlice";
import { useUIContext } from "@/context/ui.context";
import { createPortal } from "react-dom";
import { nanoid } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { Privacity } from "@/interfaces/common.interface";
import { Playlist } from "@/interfaces/song.interface";


interface ModalProps {
    playlistId?: string
    title: string;
    description?: string;
    privacity?: Privacity;
}

export default function PlaylistModal({ playlistId, title = "", description = "", privacity = "public" }: ModalProps) {

    const { closeModal } = useUIContext();

    const dispatch = useDispatch();
    const router = useRouter();

    const { formValue, handleChange, resetValues, setFieldValue } = useForm<Playlist>({
        id: nanoid(),
        title: title,
        description: description,
        privacity: privacity,
        year: new Date().getFullYear().toString(),
        duration: "0:00",
        songIds: [],
        cover: [],
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formValue.title.length < 1 || formValue.title.trim() === "") {
            return;
        }

        if (playlistId) {
            dispatch(updatePlaylist({
                playlistId,
                data: {
                    title: formValue.title,
                    description: formValue.description,
                    privacity: formValue.privacity
                }
            }))

        } else {

            dispatch(createPlaylist(formValue))
            router.push(`/playlist?list=${formValue.id}`)
        }
        closeModal()
        resetValues()
    }

    return (
        <>
            {createPortal(
                <Form
                    onSubmit={handleSubmit}
                >
                    <div
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
                    >
                        <div className="flex flex-col p-4 gap-y-4 rounded-md w-full max-w-md bg-neutral-800">
                            <h3 className="text-xl font-semibold">{title ?? "Nueva Playlist"}</h3>
                            <Input
                                isRequired
                                placeholder="Titulo"
                                classNames={{ input: "p-2" }}
                                name="title"
                                value={formValue.title}
                                onChange={handleChange}
                            />
                            <Textarea
                                placeholder="Descripción"
                                size="sm"
                                maxRows={3}
                                classNames={{ input: "p-2 resize-none" }}
                                name="description"
                                value={formValue.description}
                                onChange={handleChange}
                            />

                            <PrivacitySelect
                                selected={formValue.privacity}
                                setSelected={(value) => setFieldValue("privacity", value)}
                            />

                            <div className="flex justify-end">
                                <Button
                                    as={"button"}
                                    onPress={closeModal}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    size="sm"
                                    radius="full"
                                    className="px-3 py-2  text-sm text-black bg-white"
                                    type="submit"
                                >
                                    {playlistId ? "Guardar" : "Crear"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Form>, document.body
            )}
        </>
    )
}
