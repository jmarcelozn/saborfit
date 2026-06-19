import React from 'react';
import { useAuth } from '@/app/contexts/useAuth';
import { Search, Bell, Menu, X } from 'lucide-react';

type Props = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function AdminHeader({ isSidebarOpen, onToggleSidebar, }: Props) {
  const { user } = useAuth();

  return (
    <header className="admin-header">
      <button
        type="button"
        className="sidebar-toggle"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="header-toolbar">
        <div className="header-search">
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Notificações">
            <Bell size={20} />
          </button>

          <div className="user-profile">
            <span>{user?.nome ?? 'Usuário'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}