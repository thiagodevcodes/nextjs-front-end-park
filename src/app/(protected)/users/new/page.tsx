"use client";

import { GlobalContext } from "@/contexts/GlobalContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const AdminUsersNew: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const [message, setMessage] = useState(""); 
  const { sessionInfo } = useContext(GlobalContext);

  const baseUrl = "http://localhost:8080";
  const token = sessionInfo?.accessToken;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 

    try {
      const response = await axios.post(baseUrl + "/api/users", formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token JWT
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
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setMessage("Usuário não autorizado");
        } else if (error.response.status === 422) {
          setMessage("Usuário já existente");
        } else {
          setMessage("Erro na resposta da solicitação.");
        }
        console.error("Erro na resposta da solicitação:", error.response);
      } else {
        console.error("Erro ao cadastrar usuário:", error);
        setMessage("Erro ao cadastrar usuário.");
      }
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: Number(value) });
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <h1 className="text-3xl font-bold">Cadastro de Usuário</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input 
          type="text" 
          className="w-80"
          placeholder="Nome" 
          value={formData.person.name} 
          onChange={(e) => setFormData({ ...formData, person: { ...formData.person, name: e.target.value } 
          })}
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

        <Button className="bg-black" type="submit">Cadastrar</Button>
      </form>
    </div>
  );
};

export default AdminUsersNew;