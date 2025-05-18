import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { LayoutDashboard, BarChart3, Settings, Users, LogOut, Database } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/users', label: 'Users', icon: <Users size={20} /> },
    { path: '/data', label: 'Data', icon: <Database size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-theme-paper border-r border-theme transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b border-theme px-6">
            <Link to="/" className="flex items-center">
            <img src="https://www.payfuture.net/wp-content/uploads/2021/09/logo.svg" alt="PayFuture" width="150" height="150"/>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary" 
                          : "text-theme-secondary hover:bg-theme-subtle hover:text-theme-primary"
                      )}
                      onClick={closeSidebar}
                    >
                      <span className={cn(
                        "flex-shrink-0 transition-colors duration-200",
                        isActive ? "text-primary" : "text-theme-secondary group-hover:text-theme-primary"
                      )}>
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t border-theme p-4">
            <Button
              className="w-full justify-start text-white bg-error hover:bg-error-dark"
              onClick={() => {
                logout();
                closeSidebar();
              }}
              icon={<LogOut size={18} />}
            >
              Log out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};