import { Navigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Chat() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold mb-3">No messages yet</h1>
        <p className="text-muted-foreground max-w-sm mb-8">
          When someone reaches out through your profile, your conversations will appear here.
          Start by making your profile visible in the directory.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/directory">
            <Button className="gap-2">
              <Users className="w-4 h-4" />
              Browse Directory
            </Button>
          </Link>
          <Link to="/profile/edit">
            <Button variant="outline">Edit Your Profile</Button>
          </Link>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
