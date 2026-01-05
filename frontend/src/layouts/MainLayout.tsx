import { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex pt-[65px] overflow-hidden">
        {/* Left control area - dynamically sized based on sidebar state */}
        <div className={`flex-shrink-0 bg-white transition-all duration-300 ease-in-out relative ${isSidebarOpen ? 'w-[280px] lg:w-[300px]' : 'w-16'}`}>
          {/* Sidebar - part of normal flow */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          
          {/* Hamburger Icon - Fixed position below navbar */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-[70px] left-4 z-30 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              aria-label="Open to-do list"
              title="Open To-Do List"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
        
        {/* Persistent vertical divider */}
        <div className="w-px bg-gray-200 flex-shrink-0 h-[calc(100vh-65px)]" />
        
        <main className="flex-1 flex flex-col min-h-[calc(100vh-65px)] min-w-0 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
