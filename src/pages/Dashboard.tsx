import { Link, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth, Profile } from '@/contexts/AuthContext';
import { Eye, MousePointerClick, Sparkles, Edit, Users, ArrowUpRight, ChartColumn, Bookmark, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

function getProfileCompleteness(p: Profile) {
  const fields = [
    !!p.name,
    !!p.role,
    !!p.location,
    !!p.bio && p.bio.length > 20,
    !!p.avatar,
    p.skills.length > 0,
    p.open_to.length > 0,
    !!p.contact_email,
    !!p.twitter || !!p.telegram,
    p.portfolio_links.length > 0,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function Dashboard() {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated || !profile) return <Navigate to="/login" replace />;

  const completeness = getProfileCompleteness(profile);

  const stats = [
    { icon: Eye, label: 'Profile Views', value: profile.profile_views.toLocaleString(), change: '+12% this week' },
    { icon: MousePointerClick, label: 'Contact Clicks', value: profile.contact_clicks.toLocaleString(), change: '+8% this week' },
    { icon: Sparkles, label: 'Subscription Tier', value: profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1), badge: profile.tier },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Welcome back, {profile.name.split(' ')[0] || 'there'}!</h1>
          <p className="text-muted-foreground">Here's an overview of your profile performance</p>
        </div>

        {completeness < 100 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-semibold">Complete Your Profile</h2>
              <span className="text-sm font-medium text-primary">{completeness}%</span>
            </div>
            <Progress value={completeness} className="h-2 mb-3" />
            <p className="text-sm text-muted-foreground mb-3">A complete profile gets up to 5x more views.</p>
            <Link to="/dashboard/profile"><Button size="sm" variant="outline" className="gap-2"><Edit className="w-4 h-4" /> Complete Profile</Button></Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="dashboard-stat">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center gap-2">
                  <p className="font-serif text-2xl font-bold">{stat.value}</p>
                  {stat.badge && (
                    <Badge variant={stat.badge === 'free' ? 'secondary' : 'default'} className="text-xs">
                      {stat.badge === 'premium' && <Sparkles className="w-3 h-3 mr-1" />}
                      {stat.badge.toUpperCase()}
                    </Badge>
                  )}
                </div>
                {stat.change && <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Profile Status</h2>
          <div className="flex flex-wrap gap-3">
            <Badge variant={profile.availability === 'available' ? 'default' : 'secondary'} className="text-sm py-1.5">
              <span className={`w-2 h-2 rounded-full mr-2 ${profile.availability === 'available' ? 'bg-green-400 animate-pulse' : profile.availability === 'open' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
              {profile.availability === 'available' ? 'Available Now' : profile.availability === 'open' ? 'Open to Conversations' : 'Not Available'}
            </Badge>
            <Badge variant="outline" className="text-sm py-1.5">{profile.tier.toUpperCase()} Tier</Badge>
            {profile.featured && <Badge variant="outline" className="text-sm py-1.5"><Sparkles className="w-3 h-3 mr-1" />Featured</Badge>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/profile"><Button className="gap-2"><Edit className="w-4 h-4" />Edit Your Profile</Button></Link>
            <Link to="/dashboard/analytics"><Button variant="outline" className="gap-2"><ChartColumn className="w-4 h-4" />View Analytics</Button></Link>
            <Link to="/dashboard/saved"><Button variant="outline" className="gap-2"><Bookmark className="w-4 h-4" />Saved Profiles</Button></Link>
            <Link to="/dashboard/post-job"><Button variant="outline" className="gap-2"><Plus className="w-4 h-4" />Post a Job</Button></Link>
            <Link to="/directory"><Button variant="outline" className="gap-2"><Users className="w-4 h-4" />View Directory</Button></Link>
            {profile.tier === 'free' && (
              <Link to="/pricing"><Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"><ArrowUpRight className="w-4 h-4" />Upgrade to Pro</Button></Link>
            )}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
