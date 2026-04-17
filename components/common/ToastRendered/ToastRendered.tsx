import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import ToastItem from "../ToastItem/ToastItem";


export default function ToastRendered() {
    const toasts = useSelector((state: RootState) => state.toast.toasts);

    return (
        <div className="fixed top-5 right-5 z-[999] flex flex-col gap-3">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast}/>
            ))}
        </div>
    );
}