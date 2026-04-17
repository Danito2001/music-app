import { OptionKeyResult } from "@/interfaces/common.interface";

export const getOptionKey = (type: OptionKeyResult["type"], id?: OptionKeyResult["id"]): OptionKeyResult => {
    return {
        type,
        optionKey: id ? `${type}-${id}` : `${type}` 
    }
}
    