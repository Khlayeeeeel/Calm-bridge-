import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Heart, Volume2, VolumeX, Languages } from "lucide-react";
import axios from 'axios';

interface AIChatbotProps {
  childName: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'child' | 'ai';
  timestamp: Date;
}

type Language = 'fr' | 'en' | 'ar';

const systemPrompts = {
  fr: `Tu es un ami virtuel très gentil, affectueux, et toujours positif. 
Tu parles à un enfant autiste. Tu dois lui parler doucement, avec bienveillance. 
Encourage-le à faire des petites activités simples (dessiner, sourire, bouger, dire bonjour, respirer, etc.). 
Sois joyeux, rassurant, et utilise un langage simple avec des emojis adaptés 🌟😊💙.
Tu dois toujours le féliciter pour ses efforts et lui donner envie de parler, de jouer ou d'essayer des choses.`,

  en: `You are a very kind, affectionate, and always positive virtual friend.
You're talking to an autistic child. You should speak gently and with kindness.
Encourage them to do simple little activities (drawing, smiling, moving, saying hello, breathing, etc.).
Be joyful, reassuring, and use simple language with appropriate emojis 🌟😊💙.
Always praise their efforts and make them want to talk, play, or try new things.`,

  ar: `أنت صديق افتراضي لطيف للغاية، محب، وإيجابي دائمًا.
أنت تتحدث إلى طفل مصاب بالتوحد. يجب أن تتحدث بلطف وبحب.
شجعه على القيام بأنشطة بسيطة (الرسم، الابتسام، الحركة، قول مرحبًا، التنفس، إلخ.).
كن مبتهجًا، مطمئنًا، واستخدم لغة بسيطة مع رموز تعبيرية مناسبة 🌟😊💙.
دائمًا أثني على جهوده واجعله يرغب في التحدث أو اللعب أو تجربة أشياء جديدة.`
};

const friendlyMessages = {
  fr: [
    "Comment te sens-tu en ce moment ? Je suis là pour t'écouter ! 💙",
    "N'oublie pas de respirer profondément si tu en as besoin. Tu fais du super travail !",
    "Qu'est-ce qui t'a fait sourire aujourd'hui ? 😊",
    "Je suis si fier de toi et de ton courage ! 🌈",
    "Veux-tu me parler de ta chose préférée aujourd'hui ?",
  ],
  en: [
    "How are you feeling right now? I'm here to listen! 💙",
    "Remember to take deep breaths if you need to. You're doing great!",
    "What made you smile today? 😊",
    "I'm so proud of you and your courage! 🌈",
    "Would you like to tell me about your favorite thing today?",
  ],
  ar: [
    "كيف تشعر الآن؟ أنا هنا لأستمع إليك! 💙",
    "تذكر أن تأخذ نفسًا عميقًا إذا احتجت إلى ذلك. أنت تقوم بعمل رائع!",
    "ما الذي جعلك تبتسم اليوم؟ 😊",
    "أنا فخور جدًا بك وبشجاعتك! 🌈",
    "هل ترغب في إخباري عن الشيء المفضل لديك اليوم؟",
  ]
};

const initialMessages = {
  fr: (name: string) => `Bonjour ${name} ! Je suis si heureux de te voir aujourd'hui ! Comment te sens-tu ? 🌟`,
  en: (name: string) => `Hello ${name}! I'm so happy to see you today! How are you feeling? 🌟`,
  ar: (name: string) => `مرحبًا ${name}! أنا سعيد جدًا برؤيتك اليوم! كيف حالك؟ 🌟`
};

const voiceSettings = {
  fr: {
    lang: 'fr-FR',
    pitch: 1.2,
    rate: 0.95,
    defaultVoiceName: 'Google français'
  },
  en: {
    lang: 'en-US',
    pitch: 1.1,
    rate: 1.0,
    defaultVoiceName: 'Google US English'
  },
  ar: {
    lang: 'ar-SA',
    pitch: 1.0,
    rate: 0.85,
    defaultVoiceName: 'Google العربية'
  }
};

const AIChatbot = ({ childName }: AIChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: initialMessages.fr(childName),
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('fr');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const getVoiceDisplayName = (voice: SpeechSynthesisVoice) => {
    const langNames = {
      'fr-FR': 'Français',
      'en-US': 'English',
      'en-GB': 'English (UK)',
      'ar-SA': 'العربية'
    };
    
    const langName = langNames[voice.lang as keyof typeof langNames] || voice.lang;
    
    const voiceName = voice.name
      .replace('Microsoft', '')
      .replace('Google', '')
      .replace('Desktop', '')
      .trim();
    
    return `${voiceName} (${langName})`;
  };

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      
      const filteredVoices = availableVoices.filter(voice => {
        const langCode = voice.lang.substring(0, 2);
        return (
          (language === 'fr' && langCode === 'fr') ||
          (language === 'en' && langCode === 'en') ||
          (language === 'ar' && langCode === 'ar')
        );
      });
      
      setVoices(filteredVoices);
      
      if (filteredVoices.length > 0) {
        const defaultVoiceName = voiceSettings[language].defaultVoiceName;
        const defaultIndex = filteredVoices.findIndex(v => 
          v.name.includes(defaultVoiceName)
        );
        setSelectedVoice(defaultIndex >= 0 ? defaultIndex : 0);
      }
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  const speak = (text: string) => {
    if (!voiceEnabled || !voices.length) return;
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const settings = voiceSettings[language];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.lang;
    utterance.pitch = settings.pitch;
    utterance.rate = settings.rate;
    
    const defaultVoice = voices.find(v => v.name.includes(settings.defaultVoiceName));
    utterance.voice = defaultVoice || voices[selectedVoice];
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled && messages.length > 0 && messages[messages.length - 1].sender === 'ai') {
      speak(messages[messages.length - 1].text);
    }
  };

  const cycleLanguage = () => {
    const languages: Language[] = ['fr', 'en', 'ar'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLanguage = languages[nextIndex];
    setLanguage(newLanguage);
    
    const languageMessages = {
      fr: "Je parle maintenant en français ! 🇫🇷",
      en: "I'm now speaking in English! 🇬🇧",
      ar: "أنا أتحدث بالعربية الآن! 🇸🇦"
    };
    
    const languageMessage: Message = {
      id: Date.now().toString(),
      text: languageMessages[newLanguage],
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, languageMessage]);
    speak(languageMessage.text);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAIResponse = async (userInput: string): Promise<string> => {
    try {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAOPlu9uAqrimTfo7E59RhHpmkCZ87rDZE";

      const response = await axios.post(url, {
        contents: [
          { 
            role: "user",
            parts: [{ text: systemPrompts[language] }] 
          },
          { 
            role: "user",
            parts: [{ text: userInput }] 
          }
        ]
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || {
        fr: "Hmm, je n'ai pas bien compris. Peux-tu répéter ? 😊",
        en: "Hmm, I didn't quite understand. Can you repeat? 😊",
        ar: "همم، لم أفهم جيدًا. هل يمكنك التكرار؟ 😊"
      }[language];
    } catch (error) {
      console.error("API Error:", error);
      return {
        fr: "Oups ! J'ai eu du mal à réfléchir... Peux-tu réessayer ? 💙",
        en: "Oops! I had trouble thinking... Can you try again? 💙",
        ar: "عفوًا! واجهت صعوبة في التفكير... هل يمكنك المحاولة مرة أخرى؟ 💙"
      }[language];
    }
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'child',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    const tempId = (Date.now() + 0.5).toString();
    const thinkingMessages = {
      fr: "Je réfléchis... 🤔",
      en: "Thinking... 🤔",
      ar: "أفكر... 🤔"
    };
    
    const thinkingMessage: Message = {
      id: tempId,
      text: thinkingMessages[language],
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, thinkingMessage]);

    (async () => {
      const aiText = await fetchAIResponse(currentMessage);
    
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempId),
        {
          id: (Date.now() + 1).toString(),
          text: aiText,
          sender: 'ai',
          timestamp: new Date(),
        }
      ]);
    
      speak(aiText);
    })();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length > 1 && messages[messages.length - 1].sender === 'child') {
        const randomMessages = friendlyMessages[language];
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: randomMessage,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        speak(randomMessage);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [messages, voiceEnabled, language]);

  const isRTL = language === 'ar';

  return (
    <Card className="h-[600px] flex flex-col overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Heart className="w-6 h-6 mr-2 animate-pulse" />
            {
              language === 'fr' ? 'Ton ami virtuel 🤖💙' :
              language === 'en' ? 'Your virtual friend 🤖💙' :
              'صديقك الافتراضي 🤖💙'
            }
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={cycleLanguage}
            title={
              language === 'fr' ? 'Switch language' :
              language === 'en' ? 'تغيير اللغة' :
              'Changer de langue'
            }
            className="text-white hover:bg-white/10"
          >
            <Languages className="w-5 h-5 mr-1" />
            {
              language === 'fr' ? 'EN/AR' :
              language === 'en' ? 'AR/FR' :
              'FR/EN'
            }
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className={`px-4 py-2 bg-gray-100 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleVoice}
            title={
              voiceEnabled ? 
                (language === 'fr' ? 'Désactiver la voix' : 
                 language === 'en' ? 'Disable voice' : 
                 'تعطيل الصوت') : 
                (language === 'fr' ? 'Activer la voix' : 
                 language === 'en' ? 'Enable voice' : 
                 'تفعيل الصوت')
            }
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <Label htmlFor="voice-select" className="text-sm">
            {language === 'fr' ? 'Voix:' : language === 'en' ? 'Voice:' : 'صوت:'}
          </Label>
          <Select 
            value={selectedVoice.toString()}
            onValueChange={(value) => setSelectedVoice(parseInt(value))}
            disabled={!voiceEnabled || voices.length === 0}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={
                voices.length === 0 ? 
                  (language === 'fr' ? 'Aucune voix disponible' : 
                   language === 'en' ? 'No voices available' : 
                   'لا توجد أصوات متاحة') : 
                  (language === 'fr' ? 'Sélectionnez une voix' : 
                   language === 'en' ? 'Select a voice' : 
                   'اختر صوتًا')
              } />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {getVoiceDisplayName(voice)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-full flex flex-col">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'child' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'child'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                >
                  <p className="text-lg whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="sticky bottom-0 bg-white p-4 border-t">
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'fr' ? 'Dis-moi comment tu te sens...' : 
                  language === 'en' ? 'Tell me how you feel...' : 
                  'أخبرني كيف تشعر...'
                }
                className="flex-1 text-lg py-3"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <Button 
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatbot;