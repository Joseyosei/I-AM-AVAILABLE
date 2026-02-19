import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileCard } from '@/components/ProfileCard';
import { mockProfiles } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

export default function SavedProfiles() {
  const { isAuthenticated, user } = useAuth();
  // Mock: first 4 profiles are "saved"
  const [savedIds, setSavedIds] = useState<string[]>(['1', '2', '3', '4']);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const savedProfiles = mockProfiles.filter((p) => savedIds.includes(p.id));

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Saved Profiles</h1>
          <p className="text-muted-foreground">
            {savedProfiles.length} profile{savedProfiles.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {savedProfiles.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">No saved profiles</h3>
            <p className="text-muted-foreground">Browse the directory and save profiles you're interested in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProfiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
