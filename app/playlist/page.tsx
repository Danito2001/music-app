import { PlaylistClient } from "@/components/client/PlaylistClient";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PlaylistClient />
        </Suspense>
    );
}