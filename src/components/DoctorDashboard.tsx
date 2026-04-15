import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Users, Stethoscope, Calendar, MessageCircle, Star } from "lucide-react";
import type { User } from "@/pages/Index";
import ChatSystem from "@/components/ChatSystem";
import DoctorRatingSystem from "@/components/DoctorRatingSystem";

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

type DoctorView = 'patients' | 'analytics' | 'reports' | 'chat' | 'ratings';

const DoctorDashboard = ({ user, onLogout }: DoctorDashboardProps) => {
  const [currentView, setCurrentView] = useState<DoctorView>('patients');

  const menuItems = [
    { id: 'patients' as DoctorView, title: 'Patients', icon: Users },
    { id: 'analytics' as DoctorView, title: 'Analytics', icon: BarChart3 },
    { id: 'reports' as DoctorView, title: 'Reports', icon: FileText },
    { id: 'chat' as DoctorView, title: 'Chat Parents', icon: MessageCircle },
    { id: 'ratings' as DoctorView, title: 'Ratings', icon: Star },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Patient Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Heart Rate Trends</h3>
                  <p className="text-sm text-gray-600">Average: 85 BPM</p>
                  <p className="text-sm text-gray-600">Range: 70-100 BPM</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Activity Completion</h3>
                  <p className="text-sm text-gray-600">This week: 85%</p>
                  <p className="text-sm text-gray-600">Last week: 78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Weekly Progress Report</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Patient shows consistent improvement in activity completion and emotional regulation.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Generated: 2 days ago</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Behavioral Assessment</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Positive trends in social interaction and reduced anxiety markers.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Generated: 1 week ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'chat':
        return <ChatSystem currentUser={user} chatType="doctor-parent" recipientName="Sarah (Emma's Mom)" />;
      case 'ratings':
        return <DoctorRatingSystem currentUser={user} />;
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Patient Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Patients</p>
                      <p className="text-xl md:text-2xl font-bold">12</p>
                    </div>
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Improvement</p>
                      <p className="text-xl md:text-2xl font-bold">+23%</p>
                    </div>
                    <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Weekly Sessions</p>
                      <p className="text-xl md:text-2xl font-bold">45</p>
                    </div>
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('chat')}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Chat with Parents</h3>
                    <p className="text-sm text-gray-600">Communicate with families</p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setCurrentView('ratings')}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Rate Progress</h3>
                    <p className="text-sm text-gray-600">Weekly & 15-day assessments</p>
                  </div>
                  <Star className="w-6 h-6 text-yellow-500" />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium">Emma (Age 7)</span>
                      <p className="text-sm text-gray-600">Completed breathing exercise</p>
                    </div>
                    <span className="text-green-600 font-semibold">2 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium">Alex (Age 9)</span>
                      <p className="text-sm text-gray-600">Heart rate: 78 BPM (normal)</p>
                    </div>
                    <span className="text-blue-600 font-semibold">5 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <span className="font-medium">Sam (Age 6)</span>
                      <p className="text-sm text-gray-600">Played memory game (Level 3)</p>
                    </div>
                    <span className="text-purple-600 font-semibold">12 mins ago</span>
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
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "outline"}
                onClick={() => setCurrentView(item.id)}
                className="text-sm md:text-base px-3 md:px-4 py-2 flex-shrink-0"
                size="sm"
              >
                <IconComponent className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{item.title}</span>
                <span className="sm:hidden">{item.title.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
        <div className="flex items-center space-x-2 md:space-x-4 w-full lg:w-auto">
          <span className="text-base md:text-lg font-medium">Dr. {user.name}</span>
          <Button variant="outline" onClick={onLogout} size="sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default DoctorDashboard;
