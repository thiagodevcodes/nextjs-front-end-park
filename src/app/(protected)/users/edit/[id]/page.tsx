"use client"

import { GlobalContext } from "@/contexts/GlobalContext";
import axios from "axios";
import React, { useContext, useState } from "react";

interface FormData {
  name: string,
  username: string
  password: string,
  role: string
}

const AdminUsersEdit: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    password: "",
    role: "BASIC",
  })

  const [message, setMessage] = useState(""); 
  const { sessionInfo } = useContext(GlobalContext)

  // const baseUrl = "https://auth-spring-security-jwt.fly.dev"
  const baseUrl = "http://localhost:8080"

  const token = sessionInfo?.accessToken;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 

    try {
      //old="/api/users"
      const response = await axios.post(baseUrl + "/users/${id}", formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Token JWT
        }
      });

      if(response.status == 200) {
        setMessage("Usuário cadastrado com sucesso")
        setFormData({
          name: "",
          username: "",
          password: "",
          role: "BASIC",
        })
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
      <h1>Cadastro de Usuário</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
          <option value="BASIC">BASIC</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default AdminUsersEdit;