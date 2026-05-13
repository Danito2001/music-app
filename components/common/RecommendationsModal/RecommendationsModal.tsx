import { Divider } from "../Divider";


export default function RecommendationsModal() {

    return (
        <div className="px-8 py-10 w-full">
            <div className="pb-2 text-white">
                <h4 className="font-semibold text-sm md:text-lg">Mejora tus recomendaciones musicales</h4>
                <p className="pb-4 text-xs md:text-sm opacity-60">
                    Elige algunos artistas que te gusten
                </p>
            </div>
            <Divider/>
        </div>
    )

}