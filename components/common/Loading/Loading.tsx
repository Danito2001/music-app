type Loading = "player" | "data"

interface LoadingStyle {
    container: string;
    spinner: string;
}

const loadingClasses: Record<Loading, LoadingStyle> = {
    "player": {
        container: "",
        spinner: "spinner neutral"
    },
    "data": {
        container: "w-full h-[80vh]",
        spinner: "spinner"
    }
}

export default function Loading({type}: {type: Loading}) {
    return (
        <div className={`${loadingClasses[type].container} flex items-center justify-center rounded-md`}>
            <div className={loadingClasses[type].spinner}/>
        </div>
    )
}
