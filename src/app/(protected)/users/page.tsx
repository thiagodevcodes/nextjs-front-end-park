"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Spinner from "@/components/Spinner";
import Table from "@/components/Table";
import { Users, Trash, UserPen } from "lucide-react";
import axios from "axios";
import { GlobalContext } from "@/contexts/GlobalContext";
import Link from "next/link";
import PaginationBox from "@/components/Pagination";
import Modal from "@/components/Modal";

interface User {
  id: number,
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

interface Page<User> {
  content: User[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

const AdminUsers: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [size, setSize] = useState<number>(5)
  const [users, setUsers] = useState<User[]>([]);

  const { sessionInfo } = useContext(GlobalContext);
  const token = sessionInfo?.accessToken;
  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await axios.get<Page<User>>(`${baseUrl}/api/users?size=${size}&page=${currentPage}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        if (response.status === 200) {
          console.log(response.data)
          setUsers(response.data.content);
          console.log(users)
          setTotalPages(response.data.totalPages);
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

    fetchUsers();
  }, [baseUrl, token, size, currentPage]);

  return (
    <section className="mx-10 px-3 py-1 mb-4">
      <div className="flex justify-between my-5 items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Users />
            <h1 className="font-bold text-3xl">Usuários</h1>
          </div>
          <span>Lista de todos os usuários do sistema</span>
          {message && <p>{message}</p>}
        </div>

        <div className="bg-black text-white rounded-lg h-full" >
          <Modal title="Adicionar Usuário" url="users" method="POST"/>
        </div>
        
      </div>

      <Table columns={["Nome", "Username", "Permissões"]}>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="p-3 text-center rounded-es-lg">{user.person.name}</td>
            <td className="p-3 text-center rounded-es-lg">{user.username}</td>
            <td className="p-3 text-center">
              {user.role == 1 ? "Admin" : "Normal"}
            </td>
            <td className="p-3 text-center rounded-ee-lg">
              <div className="flex gap-2 items-center justify-center">
                <button className="bg-red-600 text-white rounded-lg px-4 py-1"><Trash /></button>
  
                <div className="bg-yellow-600 text-white rounded-lg">
                  <Modal title="Editar" url={`users?id=${user.id}`} method="PUT" id={user.id}/>
                </div>
                
      
                
                {/* <Link href={`/users/edit/${user.id}`} className="bg-yellow-600 text-white rounded-lg px-4 py-1"><UserPen /></Link> */}
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <PaginationBox currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} size={size} />
    </section>
  );
};

export default AdminUsers;
