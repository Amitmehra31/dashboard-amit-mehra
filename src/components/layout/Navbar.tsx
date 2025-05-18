import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, HelpCircle, Menu, Moon, PlusCircle, Search, Settings, Sun, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useWidgets } from '../../hooks/useWidgets';
import { WidgetType } from '../../types';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { mode, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { add } = useWidgets();
  const location = useLocation();

  const handleAddWidget = (type: WidgetType) => {
    let title = '';
    switch (type) {
      case WidgetType.WEATHER:
        title = 'Weather';
        break;
      case WidgetType.CRYPTO:
        title = 'Crypto Prices';
        break;
      case WidgetType.TASKS:
        title = 'Tasks';
        break;
    }
    add({ type, title, route: location.pathname });
  };

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-theme-paper border-b border-theme transition-all duration-300">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2 md:hidden"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
            icon={<Menu size={20} />}
          />
          <div className="hidden md:block">
            <Input
              placeholder="Search..."
              className="w-[250px]"
              icon={<Search size={16} />}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              icon={<PlusCircle size={18} />}
            >
              Add Widget
            </Button>
            <div className="absolute right-0 mt-2 w-48 py-2 bg-theme-paper border border-theme rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                className="w-full px-4 py-2 text-left text-theme-primary hover:bg-theme-subtle transition-colors"
                onClick={() => handleAddWidget(WidgetType.WEATHER)}
              >
                Weather Widget
              </button>
              <button
                className="w-full px-4 py-2 text-left text-theme-primary hover:bg-theme-subtle transition-colors"
                onClick={() => handleAddWidget(WidgetType.CRYPTO)}
              >
                Crypto Prices Widget
              </button>
              <button
                className="w-full px-4 py-2 text-left text-theme-primary hover:bg-theme-subtle transition-colors"
                onClick={() => handleAddWidget(WidgetType.TASKS)}
              >
                Tasks Widget
              </button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggle}
            icon={mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Notifications"
            icon={<Bell size={18} />}
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Settings"
            icon={<Settings size={18} />}
          />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Help"
            icon={<HelpCircle size={18} />}
          />
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <div className="mr-2 hidden md:block">
                  <p className="text-sm font-medium text-theme-primary">{user.name}</p>
                </div>
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<User size={18} />}
                    onClick={() => logout()}
                  />
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                icon={<User size={18} />}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};