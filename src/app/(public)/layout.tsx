import { getServerSession } from "next-auth";
import nextAuthOptions from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";

interface SessionLayoutProps {
    children: React.ReactNode;
}

const SessionLayout = async ({ children }: SessionLayoutProps) => {
    const session = await getServerSession(nextAuthOptions)

    if(session) {
        redirect("/dashboard")
    }

    return <>
        { children }   
    </>       
       
}

export default SessionLayout;