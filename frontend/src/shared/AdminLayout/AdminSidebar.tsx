import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
} from 'lucide-react';

import logo from '@/assets/logo.png';

interface AdminSidebarProps {
  currentPath?: string;
  isOpen?: boolean;
  onNavigate?: () => void;
}

export default function AdminSidebar({
  currentPath = '/dashboard',
  isOpen = true,
  onNavigate,
}: AdminSidebarProps) {
  const menuItems = [
    {
      label: 'Dashboard',
      path: '/Admin',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Produtos',
      path: '/dashboard/products',
      icon: <Package size={18} />,
    },
    {
      label: 'Pedidos',
      path: '/dashboard/orders',
      icon: <ShoppingBag size={18} />,
    },
    {
      label: 'Clientes',
      path: '/dashboard/users',
      icon: <Users size={18} />,
    },
    {
      label: 'Configurações',
      path: '/dashboard/settings',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <img
          src={logo}
          alt="SaborFit"
          className="sidebar-logo"
        />
      </div>

      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`sidebar-item ${
                currentPath === item.path ? 'active' : ''
              }`}
            >
              {/* onNavigate fecha o drawer no mobile ao trocar de página;
                  no desktop a prop é opcional e não tem efeito visual */}
              <Link to={item.path} onClick={onNavigate}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}