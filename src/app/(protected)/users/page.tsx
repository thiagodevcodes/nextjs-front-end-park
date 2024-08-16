"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Spinner from "@/components/Spinner"; 
import Table from "@/components/Table";
import { Users, Trash, UserPen } from "lucide-react";
import axios from "axios";
import { GlobalContext } from "@/contexts/GlobalContext";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Role {
  roleId: string;
  name: string
}

interface User {
  userId: string; 
  name: string;
  username: string
  idRole: number;
}

const AdminUsers: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState<string>("");
  
  const { sessionInfo } = useContext(GlobalContext);
  const token = sessionInfo?.accessToken;
  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(`${baseUrl}/api/users`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        if (response.status === 200) {
          console.log(response.data)
          setUsers(response.data);
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
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner/>
      </div>
      
    )
  }

  const handleAddUser = () => {
    router.push('/users/new');
  };

  return (
    <section className="mx-10 px-3 py-1 mb-4">
      <div className="flex justify-between my-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Users />
            <h1 className="font-bold text-3xl">Usuários</h1>
          </div>
          <span>Lista de todos os usuários do sistema</span>
          {message && <p>{message}</p>}
        </div>
        <button className="text-center bg-black text-white rounded-lg px-5 py-2 my-5" onClick={handleAddUser}>Adicionar</button>
      </div>

      <Table columns={["Nome", "Username", "Permissões"]}>
        { users.map((user) => (
          <tr key={user.userId}>
            <td className="p-3 text-center rounded-es-lg">{user.name}</td>
            <td className="p-3 text-center rounded-es-lg">{user.username}</td>
            <td className="p-3 text-center">
              {user.idRole == 1 ? "Admin" : "Normal"}
            </td>
            <td className="p-3 text-center rounded-ee-lg">
              <div className="flex gap-2 items-center justify-center">
                <button className="bg-red-600 text-white rounded-lg px-4 py-1"><Trash /></button>
                <Link href={`/admin/users/edit/${user.userId}`} className="bg-yellow-600 text-white rounded-lg px-4 py-1"><UserPen /></Link>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </section>
  );
};

export default AdminUsers;
