import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Search, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const mockContacts: ChatContact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    role: 'Full-Stack Developer',
    lastMessage: 'Sounds great! Let\'s schedule a call.',
    time: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    role: 'Product Designer',
    lastMessage: 'I\'d love to collaborate on that project.',
    time: '1h ago',
    unread: 0,
    online: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    role: 'Startup Founder',
    lastMessage: 'Can you send me the pitch deck?',
    time: '3h ago',
    unread: 1,
    online: false,
  },
  {
    id: '4',
    name: 'James Park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    role: 'Data Scientist',
    lastMessage: 'The model is looking promising!',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', senderId: '1', text: 'Hey! I saw your profile. Impressive work with React.', time: '10:30 AM' },
    { id: '2', senderId: 'me', text: 'Thanks Sarah! I noticed you\'re working on some cool projects too.', time: '10:32 AM' },
    { id: '3', senderId: '1', text: 'Yes! I\'m looking for a co-founder for my new SaaS idea. Would you be interested?', time: '10:33 AM' },
    { id: '4', senderId: 'me', text: 'Absolutely! Tell me more about it.', time: '10:35 AM' },
    { id: '5', senderId: '1', text: 'Sounds great! Let\'s schedule a call.', time: '10:36 AM' },
  ],
  '2': [
    { id: '1', senderId: '2', text: 'Hi! Love your design work.', time: '9:00 AM' },
    { id: '2', senderId: 'me', text: 'Thank you Marcus! Your portfolio is incredible.', time: '9:05 AM' },
    { id: '3', senderId: '2', text: 'I\'d love to collaborate on that project.', time: '9:10 AM' },
  ],
  '3': [
    { id: '1', senderId: 'me', text: 'Hi Elena, great to connect!', time: 'Yesterday' },
    { id: '2', senderId: '3', text: 'Can you send me the pitch deck?', time: 'Yesterday' },
  ],
};

export default function Chat() {
  const { isAuthenticated, loading } = useAuth();
  const [selectedContact, setSelectedContact] = useState<ChatContact>(mockContacts[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const currentMessages = messages[selectedContact.id] || [];

  const filteredContacts = mockContacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageText,
      time: 'Just now',
    };
    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg],
    }));
    setMessageText('');
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex bg-card border border-border rounded-lg overflow-hidden"
      >
        {/* Contacts Sidebar */}
        <div className="w-80 border-r border-border flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-border">
            <h2 className="font-serif text-lg font-semibold mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left ${
                  selectedContact.id === contact.id ? 'bg-secondary' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{contact.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{contact.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{selectedContact.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.online ? 'Online' : 'Offline'} · {selectedContact.role}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.senderId === 'me'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
