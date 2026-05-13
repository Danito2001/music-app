import { Divider } from "../Divider";


export default function PrivacityModal() {

    return (
        <div className="flex flex-col px-8 py-10 gap-y-6 w-full">
            <div className="text-white">
                <h4 className="font-semibold text-sm md:text-lg">Borrar el historial de reproducciones</h4>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Borra el historial de reproducciones de esta cuenta en todos los dispositivos.
                </p>
                <Divider/>
            </div>
            <div>
                <div className="flex justify-between">
                    <h4 className="pb-4 font-semibold text-sm md:text-lg text-white">Pausar el historial de reproducciones</h4>
                </div>
                <Divider/>
            </div>
            <div className="text-white">
                <h4 className="font-semibold text-sm md:text-lg">Borrar el historial de busqueda</h4>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Borra el historial de búsqueda de esta cuenta en todos los dispositivos.
                </p>
                <Divider/>
            </div>
        </div>
    )

}