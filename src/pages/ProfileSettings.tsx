import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Moon, Sun, User, Bell, Shield, HelpCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="min-h-screen w-full urban-dusk-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Profile Settings</h1>
      </div>
      
      {/* Profile Card */}
      <div className="px-4 pt-2 pb-4">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-lg">Alex Johnson</CardTitle>
                <p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      {/* Settings Options */}
      <div className="px-4 space-y-4 flex-1">
        {/* Display Settings */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-blue-400" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
                <Label htmlFor="theme-toggle" className="font-medium">
                  {theme === 'dark' ? 'Dark Theme' : 'Light Theme'}
                </Label>
              </div>
              <Switch 
                id="theme-toggle" 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Other Settings */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5 text-primary" />
                <Label htmlFor="push-notifications" className="font-medium">
                  Push Notifications
                </Label>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5 text-primary" />
                <Label htmlFor="route-updates" className="font-medium">
                  Route Updates
                </Label>
              </div>
              <Switch id="route-updates" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        {/* Security Settings */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Security & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-5 w-5 mr-2 text-primary" />
              Help & Support
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Action */}
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
