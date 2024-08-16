'use client'

import { signIn } from "next-auth/react";
import { useState, FormEvent, useContext } from "react";
import Spinner from "@/components/Spinner";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { GlobalContext } from "@/contexts/GlobalContext";
import Image from "next/image";

const Admin: NextPage = () => {
    const { status } = useContext(GlobalContext); 
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    if (status === "loading") {
        return;
    }
  
    if (status === "authenticated") {
        redirect("/dashboard");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        });
        
        setLoading(false);

        if (result?.error) {
            if (result.status === 401 && result.error.slice(-3) === '401') {
                setError("Usuário ou senha inválidos");
            } else {
                setError("Não foi possível realizar o login");
            }
            return;
        } 
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center h-screen">
            <form onSubmit={handleSubmit}>
                {loading ? <Spinner /> :
                    <div className="flex flex-col gap-4 justify-center items-center p-10">
                        <div className="flex items-center flex-col">
                          <Image src={"/img/Parking.svg"} width={80} height={80} alt="logo"/>
                          <p className="font-bold text-3xl">SysPark</p>
                        </div>
                        <div className="flex gap-2 flex-col"> 
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Digite seu email..." 
                                name="username" 
                                id="username"
                                className="p-2 shadow-lg w-64 border border-black-400 rounded-lg bg-gray-200" 
                                type="text" 
                            />
                        </div>
                        <div className="flex gap-2 flex-col">
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Digite sua senha..." 
                                name="password" 
                                id="password"
                                className="p-2 w-64 shadow-lg border border-black-400 rounded-lg bg-gray-200" 
                                type="password" 
                            />
                        </div>

                        { error && <div className="text-red-700 text-sm">{error}</div>}
                        
                        <button 
                            type="submit" 
                            className="shadow-2xl shadow-black bg-black rounded-xl py-2 text-white w-full"
                        >
                            Entrar
                        </button>
                    </div>  
                }
            </form>
        </div>
    );
}

export default Admin