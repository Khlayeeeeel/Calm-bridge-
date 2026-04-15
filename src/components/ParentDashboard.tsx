import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Settings, Heart, Brain, Users, MessageCircle } from "lucide-react";
import type { User } from "@/pages/Index";
import ActivityManager from "@/components/ActivityManager";
import HealthMonitoring from "@/components/HealthMonitoring";
import ProgressReport from "@/components/ProgressReport";
import ChatSystem from "@/components/ChatSystem";

interface ParentDashboardProps {
  user: User;
  onLogout: () => void;
}

type ParentView = 'overview' | 'activities' | 'health' | 'progress' | 'chat-doctor' | 'chat-child' | 'settings';

const ParentDashboard = ({ user, onLogout }: ParentDashboardProps) => {
  const [currentView, setCurrentView] = useState<ParentView>('overview');

  const menuItems = [
    { id: 'overview' as ParentView, title: 'Overview', icon: BarChart3 },
    { id: 'activities' as ParentView, title: 'Activities', icon: Calendar },
    { id: 'health' as ParentView, title: 'Health', icon: Heart },
    { id: 'progress' as ParentView, title: 'Progress', icon: Brain },
    { id: 'chat-doctor' as ParentView, title: 'Chat Doctor', icon: MessageCircle },
    { id: 'chat-child' as ParentView, title: 'Chat Child', icon: Users },
    { id: 'settings' as ParentView, title: 'Settings', icon: Settings },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'activities':
        return <ActivityManager />;
      case 'health':
        return <HealthMonitoring />;
      case 'progress':
        return <ProgressReport />;
      case 'chat-doctor':
        return <ChatSystem currentUser={user} chatType="parent-doctor" recipientName="Dr. Smith" />;
      case 'chat-child':
        return <ChatSystem currentUser={user} chatType="parent-child" recipientName="Emma" />;
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings and preferences will be available here.</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Activities</p>
                      <p className="text-xl md:text-2xl font-bold">3 of 5</p>
                      <p className="text-sm text-green-600">completed</p>
                    </div>
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Heart Rate</p>
                      <p className="text-xl md:text-2xl font-bold">82 BPM</p>
                      <p className="text-sm text-green-600">normal range</p>
                    </div>
                    <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Games Played</p>
                      <p className="text-xl md:text-2xl font-bold">7</p>
                      <p className="text-sm text-green-600">this week</p>
                    </div>
                    <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Chat Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('chat-doctor')}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Chat with Doctor</h3>
                    <p className="text-sm text-gray-600">Discuss your child's progress</p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('chat-child')}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Chat with Your Child</h3>
                    <p className="text-sm text-gray-600">Connect and communicate</p>
                  </div>
                  <Users className="w-6 h-6 text-green-500" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>Morning therapy session</span>
                    <span className="text-green-600 font-semibold">Completed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span>Memory matching game</span>
                    <span className="text-blue-600 font-semibold">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Afternoon walk</span>
                    <span className="text-gray-600 font-semibold">Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-2 md:p-4">
      {/* Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-6 gap-4">
        <div className="flex flex-wrap gap-2 w-full lg:w-auto overflow-x-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "outline"}
                onClick={() => setCurrentView(item.id)}
                className="whitespace-nowrap text-sm md:text-base px-3 md:px-4 py-2 flex-shrink-0"
                size="sm"
              >
                <IconComponent className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{item.title}</span>
                <span className="sm:hidden">{item.title.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
        <Button variant="outline" onClick={onLogout} size="sm" className="w-full lg:w-auto">
          Logout
        </Button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default ParentDashboard;
