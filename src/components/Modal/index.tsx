import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/GlobalContext";
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
        const fetchUser = async () => {
          try {
            if(method != "PUT") return

            const response = await axios.get(baseUrl + `/api/users/find?id=${id}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              },
            });
    
            if (response.status === 200) {
              console.log(response.data)
              setFormData({    
                username: response.data.username,
                password: response.data.password,
                role: response.data.role,
                person: {
                  name: response.data.person.name,
                  cpf: response.data.person.cpf,
                  email: response.data.person.email,
                  phone: response.data.person.phone
                }
              })
            }
          } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
              if (error.response.status === 401 || error.response.status === 403) {
                setMessage("Usuário não autorizado");
              } else {
                setMessage("Erro ao buscar usuários.");
              }
              console.error("Erro na resposta da solicitação:", error.response);
            } else {
              console.error("Erro ao buscar usuários:", error);
              setMessage("Erro ao buscar usuários.");
            }
          }
        };
        fetchUser();
    }, [baseUrl, token]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios({
                method: method,
                url: baseUrl + `/api/${url}`,
                data: formData,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setMessage("Usuário cadastrado com sucesso");
                setFormData({
                    username: "",
                    password: "",
                    person: {
                        name: "",
                        email: "",
                        cpf: "",
                        phone: ""
                    },
                    role: 2,
                });
            }

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    setMessage("Usuário não autorizado");
                } else if (error.response.status === 422) {
                    setMessage("Usuário já existente");
                } else {
                    setMessage("Erro na resposta da solicitação.");
                }
            } else {
                setMessage("Erro ao cadastrar usuário.");
            }
        }
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: Number(value) });
    };

    return (
        <Dialog>
            <DialogTrigger className="px-4 py-1">{title}</DialogTrigger>
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
                    <Input
                        type="password"
                        placeholder="Senha"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="CPF"
                        value={formData.person.cpf}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, cpf: e.target.value } })}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Email"
                        value={formData.person.email}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, email: e.target.value } })}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Telefone"
                        value={formData.person.phone}
                        onChange={(e) => setFormData({ ...formData, person: { ...formData.person, phone: e.target.value } })}
                        required
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
        </Dialog>
    )
}

export default Modal;