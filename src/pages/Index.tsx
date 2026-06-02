
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Brain, MessageCircle, Users, Settings } from "lucide-react";
import EnhancedAuthScreen from "@/components/EnhancedAuthScreen";
import ChildDashboard from "@/components/ChildDashboard";
import ParentDashboard from "@/components/ParentDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";

export type UserRole = 'child' | 'parent' | 'doctor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  childId?: string;
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated || !currentUser) {
    return <EnhancedAuthScreen onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'child':
        return <ChildDashboard user={currentUser} onLogout={handleLogout} />;
      case 'parent':
        return <ParentDashboard user={currentUser} onLogout={handleLogout} />;
      case 'doctor':
        return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Calming background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '9s' }}></div>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Index;
