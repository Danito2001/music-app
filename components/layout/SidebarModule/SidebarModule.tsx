import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    isOpen: boolean;
    icon: React.ReactNode;
    label: string;
    href: string;
}

export default function SidebarModule({ isOpen, href, label, icon }: SidebarProps) {

    const pathname = usePathname();

    return (
        <Link
            href={href}
            className={classNames(
                "rounded-md gap-x-4 hover:bg-neutral-700 transition-background",
                {
                    "flex justify-start p-2": isOpen,
                    "flex flex-col items-center py-3 -mx-2": !isOpen,
                    "bg-neutral-800": pathname === href
                }
            )}
        >
            <div className={classNames({ "mx-auto": !isOpen })}>{icon}</div>
            <span className={`${isOpen ? "text-md" : "text-xs text-center"} `}>{label}</span>
        </Link>
    )
}