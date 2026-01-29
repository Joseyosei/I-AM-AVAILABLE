import { Link, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, MousePointerClick, Sparkles, Edit, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    {
      icon: Eye,
      label: 'Profile Views',
      value: user.profileViews.toLocaleString(),
      change: '+12% this week',
    },
    {
      icon: MousePointerClick,
      label: 'Contact Clicks',
      value: user.contactClicks.toLocaleString(),
      change: '+8% this week',
    },
    {
      icon: Sparkles,
      label: 'Subscription Tier',
      value: user.tier.charAt(0).toUpperCase() + user.tier.slice(1),
      badge: user.tier,
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your profile performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="dashboard-stat"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-2xl font-bold">{stat.value}</p>
                  {stat.badge && (
                    <Badge
                      variant={stat.badge === 'free' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {stat.badge === 'premium' && <Sparkles className="w-3 h-3 mr-1" />}
                      {stat.badge.toUpperCase()}
                    </Badge>
                  )}
                </div>
                {stat.change && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Profile Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Profile Status</h2>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant={user.availability === 'available' ? 'default' : 'secondary'}
              className="text-sm py-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  user.availability === 'available'
                    ? 'bg-green-400 animate-pulse'
                    : user.availability === 'open'
                    ? 'bg-yellow-400'
                    : 'bg-gray-400'
                }`}
              />
              {user.availability === 'available'
                ? 'Available Now'
                : user.availability === 'open'
                ? 'Open to Conversations'
                : 'Not Available'}
            </Badge>
            <Badge variant="outline" className="text-sm py-1.5">
              {user.tier.toUpperCase()} Tier
            </Badge>
            {user.featured && (
              <Badge variant="outline" className="text-sm py-1.5">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/profile">
              <Button className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Your Profile
              </Button>
            </Link>
            <Link to="/directory">
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                View Directory
              </Button>
            </Link>
            {user.tier === 'free' && (
              <Link to="/pricing">
                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <ArrowUpRight className="w-4 h-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
