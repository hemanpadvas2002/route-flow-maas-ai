
import React, { useState, useEffect } from 'react';
import { User, CreditCard, History, Settings, LogOut, ChevronRight, MoonStar, Sun, Edit2 } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { Switch } from "@/components/ui/switch";
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage: React.FC = () => {
  // Get theme context
  const { theme, setTheme } = useTheme();
  
  // Mock user data with state for editing
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);

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

  const handleSaveName = () => {
    if (newName.trim()) {
      setUser({...user, name: newName.trim()});
      // In a real app, save to backend
      localStorage.setItem('userName', newName.trim());
    }
    setIsEditingName(false);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: 'linear-gradient(to bottom, #1E1E2F, #2C2C3A, #3E3E55)' }}>
      {/* Header */}
      <div className="p-4" style={{ background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)' }}>
        <h1 className="text-xl font-bold text-white">Profile</h1>
      </div>
      
      {/* User Profile Card */}
      <div className="p-4">
        <div className="rounded-xl shadow-sm overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)' }}>
          <div className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-grow">
              {isEditingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded mr-2 w-full"
                    autoFocus
                  />
                  <button 
                    onClick={handleSaveName}
                    className="bg-[#00ADB5] text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                  <button 
                    onClick={() => setIsEditingName(true)} 
                    className="ml-2 text-gray-300 hover:text-white"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              <p className="text-gray-300">{user.email}</p>
              <p className="text-gray-300">{user.phone}</p>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center" style={{ background: 'rgba(14, 22, 33, 0.5)' }}>
            <div>
              <div className="text-sm text-gray-400">Transit Pass</div>
              <div className="font-semibold text-white">Premium Monthly</div>
            </div>
            <div>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Theme Toggle */}
      <div className="p-4 mb-4">
        <div className="rounded-lg shadow-sm" style={{ background: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)' }}>
          <div className="py-4 px-5 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                {theme === 'dark' ? <MoonStar className="h-5 w-5 text-[#00ADB5]" /> : <Sun className="h-5 w-5 text-yellow-400" />}
              </div>
              <div className="text-left">
                <div className="font-medium text-white">Dark Mode</div>
                <div className="text-xs text-gray-400">Toggle app theme</div>
              </div>
            </div>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
              className="data-[state=checked]:bg-[#00ADB5]"
            />
          </div>
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="p-4 space-y-3">
        {menuItems.map((item, index) => (
          <div key={index} className="rounded-lg shadow-sm" style={{ background: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)' }}>
            <button className="w-full py-4 px-5 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4">{item.icon}</div>
                <div className="text-left">
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.subtitle}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
      
      {/* App Info */}
      <div className="mt-4 p-4 text-center">
        <p className="text-sm text-gray-400">RouteFlow MaaS App</p>
        <p className="text-xs text-gray-500">Version 1.0.0</p>
      </div>
      
      <NavigationBar />
    </div>
  );
};

export default ProfilePage;
