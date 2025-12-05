import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  MessageCircle
} from 'lucide-react';
import { Button } from './ui/button';

const AdminSidebar = ({ onLogout }) => {
  const location = useLocation();

  const navigationGroups = [
    {
      label: 'Overview',
      items: [
        {
          name: 'Dashboard',
          description: 'Quick summary of what’s happening',
          href: '/admin',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'Content Management',
      items: [
        {
          name: 'Resources',
          description: 'Add and organize study materials',
          href: '/admin/resources',
          icon: FileText,
        },
        {
          name: 'Grade Images',
          description: 'Customize grade box visuals',
          href: '/admin/grade-images',
          icon: Image,
        },
        {
          name: 'Sub Grades',
          description: 'Manage detailed grade levels',
          href: '/admin/sub-grades',
          icon: Layers,
        },
        {
          name: 'Streams',
          description: 'Manage A/L and University streams',
          href: '/admin/streams',
          icon: Layers,
        },
      ],
    },
    {
      label: 'User Engagement',
      items: [
        {
          name: 'Feedback',
          description: 'View and manage user feedback',
          href: '/admin/feedback',
          icon: MessageCircle,
        },
      ],
    },
    {
      label: 'Insights & Settings',
      items: [
        {
          name: 'Statistics',
          description: 'Track resource distribution',
          href: '/admin/statistics',
          icon: BarChart3,
        },

      ],
    },
  ];

  // Extract the last part of the pathname to match with tab names
  const getCurrentTab = () => {
    const path = location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || 'dashboard';
  };

  const currentTab = getCurrentTab();

  return (
    <aside className="flex flex-col w-72 bg-gray-800/30 backdrop-blur-lg border-r border-gray-700/50 min-h-screen shadow-xl">
      <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-emerald-900/30 to-teal-900/30">
        <h2 className="text-xl font-bold text-emerald-400">
          Admin Panel
        </h2>
        <p className="mt-1 text-xs text-emerald-100/70">
          Manage resources, grades, and settings for ZenAegis Edu.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                // Match based on the last part of the URL
                const isActive =
                  currentTab === item.href.split('/').pop() ||
                  (currentTab === 'admin' && item.href === '/admin');

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-start px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 shadow-sm'
                      : 'text-gray-300 hover:bg-gray-700/40 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-gray-400">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700/50">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full flex items-center justify-center bg-red-900/30 hover:bg-red-800/40 text-red-300 border-red-700/50 hover:border-red-600/50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;