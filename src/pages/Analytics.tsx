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

const viewsData = [
  { day: 'Mon', views: 12, clicks: 3 },
  { day: 'Tue', views: 19, clicks: 5 },
  { day: 'Wed', views: 15, clicks: 4 },
  { day: 'Thu', views: 28, clicks: 8 },
  { day: 'Fri', views: 32, clicks: 11 },
  { day: 'Sat', views: 24, clicks: 7 },
  { day: 'Sun', views: 18, clicks: 6 },
];

const monthlyData = [
  { month: 'Sep', views: 180 },
  { month: 'Oct', views: 240 },
  { month: 'Nov', views: 310 },
  { month: 'Dec', views: 420 },
  { month: 'Jan', views: 520 },
  { month: 'Feb', views: 610 },
];

const sourceData = [
  { name: 'Directory', value: 45 },
  { name: 'Search', value: 25 },
  { name: 'Direct Link', value: 20 },
  { name: 'Referral', value: 10 },
];

const PIE_COLORS = ['hsl(160, 84%, 39%)', 'hsl(160, 60%, 55%)', 'hsl(160, 40%, 70%)', 'hsl(220, 13%, 70%)'];

export default function Analytics() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const summaryStats = [
    { label: 'Total Views', value: '1,247', change: '+12%', up: true, icon: Eye },
    { label: 'Contact Clicks', value: '89', change: '+8%', up: true, icon: MousePointerClick },
    { label: 'Profile Rank', value: '#24', change: '+3', up: true, icon: TrendingUp },
    { label: 'Conversion Rate', value: '7.1%', change: '-0.3%', up: false, icon: ArrowUpRight },
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-6"
        >
          <h2 className="font-serif text-xl font-semibold mb-4">Views & Clicks This Week</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Area type="monotone" dataKey="views" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="clicks" stroke="hsl(160, 60%, 55%)" fill="hsl(160, 60%, 55%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Monthly Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <YAxis tick={{ fill: 'hsl(220, 9%, 46%)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="views" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="font-serif text-xl font-semibold mb-4">Traffic Sources</h2>
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
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
