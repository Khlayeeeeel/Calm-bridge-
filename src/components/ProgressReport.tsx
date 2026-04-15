
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Brain, Heart, Download } from "lucide-react";

const ProgressReport = () => {
  const weeklyData = [
    { week: 'Week 1', activities: 85, games: 12, mood: 7.2 },
    { week: 'Week 2', activities: 78, games: 15, mood: 7.8 },
    { week: 'Week 3', activities: 92, games: 18, mood: 8.1 },
    { week: 'Week 4', activities: 88, games: 20, mood: 8.5 },
  ];

  const milestones = [
    {
      title: 'Completed First Breathing Exercise',
      date: '2 weeks ago',
      description: 'Successfully completed the calm breathing game for the first time',
      emoji: '🌬️',
    },
    {
      title: 'Memory Game Level 3',
      date: '1 week ago',
      description: 'Achieved level 3 in the memory matching game with 95% accuracy',
      emoji: '🧠',
    },
    {
      title: 'Five Days of Perfect Routine',
      date: '3 days ago',
      description: 'Completed all scheduled activities for 5 consecutive days',
      emoji: '⭐',
    },
    {
      title: 'Improved Social Interaction',
      date: 'Yesterday',
      description: 'Initiated conversation with AI friend and expressed feelings clearly',
      emoji: '💬',
    },
  ];

  const currentWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData[weeklyData.length - 2];

  const activityImprovement = ((currentWeek.activities - previousWeek.activities) / previousWeek.activities * 100).toFixed(1);
  const moodImprovement = ((currentWeek.mood - previousWeek.mood) / previousWeek.mood * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Progress Report</h2>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activity Completion</p>
                <p className="text-2xl font-bold text-green-600">{currentWeek.activities}%</p>
                <p className={`text-sm ${parseFloat(activityImprovement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(activityImprovement) >= 0 ? '+' : ''}{activityImprovement}% this week
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Games Played</p>
                <p className="text-2xl font-bold text-purple-600">{currentWeek.games}</p>
                <p className="text-sm text-green-600">
                  +{currentWeek.games - previousWeek.games} from last week
                </p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mood Score</p>
                <p className="text-2xl font-bold text-blue-600">{currentWeek.mood}/10</p>
                <p className={`text-sm ${parseFloat(moodImprovement) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(moodImprovement) >= 0 ? '+' : ''}{moodImprovement}% improvement
                </p>
              </div>
              <Heart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Progress</p>
                <p className="text-2xl font-bold text-orange-600">Excellent</p>
                <p className="text-sm text-green-600">Trending upward</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly progress chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Activity completion chart */}
            <div>
              <h3 className="font-semibold mb-3">Activity Completion Rate</h3>
              <div className="space-y-2">
                {weeklyData.map((week, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm">{week.week}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6">
                      <div 
                        className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${week.activities}%` }}
                      >
                        <span className="text-white text-xs font-semibold">{week.activities}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood progression */}
            <div>
              <h3 className="font-semibold mb-3">Mood Score Progression</h3>
              <div className="flex items-end space-x-4 h-32">
                {weeklyData.map((week, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-blue-500 rounded-t w-full flex items-end justify-center pb-2"
                      style={{ height: `${(week.mood / 10) * 100}%` }}
                    >
                      <span className="text-white text-xs font-semibold">{week.mood}</span>
                    </div>
                    <div className="text-xs mt-2">{week.week}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Milestones & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-3xl">{milestone.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{milestone.title}</h3>
                  <p className="text-gray-600 mt-1">{milestone.description}</p>
                  <p className="text-sm text-gray-500 mt-2">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations for Continued Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800">Keep Up the Great Work!</h3>
              <p className="text-green-700">The current routine is working excellently. Continue with the same activity schedule.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-800">Social Skills Focus</h3>
              <p className="text-blue-700">Consider adding more group activities or social interaction exercises to build on recent progress.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
              <h3 className="font-semibold text-purple-800">New Challenges</h3>
              <p className="text-purple-700">Ready for more advanced memory games and breathing exercises. Consider introducing new cognitive challenges.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressReport;
