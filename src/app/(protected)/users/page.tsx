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
import Modal from "@/components/ModalForm";
import { fetchUser, fetchUsers, handleCreate } from "@/services/axios";
import { useForm, Controller } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";

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

const formSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(4, "A senha precisa ter pelo menos 4 caracteres"),
  role: z.number().min(1, "Permissão é obrigatório"),
  person: z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    cpf: z.string().min(1, "CPF é obrigatório"),
  })
});

type UsersSchema = z.infer<typeof formSchema>

const AdminUsers: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [size, setSize] = useState<number>(5)
  const [users, setUsers] = useState<User[]>([]);

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<UsersSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: 2,
      person: {
        name: "",
        email: "",
        phone: "",
        cpf: ""
      }
    }
  });

  const { sessionInfo } = useContext(GlobalContext);
  const token = sessionInfo?.accessToken;
  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    fetchUsers(token, currentPage, "users").then((res: any) => {
      setUsers(res.content)
      setTotalPages(res.totalPages)
    })
  }, [baseUrl, token, size, currentPage]);


  const createData = async (data: any) => {
    console.log(data)
    const result = await handleCreate(data, token, "users");

    if (result) {
      setMessage(result.message)
    }
  }

  return (
    <section className="mx-10 px-3 py-1 mb-4">
      <div className="flex justify-center gap-96 my-5 items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Users />
            <h1 className="font-bold text-3xl">Usuários</h1>
          </div>
          <span>Lista de todos os usuários do sistema</span>
          {message && <p>{message}</p>}
        </div>

        <div className="bg-black text-white rounded-lg h-full" >
          <Modal title="Adicionar Usuário" url="users" method="POST">
            <form onSubmit={handleSubmit(createData)} className="flex flex-col gap-2">
              <FormField name="person.name" control={control} placeholder="Nome" />
              {errors.person?.name && <p className="text-red-600">{errors.person.name.message}</p>}
              <FormField name="username" control={control} placeholder="Nome de Usuário" />
              {errors.username && <p className="text-red-600">{errors.username.message}</p>}
              <FormField name="password" control={control} placeholder="Senha" type="password" />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
              <FormField name="person.cpf" control={control} placeholder="CPF" />
              {errors.person?.cpf && <p className="text-red-600">{errors.person.cpf.message}</p>}
              <FormField name="person.email" control={control} placeholder="Email" />
              {errors.person?.email && <p className="text-red-600">{errors.person.email.message}</p>}
              <FormField name="person.phone" control={control} placeholder="Telefone" />
              {errors.person?.phone && <p className="text-red-600">{errors.person.phone.message}</p>}

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Colaborador</SelectItem>
                      <SelectItem value="1">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-red-600" >{errors.role.message}</p>}

              <div className="text-center">
                {message ? message : null}
              </div>
              <Button className="bg-black" type="submit">Salvar</Button>
            </form>
          </Modal>
        </div>

      </div>

      <div className="overflow-auto flex justify-center">
        <Table columns={["Nome", "Username", "CPF", "Email", "Telefone", "Permissões"]}>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-3 text-center rounded-es-lg">{user.person.name}</td>
              <td className="p-3 text-center rounded-es-lg">{user.username}</td>
              <td className="p-3 text-center rounded-es-lg">{user.person.cpf}</td>
              <td className="p-3 text-center rounded-es-lg">{user.person.email}</td>
              <td className="p-3 text-center rounded-es-lg">{user.person.phone}</td>
              <td className="p-3 text-center">
                {user.role == 1 ? "Administrador" : "Colaborador"}
              </td>
              <td className="p-3 text-center rounded-ee-lg">
                <div className="flex gap-2 items-center justify-center">
                  <button className="bg-red-600 text-white rounded-lg px-4 py-1"><Trash /></button>
                  <Link className="bg-yellow-600 text-white rounded-lg px-4 py-1" href={`/users/edit/${user.id}`}><UserPen /></Link>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <PaginationBox currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} size={5} />
    </section>
  );
};

export default AdminUsers;
