import axios from "axios";

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

const baseUrl = "http://localhost:8080"

const handleCreate = async (data: any, token: string | undefined, url: string) => {
    try {
        const response = await axios({
            method: "POST",
            url: baseUrl + `/api/${url}`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("Usuário não autorizado");
            } else if (error.response.status === 422) {
                console.log("Usuário já existente");
            } else {
                console.log("Erro na resposta da solicitação.");
            }
        } else {
            console.log("Erro ao cadastrar usuário.");
        }
    }
};

const handleUpdate = async (data: any, token: string | undefined, url: string, id: number | undefined) => {
    try {
        if (!id) return

        const response = await axios({
            method: "PUT",
            url: baseUrl + `/api/${url}?id=${id}`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("Usuário não autorizado");
            } else if (error.response.status === 422) {
                console.log("Usuário já existente");
            } else {
                console.log("Erro na resposta da solicitação.");
            }
        } else {
            console.log("Erro ao cadastrar usuário.");
        }
    }
};

const fetchUsers = async (token: string | undefined, currentPage: number) => {
    try {

        const response = await axios.get<Page<User>>(`${baseUrl}/api/users?size=${5}&page=${currentPage}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            return response.data
        }

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("Usuário não autorizado");
            } else {
                console.log("Erro ao buscar usuários.");
            }
            console.error("Erro na resposta da solicitação:", error.response);
        } else {
            console.error("Erro ao buscar usuários:", error);
            console.log("Erro ao buscar usuários.");
        }
    }
};

const fetchUser = async (token: string | undefined, id: number | undefined) => {
    try {
        if (!id) return

        const response = await axios.get(baseUrl + `/api/users/find?id=${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 200) {
            return response.data
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log("Usuário não autorizado");
            } else {
                console.log("Erro ao buscar usuários.");
            }
            console.error("Erro na resposta da solicitação:", error.response);
        } else {
            console.error("Erro ao buscar usuários:", error);
            console.log("Erro ao buscar usuários.");
        }
    }
};

export { handleCreate, handleUpdate, fetchUsers, fetchUser }