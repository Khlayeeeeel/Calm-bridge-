
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Calendar, TrendingUp, Heart } from "lucide-react";
import type { User } from "@/pages/Index";

interface Rating {
  id: string;
  childName: string;
  weeklyRating: number;
  progressRating: number;
  notes: string;
  date: Date;
  type: 'weekly' | 'progress';
}

interface DoctorRatingSystemProps {
  currentUser: User;
}

const DoctorRatingSystem = ({ currentUser }: DoctorRatingSystemProps) => {
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: '1',
      childName: 'Emma',
      weeklyRating: 4,
      progressRating: 5,
      notes: 'Excellent progress this week. Emma showed significant improvement in social interactions and completed all therapy activities.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: 'weekly',
    },
    {
      id: '2',
      childName: 'Alex',
      weeklyRating: 3,
      progressRating: 4,
      notes: 'Good progress overall. Alex is becoming more comfortable with routine changes and showing better emotional regulation.',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      type: 'progress',
    },
  ]);

  const [selectedChild, setSelectedChild] = useState('Emma');
  const [ratingType, setRatingType] = useState<'weekly' | 'progress'>('weekly');
  const [currentRating, setCurrentRating] = useState(0);
  const [notes, setNotes] = useState('');

  const handleSubmitRating = () => {
    if (currentRating > 0) {
      const newRating: Rating = {
        id: Date.now().toString(),
        childName: selectedChild,
        weeklyRating: ratingType === 'weekly' ? currentRating : 0,
        progressRating: ratingType === 'progress' ? currentRating : 0,
        notes,
        date: new Date(),
        type: ratingType,
      };
      setRatings([newRating, ...ratings]);
      setCurrentRating(0);
      setNotes('');
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const childrenList = ['Emma', 'Alex', 'Sam', 'Lily'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Create New Rating
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Child Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Child</label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {childrenList.map((child) => (
                <option key={child} value={child}>{child}</option>
              ))}
            </select>
          </div>

          {/* Rating Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating Type</label>
            <div className="flex gap-4">
              <Button
                variant={ratingType === 'weekly' ? 'default' : 'outline'}
                onClick={() => setRatingType('weekly')}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Weekly Rating
              </Button>
              <Button
                variant={ratingType === 'progress' ? 'default' : 'outline'}
                onClick={() => setRatingType('progress')}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                15-Day Progress
              </Button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {ratingType === 'weekly' ? 'Weekly Performance' : 'Overall Progress'} (1-5 stars)
            </label>
            {renderStars(currentRating, true, setCurrentRating)}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes & Observations</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter detailed observations about the child's progress, behavior, and recommendations..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleSubmitRating} disabled={currentRating === 0} className="w-full">
            Submit {ratingType === 'weekly' ? 'Weekly' : 'Progress'} Rating
          </Button>
        </CardContent>
      </Card>

      {/* Recent Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{rating.childName}</h4>
                  <p className="text-sm text-gray-600">
                    {rating.type === 'weekly' ? 'Weekly Rating' : '15-Day Progress'} - {rating.date.toLocaleDateString()}
                  </p>
                </div>
                {renderStars(rating.type === 'weekly' ? rating.weeklyRating : rating.progressRating)}
              </div>
              <p className="text-sm text-gray-700">{rating.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorRatingSystem;
