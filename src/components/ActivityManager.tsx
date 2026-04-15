
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Clock } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  category: string;
  emoji: string;
  completed: boolean;
}

const ActivityManager = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: 'Morning Therapy',
      description: 'Fun exercises with therapist',
      time: '09:00',
      category: 'therapy',
      emoji: '🏃‍♂️',
      completed: true,
    },
    {
      id: 2,
      title: 'Art Time',
      description: 'Draw and paint beautiful pictures',
      time: '11:30',
      category: 'creative',
      emoji: '🎨',
      completed: false,
    },
    {
      id: 3,
      title: 'Lunch',
      description: 'Yummy lunch with family',
      time: '12:30',
      category: 'meal',
      emoji: '🍽️',
      completed: false,
    },
  ]);

  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    category: '',
    emoji: '',
  });

  const categories = [
    { value: 'therapy', label: 'Therapy', emoji: '🏥' },
    { value: 'creative', label: 'Creative', emoji: '🎨' },
    { value: 'meal', label: 'Meal', emoji: '🍽️' },
    { value: 'play', label: 'Play Time', emoji: '🎮' },
    { value: 'learning', label: 'Learning', emoji: '📚' },
    { value: 'rest', label: 'Rest', emoji: '😴' },
    { value: 'social', label: 'Social', emoji: '👥' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingActivity) {
      setActivities(prev => prev.map(activity => 
        activity.id === editingActivity.id 
          ? { ...activity, ...formData }
          : activity
      ));
      setEditingActivity(null);
    } else {
      const newActivity: Activity = {
        id: Date.now(),
        ...formData,
        completed: false,
      };
      setActivities(prev => [...prev, newActivity]);
    }

    setFormData({ title: '', description: '', time: '', category: '', emoji: '' });
    setIsAddingActivity(false);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      time: activity.time,
      category: activity.category,
      emoji: activity.emoji,
    });
    setIsAddingActivity(true);
  };

  const handleDelete = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find(c => c.value === value);
    setFormData(prev => ({
      ...prev,
      category: value,
      emoji: category?.emoji || '',
    }));
  };

  const toggleCompletion = (id: number) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id 
        ? { ...activity, completed: !activity.completed }
        : activity
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Activity Management</h2>
        <Button 
          onClick={() => setIsAddingActivity(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {isAddingActivity && (
        <Card>
          <CardHeader>
            <CardTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Activity Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Morning Therapy"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the activity"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.emoji} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    value={formData.emoji}
                    onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                    placeholder="🎨"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingActivity ? 'Update Activity' : 'Add Activity'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingActivity(false);
                    setEditingActivity(null);
                    setFormData({ title: '', description: '', time: '', category: '', emoji: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {activities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No activities scheduled yet. Add your first activity!</p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className={activity.completed ? 'bg-green-50' : 'bg-white'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-3xl">{activity.emoji}</div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${activity.completed ? 'line-through text-gray-500' : ''}`}>
                        {activity.title}
                      </h3>
                      <p className="text-gray-600">{activity.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={activity.completed ? "default" : "outline"}
                      onClick={() => toggleCompletion(activity.id)}
                    >
                      {activity.completed ? 'Completed' : 'Mark Complete'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(activity.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityManager;
