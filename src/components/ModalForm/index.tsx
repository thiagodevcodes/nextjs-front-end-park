import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { fetchUser, handleCreate, handleUpdate } from "@/services/axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps {
    url: string;
    method: string;
    title?: string;
    className?: string
    children?: React.ReactNode;
    id?: number
  }

interface FormData {
    username: string;
    password: string;
    person: Person;
    role: number;
}

interface Person {
    name: string;
    email: string;
    phone: string;
    cpf: string;
}

const Modal = ({ url, method, title, children, id }: ModalProps) => {   
    return (
        <Dialog>    
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo corretamente para submeter o formulário
                    </DialogDescription>
                </DialogHeader>

                { children }


            </DialogContent>
            <DialogTrigger className="px-4 py-1">{title}</DialogTrigger>
        </Dialog>
    )
}

export default Modal;