import ChannelClient from "@/components/client/ChannelClient/ChannelClient";
import { channelService } from "@/services/deezer";
import { Suspense } from "react";
import { Loading } from "@/components/common/Loading";

type Params = {
    id: string, 
    artistName: string
}

export default async function Channel({params}: {params: Params}) {

    const artistId = params.id;
    
    const response = await channelService(artistId)

    if (!response.ok) return null;

    return (
        <Suspense fallback={<Loading type="data"/>}>
            <ChannelClient data={response.data}/>
        </Suspense>
    ) 
}