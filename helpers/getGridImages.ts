

export const getGridImages  = (images: string[]) => {
    if (images.length === 0) return [];

    if (images.length === 1) return images;

    return Array.from({length:4}, (_,i) => images[i % images.length])
}