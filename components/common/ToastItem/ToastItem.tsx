import { Icons } from "@/icons";
import { removeToast, Toast } from "@/store/toast/toast.slice";
import { Button } from "@heroui/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function ToastItem({ toast }: { toast: Toast }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast.id, dispatch]);

    return (
        <div className="flex flex-col p-3 rounded-lg min-w-[250px] bg-neutral-900 text-white">
            <div className={`flex ${!toast.title ? "items-center" : "items-start"} justify-between`}>
                <div className="flex flex-col">
                    {toast.title && (
                        <p className="font-semibold leading-tight">{toast.title}</p>
                    )}
                    {toast.description && (
                        <p className={`text-sm opacity-70 ${!toast.title ? "mt-1" : ""}`}>
                            {toast.description}
                        </p>
                    )}
                </div>

                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => dispatch(removeToast(toast.id))}
                >
                    <Icons.Close size={20} />
                </Button>
            </div>
        </div>
    );
}