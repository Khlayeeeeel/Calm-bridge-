
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Stethoscope, Heart } from "lucide-react";
import type { User as UserType } from "@/pages/Index";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'parent' | 'doctor' | 'child';
  content: string;
  timestamp: Date;
}

interface ChatSystemProps {
  currentUser: UserType;
  chatType: 'parent-doctor' | 'parent-child' | 'doctor-parent';
  recipientName?: string;
}

const ChatSystem = ({ currentUser, chatType, recipientName }: ChatSystemProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize different conversations based on chat type
    if (chatType === 'parent-doctor' || chatType === 'doctor-parent') {
      return [
        {
          id: '1',
          senderId: 'demo-doctor',
          senderName: 'Dr. Smith',
          senderRole: 'doctor',
          content: 'Hello! I wanted to discuss Emma\'s progress this week. She\'s showing great improvement in her activity completion.',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          content: currentUser.role === 'doctor' 
            ? 'Thank you for staying in touch. I\'ll review her progress and provide an updated assessment.'
            : 'Thank you for the update! I\'ve noticed she seems more engaged with her activities lately.',
          timestamp: new Date(Date.now() - 1800000),
        },
      ];
    } else {
      return [
        {
          id: '1',
          senderId: 'demo-child',
          senderName: 'Emma',
          senderRole: 'child',
          content: 'Hi Mom! I had so much fun playing the memory game today! 🌟',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          content: currentUser.role === 'child'
            ? 'Mom, can we play together later? I want to show you my new game!'
            : 'That\'s wonderful, sweetheart! I\'m so proud of you. What was your favorite part?',
          timestamp: new Date(Date.now() - 1800000),
        },
      ];
    }
  });
  
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role,
        content: newMessage.trim(),
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getChatTitle = () => {
    switch (chatType) {
      case 'parent-doctor':
        return 'Chat with Doctor';
      case 'doctor-parent':
        return 'Chat with Parent';
      case 'parent-child':
        return currentUser.role === 'parent' ? 'Chat with Your Child' : 'Chat with Mom/Dad';
      default:
        return 'Chat';
    }
  };

  const getMessageIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <Stethoscope className="w-4 h-4" />;
      case 'child':
        return <Heart className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{getChatTitle()}</CardTitle>
        {recipientName && (
          <p className="text-sm text-gray-600">Chatting with {recipientName}</p>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getMessageIcon(message.senderRole)}
                  <span className="text-xs font-medium">{message.senderName}</span>
                </div>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSystem;
