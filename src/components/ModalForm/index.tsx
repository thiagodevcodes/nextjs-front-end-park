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
    Icon?: React.ElementType;
    trigger?: string;
    title?: string;
    className?: string
    children?: React.ReactNode;
    id?: number,
    description?: string,

  }

  

const Modal = ({ trigger, title, children, description, Icon }: ModalProps) => { 
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog>    
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        { description }
                    </DialogDescription>
                </DialogHeader>

                { children }


            </DialogContent>
            <DialogTrigger className=" px-4 py-1">{Icon ? <Icon/> : trigger}</DialogTrigger>
        </Dialog>
    )
}

export default Modal;