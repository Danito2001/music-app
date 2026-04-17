import { getGridImages } from "@/helpers/getGridImages";
import classNames from "classnames";
import { EmptyCover } from "../EmptyCover";
import Image from "next/image";

interface CoverImageProps {
    images: string[];
    size: "sm" | "md" | "lg";
}

export function CoverImage({ images, size }: CoverImageProps) {

    const gridImages = getGridImages(images);

    const isEmpty = gridImages.length === 0;
    const isSingle = gridImages.length === 1;
    const isGrid = gridImages.length > 1;

    return (
        <div className={classNames("relative overflow-hidden", {
            "w-[50px] h-[50px]": size === "sm" && (isSingle || isEmpty),
            "w-[160px] h-[160px]": size === "md" && (isSingle || isEmpty),
            "w-40 h-40": size === "lg" && (isSingle || isEmpty),
            "aspect-square w-[50px] h-[50px] grid grid-cols-2 grid-rows-2": size === "sm" && isGrid,
            "aspect-square w-40 grid grid-cols-2 grid-rows-2": isGrid
        })}>

            {isEmpty && <EmptyCover />}

            {isSingle && (
                <div className="relative w-full h-full">
                    <Image src={gridImages[0]} fill className="object-cover" alt="" />
                </div>
            )}

            {isGrid && gridImages.map((img, i) => (
                <div key={i} className="relative w-full h-full">
                    <Image src={img} fill className="object-cover" alt="" />
                </div>
            ))}
        </div>
    )
}