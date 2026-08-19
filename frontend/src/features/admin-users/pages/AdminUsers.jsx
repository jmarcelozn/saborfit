import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Shield, ShieldAlert } from "lucide-react";

import { useAuth } from "@/app/contexts/useAuth";
import { showNotification } from "@/app/services/notificationService";
import AdminLayout from "@/shared/AdminLayout/AdminLayout";

import { useUsers } from "../hooks/useUsers";
import { deleteUser, updateUserRole } from "../services/adminUsers.service";
import "./css/AdminUsers.css";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { users, loading, error, reload } = useUsers();
  const [updatingRole, setUpdatingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    if (!window.confirm(`Deseja alterar a função deste usuário para ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingRole(userId);
      await updateUserRole(userId, newRole);
      showNotification("Função atualizada com sucesso", "success");
      reload();
    } catch (err) {
      showNotification("Erro ao atualizar função", "error");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Deseja realmente excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setDeletingUser(userId);
      await deleteUser(userId);
      showNotification("Usuário excluído com sucesso", "success");
      reload();
    } catch (err) {
      showNotification("Erro ao excluir usuário", "error");
    } finally {
      setDeletingUser(null);
    }
  };

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
      <div className="admin-users-header">
        <div className="admin-users-title">
          <h1>Gerenciamento de Usuários</h1>
          <p>Visualize e gerencie os usuários cadastrados na plataforma.</p>
        </div>

        <div className="admin-users-stats">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{users.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Admins</span>
            <span className="stat-value">{users.filter(u => u.role === "admin").length}</span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <p>Carregando usuários...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Função</th>
                <th>Verificado</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData.id}>
                    <td className="user-id">#{userData.id}</td>
                    <td className="user-name">{userData.nome}</td>
                    <td className="user-email">{userData.email}</td>
                    <td className="user-role">
                      <span className={`role-badge role-${userData.role}`}>
                        {userData.role === "admin" ? (
                          <Shield size={14} />
                        ) : (
                          <ShieldAlert size={14} />
                        )}
                        {userData.role}
                      </span>
                    </td>
                    <td className="user-verified">
                      {userData.emailVerificado ? (
                        <span className="verified-badge">✅</span>
                      ) : (
                        <span className="unverified-badge">❌</span>
                      )}
                    </td>
                    <td className="user-actions">
                      <button
                        className="action-btn action-btn--role"
                        onClick={() => handleUpdateRole(userData.id, userData.role)}
                        disabled={updatingRole === userData.id || userData.id === user.id}
                        title="Alterar função"
                      >
                        {updatingRole === userData.id ? (
                          "..."
                        ) : userData.role === "admin" ? (
                          "Remover admin"
                        ) : (
                          "Tornar admin"
                        )}
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        onClick={() => handleDeleteUser(userData.id, userData.nome)}
                        disabled={deletingUser === userData.id || userData.id === user.id}
                        title="Excluir usuário"
                      >
                        {deletingUser === userData.id ? (
                          "..."
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
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