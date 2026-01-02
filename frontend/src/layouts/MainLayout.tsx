import { ReactNode } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-[65px]">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
