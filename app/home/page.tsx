import HomeClient from "@/components/client/HomeClient/HomeClient";
import { Loading } from "@/components/common/Loading";
import { homeService } from "@/services/deezer";
import { Suspense } from "react";

export default async function HomePage() {

    const data = await homeService()

    return (
        <Suspense fallback={<Loading type="data"/>}>
            <HomeClient data={data}/>
        </Suspense>    
    )
}