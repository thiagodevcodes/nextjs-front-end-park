"use client"

import { GlobalContext } from "@/contexts/GlobalContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

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

const AdminUsersEdit = ({ params }: { params: { id: string } }) => {
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

  const [message, setMessage] = useState(""); 
  const { sessionInfo } = useContext(GlobalContext)

  // const baseUrl = "https://auth-spring-security-jwt.fly.dev"
  const baseUrl = "http://localhost:8080"

  const token = sessionInfo?.accessToken;
  const id = params.id

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
      //old="/api/users"
      const response = await axios.put(baseUrl + `/api/users?id=${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token JWT
        }
      });

      if(response.status == 200) {
        setMessage("Usuário atualizado com sucesso")
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
      console.log(error)
      if (axios.isAxiosError(error) && error.response) {       
        if(error.response.status == 401 || error.response.status == 403) setMessage("Usuário não autorizado");
        if(error.response.status == 422) setMessage("Usuário já existente")
        console.error("Erro na resposta da solicitação:", error.response);
      } else {
        console.error("Erro ao cadastrar usuário:", error);
        setMessage("Erro ao cadastrar usuário.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center h-screen">
      <h1>Edição de Usuário</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nome"
          value={formData.person.name}
          onChange={(e) => setFormData({ 
            ...formData, 
            person: { ...formData.person, name: e.target.value } 
          })}
          required
        />
        <input
          type="text"
          placeholder="Nome de usuário"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: Number(e.target.value) })}>
          <option value={2}>BASIC</option>
          <option value={1}>ADMIN</option>
        </select>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}

export default AdminUsersEdit;