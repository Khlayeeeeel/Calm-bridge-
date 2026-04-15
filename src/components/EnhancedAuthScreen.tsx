
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Users, Stethoscope, Eye, EyeOff } from "lucide-react";
import type { User, UserRole } from "@/pages/Index";

interface EnhancedAuthScreenProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup';

const EnhancedAuthScreen = ({ onLogin }: EnhancedAuthScreenProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = () => {
    if (selectedRole && validateForm()) {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || formData.email.split('@')[0],
        role: selectedRole,
        childId: selectedRole === 'parent' ? 'child-1' : undefined,
      };
      onLogin(user);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

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
              <CardTitle className="text-center">
                {authMode === 'login' ? 'Welcome back!' : 'Create Account'}
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} access
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auth mode toggle */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={authMode === 'login' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('login')}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button
                  variant={authMode === 'signup' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('signup')}
                  className="flex-1"
                >
                  Sign Up
                </Button>
              </div>

              {/* Name field (signup only) */}
              {authMode === 'signup' && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              {/* Email field */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm password field (signup only) */}
              {authMode === 'signup' && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleAuth}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedAuthScreen;
