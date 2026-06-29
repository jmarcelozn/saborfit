const API_URL = "/api/admin/users";

export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar usuários");
  }

  const data = await response.json();

  return data.data?.users || [];
}

export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao excluir usuário");
  }

  return response.json();
}

export async function updateUserRole(id, role) {
  const response = await fetch(`${API_URL}/${id}/role`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return response.json();
}