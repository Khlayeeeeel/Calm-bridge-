
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, TrendingUp, Calendar } from "lucide-react";

const HealthMonitoring = () => {
  // Simulated health data
  const heartRateData = [
    { time: '9:00 AM', value: 85 },
    { time: '10:00 AM', value: 82 },
    { time: '11:00 AM', value: 88 },
    { time: '12:00 PM', value: 90 },
    { time: '1:00 PM', value: 86 },
    { time: '2:00 PM', value: 78 },
    { time: '3:00 PM', value: 83 },
  ];

  const movementData = [
    { activity: 'Walking', duration: '45 min', calories: 120 },
    { activity: 'Playing', duration: '30 min', calories: 85 },
    { activity: 'Therapy Exercises', duration: '25 min', calories: 70 },
  ];

  const averageHeartRate = Math.round(heartRateData.reduce((sum, data) => sum + data.value, 0) / heartRateData.length);
  const totalActivity = movementData.reduce((sum, data) => sum + parseInt(data.duration), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Health Monitoring</h2>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Heart Rate</p>
                <p className="text-3xl font-bold text-red-600">{averageHeartRate}</p>
                <p className="text-sm text-green-600">Normal range</p>
              </div>
              <Heart className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activity</p>
                <p className="text-3xl font-bold text-blue-600">{totalActivity}</p>
                <p className="text-sm text-green-600">minutes today</p>
              </div>
              <Activity className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wellness Score</p>
                <p className="text-3xl font-bold text-green-600">8.5</p>
                <p className="text-sm text-green-600">out of 10</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heart rate tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Heart Rate Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {heartRateData.map((data, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="bg-red-100 rounded-lg p-3 mb-2 transition-all hover:bg-red-200"
                    style={{ height: `${(data.value / 100) * 80 + 40}px` }}
                  >
                    <div className="text-sm font-semibold text-red-700">{data.value}</div>
                  </div>
                  <div className="text-xs text-gray-500">{data.time}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600">
              Heart rate measured in beats per minute (BPM)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Movement & Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {movementData.map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{movement.activity}</h3>
                  <p className="text-sm text-gray-600">Duration: {movement.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Calories</p>
                  <p className="text-xl font-bold text-blue-600">{movement.calories}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800">Positive Trend</h3>
              <p className="text-green-700">Heart rate has been stable throughout the day, indicating good emotional regulation.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-800">Activity Level</h3>
              <p className="text-blue-700">Great job staying active! Physical activity helps with mood and overall wellbeing.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h3 className="font-semibold text-purple-800">Recommendation</h3>
              <p className="text-purple-700">Continue with the current routine. Consider adding more relaxation activities in the afternoon.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthMonitoring;
