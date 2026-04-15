
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Brain, MessageCircle, Home, Users } from "lucide-react";
import type { User } from "@/pages/Index";
import AIChatbot from "@/components/AIChatbot";
import MiniGames from "@/components/MiniGames";
import ChildCalendar from "@/components/ChildCalendar";
import ChatSystem from "@/components/ChatSystem";

interface ChildDashboardProps {
  user: User;
  onLogout: () => void;
}

type ChildView = 'home' | 'calendar' | 'games' | 'chat' | 'chat-parent';

const ChildDashboard = ({ user, onLogout }: ChildDashboardProps) => {
  const [currentView, setCurrentView] = useState<ChildView>('home');

  const menuItems = [
    { id: 'home' as ChildView, title: 'Home', icon: Home, color: 'bg-blue-400' },
    { id: 'calendar' as ChildView, title: 'My Day', icon: Calendar, color: 'bg-green-400' },
    { id: 'games' as ChildView, title: 'Games', icon: Brain, color: 'bg-purple-400' },
    { id: 'chat' as ChildView, title: 'My Friend', icon: MessageCircle, color: 'bg-pink-400' },
    { id: 'chat-parent' as ChildView, title: 'Talk to Mom/Dad', icon: Users, color: 'bg-orange-400' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <ChildCalendar />;
      case 'games':
        return <MiniGames />;
      case 'chat':
        return <AIChatbot childName={user.name} />;
      case 'chat-parent':
        return <ChatSystem currentUser={user} chatType="parent-child" recipientName="Mom" />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Hello, {user.name}! 🌟
              </h2>
              <p className="text-lg md:text-xl text-gray-600">What would you like to do today?</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.slice(1).map((item) => {
                const IconComponent = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => setCurrentView(item.id)}
                  >
                    <CardContent className="p-4 md:p-6 text-center">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${item.color} flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Heart rate display (simulated) */}
            <Card className="bg-gradient-to-r from-red-100 to-pink-100">
              <CardContent className="p-4 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 animate-pulse mr-2" />
                <span className="text-base md:text-lg font-semibold">Heart Rate: 85 BPM</span>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-4">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "outline"}
                onClick={() => setCurrentView(item.id)}
                className="text-sm md:text-base px-3 md:px-6 py-2 md:py-3 flex-shrink-0"
                size="sm"
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{item.title}</span>
                <span className="sm:hidden">{item.title.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
        <Button variant="outline" onClick={onLogout} size="sm" className="w-full sm:w-auto">
          Exit
        </Button>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default ChildDashboard;
