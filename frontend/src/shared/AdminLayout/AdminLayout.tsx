import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

import './css/admin-layout.css';

type Props = {
	children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
	const location = useLocation();

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	function toggleSidebar() {
		setIsSidebarOpen((prevState) => !prevState);
	}

	function closeSidebar() {
		setIsSidebarOpen(false);
	}

	return (
		<div
			className={`admin-layout ${
				isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'
			}`}
		>
			<AdminSidebar
				currentPath={location.pathname}
				isOpen={isSidebarOpen}
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