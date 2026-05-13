import { UiSong } from "./song.interface";

export interface QueueSong {
    queueId: string;
    song: UiSong;
    source: "manual" | "suggestion";
}

export interface QueueSections {
    manual: QueueSong[];
    suggestions: QueueSong[];
}