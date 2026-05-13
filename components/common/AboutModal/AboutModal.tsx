import { Divider } from "../Divider";


export default function AboutModal() {


    return (
        <div className="flex flex-col gap-y-6 px-8 py-10 w-full">
            <div className="cursor-pointer text-white">
                <h4 className="font-semibold text-sm md:text-lg">Condiciones del Servicio de YouTube</h4>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Lee las Condiciones del Servicio de YouTube
                </p>
                <Divider/>
            </div>
            <div className="cursor-pointer text-white">
                <h4 className="font-semibold text-sm md:text-lg">Política de Privacidad de Google</h4>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Lee la política de privacidad                
                </p>
                <Divider/>
            </div>
        </div>
    )
}