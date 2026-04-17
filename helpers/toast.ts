// toast.utils.ts
import { store } from "@/store/store";
import { showToast } from "@/store/toast/toast.slice";

export function toast(title: string | null, description?: string) {
    store.dispatch(showToast({ title, description }));
}