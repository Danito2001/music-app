import { Loading } from "@/components/common/Loading";
import SearchClient from "@/components/client/SearchClient/SearchClient"
import { searchService } from "@/services/deezer"
import { Suspense } from "react";

type Props = {
	searchParams: {
		q?: string;
		limit?: number;
	};
};

export default async function SearchPage({searchParams}: Props) {

	const q = searchParams.q ?? "";
	const limit = searchParams.limit ?? 0

	const data = await searchService({
		q: q,
		limit: limit
	})

	const uniqueTracks = Array.from(
		new Map(data.tracks.map(track => [track.id, track])).values()
	)

	const hasData = Object.values(data).some(arr => arr.length > 0)

	return (
		<Suspense fallback={<Loading type="data"/>}>
			<div className="flex flex-col gap-y-8 lg:mx-20">
				{hasData ? (
					<SearchClient 
						initialData={{
							...data,
							tracks: uniqueTracks
						}}
						q={q}
					/>
				) : (
					<span>No se encontraon datos</span>
				)}
			</div>	
		</Suspense>
	)
}