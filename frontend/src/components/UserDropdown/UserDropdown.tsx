import { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

interface UserDropdownProps {
  name: string;
  email: string;
}

export default function UserDropdown({ name, email }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <User className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500 truncate">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
