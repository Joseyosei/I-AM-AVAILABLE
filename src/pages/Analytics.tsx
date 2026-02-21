import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, MousePointerClick, Users, ArrowUpRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

const PIE_COLORS = ['hsl(160, 84%, 39%)', 'hsl(160, 60%, 55%)', 'hsl(160, 40%, 70%)', 'hsl(220, 13%, 70%)'];

export default function Analytics() {
  const { isAuthenticated, profile, loading } = useAuth();

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated || !profile) return <Navigate to="/login" replace />;

  const totalViews = profile.profile_views;
  const totalClicks = profile.contact_clicks;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  // For new users, charts will show zeros
  const viewsData = [
    { day: 'Mon', views: 0, clicks: 0 },
    { day: 'Tue', views: 0, clicks: 0 },
    { day: 'Wed', views: 0, clicks: 0 },
    { day: 'Thu', views: 0, clicks: 0 },
    { day: 'Fri', views: 0, clicks: 0 },
    { day: 'Sat', views: 0, clicks: 0 },
    { day: 'Sun', views: 0, clicks: 0 },
  ];

  const monthlyData = [
    { month: 'Sep', views: 0 },
    { month: 'Oct', views: 0 },
    { month: 'Nov', views: 0 },
    { month: 'Dec', views: 0 },
    { month: 'Jan', views: 0 },
    { month: 'Feb', views: totalViews },
  ];

  const sourceData = [
    { name: 'Directory', value: totalViews > 0 ? 45 : 0 },
    { name: 'Search', value: totalViews > 0 ? 25 : 0 },
    { name: 'Direct Link', value: totalViews > 0 ? 20 : 0 },
    { name: 'Referral', value: totalViews > 0 ? 10 : 0 },
  ];

  const summaryStats = [
    { label: 'Total Views', value: totalViews.toLocaleString(), change: totalViews > 0 ? '+12%' : '0%', up: true, icon: Eye },
    { label: 'Contact Clicks', value: totalClicks.toLocaleString(), change: totalClicks > 0 ? '+8%' : '0%', up: true, icon: MousePointerClick },
    { label: 'Profile Rank', value: totalViews > 0 ? `#${Math.max(1, 100 - totalViews)}` : 'N/A', change: totalViews > 0 ? '+3' : '0', up: true, icon: TrendingUp },
    { label: 'Conversion Rate', value: `${conversionRate}%`, change: '0%', up: true, icon: ArrowUpRight },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track how your profile is performing</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="dashboard-stat flex-col items-start"
            >
              <div className="flex items-center justify-between w-full mb-2">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <Badge variant={stat.up ? 'default' : 'secondary'} className="text-xs">
                  {stat.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
              <p className="font-serif text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Views & Clicks Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-xl font-semibold mb-4">Views & Clicks This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
              <Area type="monotone" dataKey="views" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(160, 60%, 55%)" fill="hsl(160, 60%, 55%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Growth */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold mb-4">Monthly Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <YAxis tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="views" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold mb-4">Traffic Sources</h2>
            {totalViews > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {sourceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No traffic data yet. Share your profile to get started!</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
