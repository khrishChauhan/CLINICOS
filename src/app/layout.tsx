import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Durga ClinicOS',
  description: 'Clinic Management System',
};

import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans overflow-hidden antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden relative lg:ml-64">
            <Header />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
