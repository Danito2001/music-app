import { Switcher } from "@/components/common/Switcher";
import { Divider } from "../Divider";


export default function GeneralModal() {

    return (
        <div className="flex flex-col px-8 py-10 gap-y-6 w-full">
            <div>
                <div className="flex justify-between">
                    <h4 className="font-semibold text-sm md:text-lg">Modo restringido</h4>
                    <Switcher />
                </div>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    El modo restringido te permite ocultar los videos y las canciones con contenido para mayores de edad. No es 100% infalible, pero bloqueará la mayor parte de este tipo de contenido.
                </p>
                <Divider/>
            </div>
            <div>
                <div className="flex justify-between">
                    <h4 className="font-semibold text-sm md:text-lg">Mostrar la música que te gustó de YouTube</h4>
                    <Switcher />
                </div>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Los videos musicales que marcaste con “Me gusta” en otras apps de YouTube aparecerán en la playlist Canciones que te gustan 
                </p>
                <Divider/>
            </div>
        </div>
    )

}