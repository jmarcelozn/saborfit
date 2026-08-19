import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

import './css/admin-layout.css';

type Props = {
	children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
	const location = useLocation();

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	function toggleSidebar() {
		setIsSidebarOpen((prevState) => !prevState);
	}

	function closeSidebar() {
		setIsSidebarOpen(false);
	}

	// Trava o scroll da página por trás enquanto o menu mobile está aberto
	useEffect(() => {
		document.body.classList.toggle('body-scroll-locked', isSidebarOpen);
		return () => document.body.classList.remove('body-scroll-locked');
	}, [isSidebarOpen]);

	// Fecha o menu automaticamente se a tela crescer para o tamanho desktop
	useEffect(() => {
		function handleResize() {
			if (window.innerWidth > 1024) {
				setIsSidebarOpen(false);
			}
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div
			className={`admin-layout ${
				isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'
			}`}
		>
			<AdminSidebar
				currentPath={location.pathname}
				isOpen={isSidebarOpen}
				onNavigate={closeSidebar}
			/>

			<div className="admin-main-container">
				<AdminHeader
					isSidebarOpen={isSidebarOpen}
					onToggleSidebar={toggleSidebar}
				/>

				<main className="admin-content">
					{children}
				</main>
			</div>

			<div
				className={`sidebar-overlay ${
					isSidebarOpen ? 'open' : ''
				}`}
				onClick={closeSidebar}
			/>
		</div>
	);
}