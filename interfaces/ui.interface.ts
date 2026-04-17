import { IconType } from "react-icons/lib";

export interface Option {
    label: string;
    action: () => void;
    icon: IconType
}

export interface SearchProps {
    id: string;
    value: string;
}