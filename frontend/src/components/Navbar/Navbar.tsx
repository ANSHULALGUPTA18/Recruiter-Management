import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import UserDropdown from '../UserDropdown/UserDropdown';

interface DropdownItem {
  label: string;
  href: string;
  isExternal?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isExternal?: boolean;
  dropdownItems?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: 'Legal Compliance', href: 'https://frontend.reddesert-f6724e64.centralus.azurecontainerapps.io', isExternal: true },
  {
    label: 'Resume suite',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Resume Formatter', href: 'https://resume-formatter.reddesert-f6724e64.centralus.azurecontainerapps.io/', isExternal: true },
      { label: 'Job Pipeline', href: '#', disabled: true, comingSoon: true },
    ],
  },
  {
    label: 'Outreach',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Lead Pipeline', href: '#', disabled: true, comingSoon: true },
      { label: 'Referrals', href: 'https://referal-frontend.reddesert-f6724e64.centralus.azurecontainerapps.io/', isExternal: true },
    ],
  },
  { label: 'Analytics', href: '/analytics' },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        ref => ref && !ref.contains(event.target as Node)
      );
      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[65px] bg-primary-500 z-50 shadow-md">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/LOGO.png"
            alt="Unified Workspace Logo"
            className="w-14 h-14 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold leading-tight">Unified Workspace</span>
            <span className="text-white/70 text-xs leading-tight">powered by Techgene</span>
          </div>
        </div>

        {/* Center Section - Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              ref={(el) => { dropdownRefs.current[item.label] = el; }}
            >
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex items-center gap-1 px-3 py-2 text-white text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openDropdown === item.label && item.dropdownItems && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {item.dropdownItems.map((dropdownItem) => (
                        dropdownItem.disabled ? (
                          <div
                            key={dropdownItem.label}
                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                          >
                            <span>{dropdownItem.label}</span>
                            {dropdownItem.comingSoon && (
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        ) : (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            target={dropdownItem.isExternal ? '_blank' : undefined}
                            rel={dropdownItem.isExternal ? 'noopener noreferrer' : undefined}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {dropdownItem.label}
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={item.isExternal ? 'noopener noreferrer' : undefined}
                  className="px-3 py-2 text-white text-sm font-medium hover:bg-white/10 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Right Section - Profile */}
        <div className="flex items-center flex-shrink-0">
          <UserDropdown name="Anshu Lal Gupta" email="anshu@techgene.com" />
        </div>
      </div>
    </nav>
  );
}
