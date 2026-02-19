import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Bell, Eye, MessageSquare, Briefcase, UserPlus, CheckCheck, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'view' | 'message' | 'job' | 'connection';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'view', title: 'Profile viewed', description: 'Sarah Chen viewed your profile', time: '5 min ago', read: false },
  { id: '2', type: 'message', title: 'New message', description: 'Marcus Johnson sent you a message', time: '15 min ago', read: false },
  { id: '3', type: 'job', title: 'Job match found', description: 'Senior Full-Stack Developer at TechVentures matches your skills', time: '1 hour ago', read: false },
  { id: '4', type: 'connection', title: 'New follower', description: 'Elena Rodriguez saved your profile', time: '2 hours ago', read: false },
  { id: '5', type: 'view', title: 'Profile viewed', description: 'David Kim viewed your profile', time: '3 hours ago', read: true },
  { id: '6', type: 'message', title: 'New message', description: 'Aisha Patel sent you a message', time: '5 hours ago', read: true },
  { id: '7', type: 'job', title: 'New job posted', description: 'Freelance Brand Designer role posted by Bloom Agency', time: '1 day ago', read: true },
  { id: '8', type: 'view', title: 'Profile viewed', description: 'Michael Brown viewed your profile', time: '1 day ago', read: true },
  { id: '9', type: 'connection', title: 'Profile saved', description: 'James Wilson saved your profile', time: '2 days ago', read: true },
];

const typeIcons = {
  view: Eye,
  message: MessageSquare,
  job: Briefcase,
  connection: UserPlus,
};

const typeColors = {
  view: 'text-primary',
  message: 'text-blue-500',
  job: 'text-yellow-500',
  connection: 'text-purple-500',
};

export default function Notifications() {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold mb-1">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>
            All
          </Button>
          <Button variant={filter === 'unread' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('unread')}>
            Unread {unreadCount > 0 && <Badge variant="secondary" className="ml-1 text-xs">{unreadCount}</Badge>}
          </Button>
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </div>
          ) : (
            filtered.map((notification, i) => {
              const Icon = typeIcons[notification.type];
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                    notification.read
                      ? 'bg-card border-border'
                      : 'bg-primary/5 border-primary/20'
                  }`}
                  onClick={() => markRead(notification.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notification.read ? 'bg-secondary' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-5 h-5 ${typeColors[notification.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${notification.read ? 'font-medium' : 'font-semibold'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
