import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCard } from '@/components/ProfileCard';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/types';
import { motion } from 'framer-motion';
import { Bookmark, Loader2 } from 'lucide-react';

function dbToUserProfile(p: any): UserProfile {
  return {
    id: p.id, name: p.name, email: p.email, role: p.role, location: p.location,
    bio: p.bio, avatar: p.avatar, availability: p.availability, openTo: p.open_to || [],
    skills: p.skills || [], contactEmail: p.contact_email, twitter: p.twitter,
    telegram: p.telegram, calendarLink: p.calendar_link, portfolioLinks: p.portfolio_links || [],
    tier: p.tier, featured: p.featured, profileViews: p.profile_views,
    contactClicks: p.contact_clicks, createdAt: p.created_at, lastActive: p.last_active,
  };
}

export default function SavedProfiles() {
  const { isAuthenticated, user, loading } = useAuth();
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('saved_profiles')
        .select('saved_profile_id, profiles!saved_profiles_saved_profile_id_fkey(*)')
        .eq('user_id', user.id);
      if (data) {
        const mapped = data
          .map((d: any) => d.profiles)
          .filter(Boolean)
          .map(dbToUserProfile);
        setSavedProfiles(mapped);
      }
      setIsLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Saved Profiles</h1>
          <p className="text-muted-foreground">{savedProfiles.length} profile{savedProfiles.length !== 1 ? 's' : ''} saved</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : savedProfiles.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">No saved profiles</h3>
            <p className="text-muted-foreground">Browse the directory and save profiles you're interested in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProfiles.map((profile, i) => (
              <motion.div key={profile.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
