
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Ticket, User } from 'lucide-react';

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Route',
      icon: <Map className="h-6 w-6" />,
      path: '/',
    },
    {
      label: 'Tickets',
      icon: <Ticket className="h-6 w-6" />,
      path: '/tickets',
    },
    {
      label: 'Profile',
      icon: <User className="h-6 w-6" />,
      path: '/profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full px-2 ${
              currentPath === item.path
                ? 'text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationBar;
