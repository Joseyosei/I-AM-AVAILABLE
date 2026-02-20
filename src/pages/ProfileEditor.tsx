import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { OPEN_TO_LABELS, OpenToOption, AvailabilityStatus, TIER_LIMITS } from '@/lib/types';
import { Upload, X, Plus, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function ProfileEditor() {
  const { isAuthenticated, profile, loading, updateProfile } = useAuth();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    bio: '',
    availability: 'available' as string,
    open_to: [] as string[],
    skills: [] as string[],
    contact_email: '',
    twitter: '',
    telegram: '',
    calendar_link: '',
    portfolio_links: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        role: profile.role || '',
        location: profile.location || '',
        bio: profile.bio || '',
        availability: profile.availability || 'available',
        open_to: profile.open_to || [],
        skills: profile.skills || [],
        contact_email: profile.contact_email || '',
        twitter: profile.twitter || '',
        telegram: profile.telegram || '',
        calendar_link: profile.calendar_link || '',
        portfolio_links: profile.portfolio_links || [],
      });
    }
  }, [profile]);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></DashboardLayout>;
  if (!isAuthenticated || !profile) return <Navigate to="/login" replace />;

  const tier = (profile.tier || 'free') as keyof typeof TIER_LIMITS;
  const tierLimits = TIER_LIMITS[tier];
  const canAddSkill = formData.skills.length < tierLimits.skills;
  const canAddPortfolioLink = formData.portfolio_links.length < tierLimits.portfolioLinks;

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
    toast({ title: 'Profile saved!', description: 'Your changes have been saved successfully.' });
  };

  const addSkill = () => {
    if (newSkill.trim() && canAddSkill && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && canAddPortfolioLink) {
      setFormData({ ...formData, portfolio_links: [...formData.portfolio_links, newPortfolioLink.trim()] });
      setNewPortfolioLink('');
    }
  };

  const removePortfolioLink = (link: string) => setFormData({ ...formData, portfolio_links: formData.portfolio_links.filter(l => l !== link) });

  const toggleOpenTo = (option: string) => {
    const newOpenTo = formData.open_to.includes(option)
      ? formData.open_to.filter(o => o !== option)
      : [...formData.open_to, option];
    setFormData({ ...formData, open_to: newOpenTo });
  };

  const initials = formData.name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information and availability</p>
        </div>

        {/* Avatar */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Profile Photo</h2>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={profile.avatar} alt={formData.name} />
              <AvatarFallback className="bg-secondary text-2xl font-medium">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="gap-2"><Upload className="w-4 h-4" />Upload Photo</Button>
              <p className="text-xs text-muted-foreground mt-2">Max file size: 2MB</p>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" /></div>
          <div className="space-y-2"><Label htmlFor="role">Role / Title</Label><Input id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Full-Stack Developer" /></div>
          <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="San Francisco, CA" /></div>
          <div className="space-y-2">
            <div className="flex justify-between"><Label htmlFor="bio">Bio</Label><span className="text-xs text-muted-foreground">{formData.bio.length} / {tierLimits.bioLength}</span></div>
            <Textarea id="bio" value={formData.bio} onChange={(e) => { if (e.target.value.length <= tierLimits.bioLength) setFormData({ ...formData, bio: e.target.value }); }} placeholder="Tell people about yourself..." rows={4} />
          </div>
        </section>

        {/* Availability */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Availability Status</h2>
          <RadioGroup value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })} className="space-y-3">
            <div className="flex items-center space-x-3"><RadioGroupItem value="available" id="available" /><Label htmlFor="available" className="flex items-center gap-2 cursor-pointer"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />Available Now</Label></div>
            <div className="flex items-center space-x-3"><RadioGroupItem value="open" id="open" /><Label htmlFor="open" className="flex items-center gap-2 cursor-pointer"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />Open to Conversations</Label></div>
            <div className="flex items-center space-x-3"><RadioGroupItem value="unavailable" id="unavailable" /><Label htmlFor="unavailable" className="flex items-center gap-2 cursor-pointer"><span className="w-2.5 h-2.5 rounded-full bg-gray-400" />Not Available</Label></div>
          </RadioGroup>
        </section>

        {/* Open To */}
        <section className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-serif text-lg font-semibold mb-4">Open To</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(OPEN_TO_LABELS) as OpenToOption[]).map((option) => (
              <div key={option} className="flex items-center space-x-3">
                <Checkbox id={option} checked={formData.open_to.includes(option)} onCheckedChange={() => toggleOpenTo(option)} />
                <Label htmlFor={option} className="cursor-pointer">{OPEN_TO_LABELS[option]}</Label>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-lg font-semibold">Skills</h2>
            <span className="text-xs text-muted-foreground">{formData.skills.length} of {tierLimits.skills === Infinity ? '∞' : tierLimits.skills} skills</span>
          </div>
          <div className="flex gap-2 mb-4">
            <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === 'Enter' && addSkill()} disabled={!canAddSkill} />
            <Button onClick={addSkill} disabled={!canAddSkill || !newSkill.trim()}><Plus className="w-4 h-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill) => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm">{skill}<button onClick={() => removeSkill(skill)} className="hover:text-destructive"><X className="w-3 h-3" /></button></span>
            ))}
          </div>
        </section>

        {/* Contact Methods */}
        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-lg font-semibold mb-4">Contact Methods</h2>
          <div className="space-y-2"><Label htmlFor="contactEmail">Email</Label><Input id="contactEmail" type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} placeholder="you@example.com" /></div>
          <div className="space-y-2"><Label htmlFor="twitter">Twitter Handle</Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span><Input id="twitter" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} placeholder="username" className="pl-8" /></div></div>
          <div className="space-y-2"><Label htmlFor="telegram">Telegram Handle</Label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span><Input id="telegram" value={formData.telegram} onChange={(e) => setFormData({ ...formData, telegram: e.target.value })} placeholder="username" className="pl-8" /></div></div>
          <div className="space-y-2"><Label htmlFor="calendarLink">Calendar Link</Label><Input id="calendarLink" value={formData.calendar_link} onChange={(e) => setFormData({ ...formData, calendar_link: e.target.value })} placeholder="https://cal.com/yourname" /></div>
        </section>

        {/* Portfolio Links */}
        <section className="bg-card border border-border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-lg font-semibold">Portfolio Links</h2>
            <span className="text-xs text-muted-foreground">{formData.portfolio_links.length} of {tierLimits.portfolioLinks === Infinity ? '∞' : tierLimits.portfolioLinks} links</span>
          </div>
          {tierLimits.portfolioLinks === 0 ? (
            <p className="text-sm text-muted-foreground">Upgrade to Pro to add portfolio links</p>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Input value={newPortfolioLink} onChange={(e) => setNewPortfolioLink(e.target.value)} placeholder="https://yourportfolio.com" onKeyDown={(e) => e.key === 'Enter' && addPortfolioLink()} disabled={!canAddPortfolioLink} />
                <Button onClick={addPortfolioLink} disabled={!canAddPortfolioLink || !newPortfolioLink.trim()}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="space-y-2">
                {formData.portfolio_links.map((link) => (
                  <div key={link} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">{link}</a>
                    <button onClick={() => removePortfolioLink(link)} className="text-muted-foreground hover:text-destructive ml-2"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <Button onClick={handleSave} size="lg" className="w-full" disabled={isSaving}>
          {isSaving ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>) : (<><Check className="w-4 h-4 mr-2" />Save Profile</>)}
        </Button>
      </motion.div>
    </DashboardLayout>
  );
}
