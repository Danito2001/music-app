import { useSearchParams } from "next/navigation";

const COLLECTION_TYPES = ["playlist", "album", "liked", "artist"] as const;

export type CollectionType = typeof COLLECTION_TYPES[number];


const isCollectionType  = (value: string): value is CollectionType => 
    (COLLECTION_TYPES as readonly string[]).includes(value)


export function useCollectionType(): CollectionType | null {
    const params = useSearchParams();

    const raw = params.get("type");

    if (!raw) return null;

    return isCollectionType(raw) ? raw : null;
}
