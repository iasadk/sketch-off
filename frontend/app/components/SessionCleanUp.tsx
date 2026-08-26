"use client";

import { clearSessionStorage } from "@/lib/util";
import { useEffect } from "react";

export default function SessionCleanup() {
    useEffect(() => {
        const handleBeforeUnload = () => {
            clearSessionStorage()
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return null;
}