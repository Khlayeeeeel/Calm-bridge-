
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Stethoscope } from "lucide-react";
import type { User, UserRole } from "@/pages/Index";


interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole && name.trim()) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        role: selectedRole,
        childId: selectedRole === 'parent' ? 'child-1' : undefined,
      };
      onLogin(user);
    }
  };

  const roles = [
    {
      id: 'child' as UserRole,
      title: 'Child',
      description: 'Games, activities, and your AI friend',
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-400 to-purple-400',
    },
    {
      id: 'parent' as UserRole,
      title: 'Parent',
      description: 'Manage activities and monitor progress',
      icon: Users,
      color: 'bg-gradient-to-br from-blue-400 to-cyan-400',
    },
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      description: 'Professional insights and data analysis',
      icon: Stethoscope,
      color: 'bg-gradient-to-br from-green-400 to-teal-400',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            CalmBridge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A supportive companion for children with autism, connecting families and healthcare providers
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-white"
                  onClick={() => handleRoleSelection(role.id)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 rounded-full ${role.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-gray-600">{role.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Welcome, {selectedRole}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedRole(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleLogin}
                  disabled={!name.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
