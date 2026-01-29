import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const planFeatures = {
  free: ['Create profile', 'Browse directory', '1 skill tag'],
  pro: ['Featured placement', 'Unlimited skills', '3 portfolio links'],
  premium: ['Homepage featured', 'Weekly newsletter', 'Priority support'],
};

export default function Settings() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return;
    
    setIsUpdatingEmail(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdatingEmail(false);
    setNewEmail('');
    toast({
      title: 'Email updated!',
      description: 'Your email has been changed successfully.',
    });
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdatingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    toast({
      title: 'Password updated!',
      description: 'Your password has been changed successfully.',
    });
  };

  const handleDeleteAccount = () => {
    logout();
    toast({
      title: 'Account deleted',
      description: 'Your account has been permanently deleted.',
    });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl space-y-8"
      >
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and subscription
          </p>
        </div>

        {/* Subscription */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold">Subscription</h2>
            <Badge variant={user.tier === 'free' ? 'secondary' : 'default'}>
              {user.tier === 'premium' && <Sparkles className="w-3 h-3 mr-1" />}
              {user.tier.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-2xl font-bold mb-4">
            {user.tier === 'free' ? '$0' : user.tier === 'pro' ? '$29' : '$79'}
            <span className="text-base font-normal text-muted-foreground">/month</span>
          </p>
          
          <ul className="space-y-2 mb-6">
            {planFeatures[user.tier].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          
          {user.tier === 'free' ? (
            <Link to="/pricing">
              <Button className="w-full gap-2">
                <Sparkles className="w-4 h-4" />
                Upgrade Plan
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full">
              Manage Billing
            </Button>
          )}
        </section>

        {/* Email */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Email Address</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Current email: <span className="text-foreground font-medium">{user.email}</span>
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="newemail@example.com"
              />
            </div>
            <Button 
              onClick={handleUpdateEmail} 
              disabled={!newEmail.trim() || isUpdatingEmail}
            >
              {isUpdatingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Email'
              )}
            </Button>
          </div>
        </section>

        {/* Password */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Change Password</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button 
              onClick={handleUpdatePassword} 
              disabled={!newPassword || !confirmPassword || isUpdatingPassword}
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-card border border-destructive/30 rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold text-destructive mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </motion.div>
    </DashboardLayout>
  );
}
