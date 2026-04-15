
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, Circle } from "lucide-react";

const ChildCalendar = () => {
  const activities = [
    {
      id: 1,
      title: 'Morning Therapy',
      time: '9:00 AM',
      description: 'Fun exercises with therapist',
      completed: true,
      emoji: '🏃‍♂️',
    },
    {
      id: 2,
      title: 'Snack Time',
      time: '10:30 AM',
      description: 'Healthy snacks and juice',
      completed: true,
      emoji: '🍎',
    },
    {
      id: 3,
      title: 'Art Time',
      time: '11:30 AM',
      description: 'Draw and paint beautiful pictures',
      completed: false,
      emoji: '🎨',
    },
    {
      id: 4,
      title: 'Lunch',
      time: '12:30 PM',
      description: 'Yummy lunch with family',
      completed: false,
      emoji: '🍽️',
    },
    {
      id: 5,
      title: 'Quiet Time',
      time: '2:00 PM',
      description: 'Rest and relax',
      completed: false,
      emoji: '😴',
    },
    {
      id: 6,
      title: 'Play Time',
      time: '3:30 PM',
      description: 'Fun games and activities',
      completed: false,
      emoji: '🎮',
    },
  ];

  const completedCount = activities.filter(a => a.completed).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
          My Daily Schedule 📅
        </h2>
        <p className="text-xl text-gray-600">Here's what we're doing today!</p>
      </div>

      {/* Progress overview */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100">
        <CardContent className="p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Great Progress! 🌟</h3>
          <p className="text-xl">
            You've completed <span className="font-bold text-green-600">{completedCount}</span> out of{' '}
            <span className="font-bold">{activities.length}</span> activities today!
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / activities.length) * 100}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Activity list */}
      <div className="grid gap-4">
        {activities.map((activity) => (
          <Card 
            key={activity.id} 
            className={`transition-all duration-300 ${
              activity.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                {/* Status icon */}
                <div className={`flex-shrink-0 ${activity.completed ? 'text-green-500' : 'text-gray-400'}`}>
                  {activity.completed ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <Circle className="w-8 h-8" />
                  )}
                </div>

                {/* Emoji */}
                <div className="text-4xl">
                  {activity.emoji}
                </div>

                {/* Activity details */}
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${activity.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                </div>

                {/* Time */}
                <div className="flex items-center text-gray-500">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">{activity.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Encouragement message */}
      <Card className="bg-gradient-to-r from-purple-100 to-pink-100">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">You're doing amazing! 🎉</h3>
          <p className="text-gray-600">
            Remember, it's okay to take breaks when you need them. Every step counts!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChildCalendar;
