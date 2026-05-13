
export type Privacity = "private" | "public";
export type Preferences = "liked" | "disliked" | "neutral";

export type PlaybackSource =
	| { type: "playlist"; id: string }
	| { type: "album"; id: string }
	| { type: "liked" }
	| null;

type OptionKey = {
    type:
    | "song"
    | "song-history"
    | "song-liked"
    | "song-search"
    | "song-queue"
    | "song-suggestion"
    | "playlist"
    | "player"
    | "pinned"
    
    id?: string
}

export type OptionKeyResult = {
    type: OptionKey["type"];
    id?: OptionKey["id"];
    optionKey: string;
};

export type PlayType =
    | "queue"
    | "suggestion-standalone"
    | "suggestion-queue"

    
export type ViewCard = 
    | "playlist"
    | "large"
    | "queue"
    | "search" 
    | "suggestion"
    | "suggestion-queue" 
