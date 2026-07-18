import React from 'react';
import Sidebar from '../../layout/Sidebar';
import Header from '../../layout/Header';
import { AuthProvider } from '../../context/AuthContext';
import { PermissionProvider } from '../../context/PermissionContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PermissionProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden relative lg:ml-64">
            <Header />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </PermissionProvider>
    </AuthProvider>
  );
}
