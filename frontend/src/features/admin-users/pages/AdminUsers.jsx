import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/app/contexts/useAuth";
import AdminLayout from "@/shared/AdminLayout/AdminLayout";

import { useUsers } from "../hooks/useUsers";

export default function AdminUsers() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const {
    users,
    loading,
    error,
  } = useUsers();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1>Gerenciamento de Usuários</h1>
          <p>
            Visualize e gerencie os usuários cadastrados na plataforma.
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <strong>Total:</strong> {users.length}
        </div>
      </div>

      {loading && (
        <p>Carregando usuários...</p>
      )}

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#d00000",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f7f7f7",
                }}
              >
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Função</th>
                <th style={thStyle}>Verificado</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                    }}
                  >
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={tdStyle}>{user.id}</td>

                    <td style={tdStyle}>
                      {user.nome}
                    </td>

                    <td style={tdStyle}>
                      {user.email}
                    </td>

                    <td style={tdStyle}>
                      {user.role}
                    </td>

                    <td style={tdStyle}>
                      {user.emailVerificado
                        ? "✅"
                        : "❌"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

const thStyle = {
  padding: "1rem",
  textAlign: "left",
  borderBottom: "1px solid #eee",
};

const tdStyle = {
  padding: "1rem",
  borderBottom: "1px solid #f0f0f0",
};