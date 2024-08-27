"use client"

import Login from "@/components/Admin";
import { useSession } from "next-auth/react";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionLayoutProps {
    children: React.ReactNode;
}

const SessionLayout = ({ children }: SessionLayoutProps) => {
    const { status } = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            setLoading(true);
        } else if (status === "authenticated") {
            setLoading(false);
        } else if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if(loading) {
        return (
            <div className="flex items-center justify-center h-dvh">
                <Spinner/>
            </div>  
        )
    }

    return (
        <Login>
            {children}
        </Login>
    );
}

export default SessionLayout;