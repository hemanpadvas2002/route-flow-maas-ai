
import React from 'react';
import { User, CreditCard, History, Settings, LogOut, ChevronRight } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';

const ProfilePage: React.FC = () => {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
  };

  const menuItems = [
    {
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
      title: 'Payment Methods',
      subtitle: 'Credit cards, UPI, wallets',
    },
    {
      icon: <History className="h-5 w-5 text-purple-500" />,
      title: 'Travel History',
      subtitle: 'View past trips',
    },
    {
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      title: 'Settings',
      subtitle: 'App preferences, notifications',
    },
    {
      icon: <LogOut className="h-5 w-5 text-red-500" />,
      title: 'Logout',
      subtitle: 'Sign out from the app',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>
      
      {/* User Profile Card */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.phone}</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Transit Pass</div>
              <div className="font-semibold">Premium Monthly</div>
            </div>
            <div>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm">
            <button className="w-full py-4 px-5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4">{item.icon}</div>
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.subtitle}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
      
      {/* App Info */}
      <div className="mt-4 p-4 text-center">
        <p className="text-sm text-gray-500">RouteFlow MaaS App</p>
        <p className="text-xs text-gray-400">Version 1.0.0</p>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default ProfilePage;
