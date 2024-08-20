import { getServerSession } from "next-auth";
import nextAuthOptions from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import Login from "@/components/Admin";

interface SessionLayoutProps {
    children: React.ReactNode;
}

const SessionLayout = async ({ children }: SessionLayoutProps) => {
    const session = await getServerSession(nextAuthOptions)

    if(!session) {
        redirect("/")
    }

    return (
        <Login>
            { children }
        </Login>         
    )
}

export default SessionLayout;