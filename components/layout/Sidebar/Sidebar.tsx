import { Suspense } from "react";
import { SidebarContent } from "../SidebarContent";

export default function Sidebar() {

    return (
        <Suspense fallback={null}>
            <SidebarContent />
        </Suspense>
    );
}