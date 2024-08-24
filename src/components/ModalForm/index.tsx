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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    const [message, setMessage] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
        person: {
            name: "",
            email: "",
            cpf: "",
            phone: ""
        },
        role: 2
    })
    
    const { sessionInfo } = useContext(GlobalContext);
    const token = sessionInfo?.accessToken;
    const baseUrl = "http://localhost:8080";

    useEffect(() => {
        if(method != "PUT") return
        fetchUser(token, id).then((res) => {
            setFormData({
                username: res.username,
                password: res.password,
                person: {
                    name: res.person.name,
                    email: res.person.email,
                    cpf: res.person.cpf,
                    phone: res.person.phone
                },
                role: res.role
            })
        })

    }, [baseUrl, token]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        switch (method) {
            case "POST":
                handleCreate(formData, token, url).then(() => {
                    setMessage("Usuário Criado com sucesso")
                }).catch(() => {
                    setMessage("Erro ao criar usuário")
                })
                break;
            case "PUT":
                handleUpdate(formData, token, url, id).then(() => {
                    setMessage("Usuário atualizado com sucesso")
                }).catch(() => {
                    setMessage("Erro ao atualizar usuário")
                })
            default:
                break;
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: Number(value) });
    };

    return (
        <Dialog>    
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
                    <DialogDescription>
                        Preencha os campos abaixo corretamente para submeter o formulário
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                        type="text"
                        placeholder="Nome"
                        value={formData.person.name}
                        onChange={(e) => setFormData({...formData, person: { ...formData.person, name: e.target.value }})}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Nome de usuário"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    { method == "POST" && 
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}   
                            required      
                        /> 
                    }
                    <Input
                        type="text"
                        placeholder="CPF"
                        value={formData.person.cpf}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, cpf: e.target.value } })}
                    />
                    <Input
                        type="text"
                        placeholder="Email"
                        value={formData.person.email}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, email: e.target.value } })}
                    />
                    <Input
                        type="text"
                        placeholder="Telefone"
                        value={formData.person.phone}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, phone: e.target.value } })}
                    />

                    <Select onValueChange={handleRoleChange} value={formData.role.toString()}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Permissão" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2">BASIC</SelectItem>
                            <SelectItem value="1">ADMIN</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <div className="text-center">
                        { message ? message : null }
                    </div>
                
                    <Button className="bg-black" type="submit">Salvar</Button>
                </form>
            </DialogContent>
            <DialogTrigger className="px-4 py-1">{title}</DialogTrigger>
        </Dialog>
    )
}

export default Modal;