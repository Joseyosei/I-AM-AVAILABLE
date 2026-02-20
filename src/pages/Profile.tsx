import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { OPEN_TO_LABELS, OpenToOption } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import {
  MapPin, Mail, Twitter, Calendar, Sparkles,
  ArrowLeft, Eye, MousePointerClick, ExternalLink,
  Send, Star, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  user_id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
  availability: string;
  open_to: string[];
  skills: string[];
  contact_email: string | null;
  twitter: string | null;
  telegram: string | null;
  calendar_link: string | null;
  portfolio_links: string[];
  tier: string;
  featured: boolean;
  profile_views: number;
  contact_clicks: number;
  created_at: string;
}

interface Endorsement {
  id: string;
  content: string;
  relationship: string;
  created_at: string;
  author_profile?: { name: string; role: string; avatar: string } | null;
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endorseText, setEndorseText] = useState('');
  const [endorseRelation, setEndorseRelation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const { data } = await supabase.from('profiles').select('*').eq('id', username).maybeSingle();
      if (data) {
        setProfile(data as ProfileData);
        // Fetch endorsements
        const { data: endorseData } = await supabase
          .from('endorsements')
          .select('*, profiles!endorsements_author_id_fkey(name, role, avatar)')
          .eq('profile_id', data.id)
          .order('created_at', { ascending: false });
        if (endorseData) {
          setEndorsements(endorseData.map((e: any) => ({
            ...e,
            author_profile: e.profiles,
          })));
        }
      }
      setIsLoading(false);
    };
    if (username) fetch();
  }, [username]);

  if (isLoading) {
    return <PublicLayout><div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></PublicLayout>;
  }

  if (!profile) {
    return (
      <PublicLayout>
        <div className="container-wide py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">This profile doesn't exist or has been removed.</p>
          <Link to="/directory"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" />Back to Directory</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase();
  const isOwner = user?.id === profile.user_id;

  const handleEndorse = async () => {
    if (!user || !endorseText.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('endorsements').insert({
      profile_id: profile.id,
      author_id: user.id,
      content: endorseText.trim(),
      relationship: endorseRelation.trim(),
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: 'Error', description: error.message.includes('unique') ? 'You already endorsed this person.' : error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Endorsement added!' });
      setEndorseText(''); setEndorseRelation('');
      // Refresh endorsements
      const { data } = await supabase.from('endorsements').select('*, profiles!endorsements_author_id_fkey(name, role, avatar)').eq('profile_id', profile.id).order('created_at', { ascending: false });
      if (data) setEndorsements(data.map((e: any) => ({ ...e, author_profile: e.profiles })));
    }
  };

  return (
    <PublicLayout>
      <div className="py-8 md:py-12">
        <div className="container-wide max-w-4xl">
          <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft className="w-4 h-4" />Back to Directory</Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <Card className="mb-6">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <Avatar className="w-24 h-24 border-2 border-border">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-secondary text-2xl font-medium">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h1 className="font-serif text-3xl font-bold">{profile.name}</h1>
                          {profile.featured && <Badge className="bg-primary/10 text-primary border-0"><Sparkles className="w-3 h-3 mr-1" />Featured</Badge>}
                        </div>
                        <p className="text-lg text-muted-foreground">{profile.role}</p>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1"><MapPin className="w-4 h-4" />{profile.location}</div>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${profile.availability === 'available' ? 'bg-primary/10 text-primary' : profile.availability === 'open' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-muted text-muted-foreground'}`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${profile.availability === 'available' ? 'bg-primary animate-pulse' : profile.availability === 'open' ? 'bg-yellow-500' : 'bg-muted-foreground'}`} />
                        {profile.availability === 'available' ? 'Available Now' : profile.availability === 'open' ? 'Open to Conversations' : 'Not Available'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Bio */}
                <Card><CardHeader><CardTitle className="font-serif text-lg">About</CardTitle></CardHeader><CardContent><p className="text-muted-foreground leading-relaxed">{profile.bio}</p></CardContent></Card>

                {/* Open To */}
                {profile.open_to.length > 0 && (
                  <Card><CardHeader><CardTitle className="font-serif text-lg">Open To</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{profile.open_to.map(o => <Badge key={o} variant="secondary" className="text-sm py-1 px-3">{OPEN_TO_LABELS[o as OpenToOption] || o}</Badge>)}</div></CardContent></Card>
                )}

                {/* Skills */}
                {profile.skills.length > 0 && (
                  <Card><CardHeader><CardTitle className="font-serif text-lg">Skills</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{profile.skills.map(s => <Badge key={s} variant="outline" className="text-sm py-1 px-3">{s}</Badge>)}</div></CardContent></Card>
                )}

                {/* Portfolio */}
                {profile.portfolio_links.length > 0 && (
                  <Card><CardHeader><CardTitle className="font-serif text-lg">Portfolio</CardTitle></CardHeader><CardContent className="space-y-2">{profile.portfolio_links.map(link => <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm"><ExternalLink className="w-4 h-4" />{link}</a>)}</CardContent></Card>
                )}

                {/* Endorsements */}
                <Card>
                  <CardHeader><CardTitle className="font-serif text-lg flex items-center gap-2"><Star className="w-5 h-5" />Endorsements ({endorsements.length})</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {endorsements.length === 0 && <p className="text-sm text-muted-foreground">No endorsements yet. Be the first!</p>}
                    {endorsements.map(e => (
                      <div key={e.id} className="border border-border rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">"{e.content}"</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6"><AvatarImage src={e.author_profile?.avatar} /><AvatarFallback className="text-xs">{e.author_profile?.name?.[0]}</AvatarFallback></Avatar>
                          <span className="text-sm font-medium">{e.author_profile?.name || 'Anonymous'}</span>
                          {e.relationship && <span className="text-xs text-muted-foreground">· {e.relationship}</span>}
                        </div>
                      </div>
                    ))}

                    {/* Write endorsement */}
                    {user && !isOwner && (
                      <div className="border-t border-border pt-4 mt-4 space-y-3">
                        <p className="text-sm font-medium">Write an endorsement</p>
                        <Textarea value={endorseText} onChange={(e) => setEndorseText(e.target.value)} placeholder="Share your experience working with this person..." rows={3} />
                        <Input value={endorseRelation} onChange={(e) => setEndorseRelation(e.target.value)} placeholder="Your relationship (e.g. Former colleague)" />
                        <Button onClick={handleEndorse} disabled={!endorseText.trim() || isSubmitting} size="sm">
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Submit Endorsement
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card><CardHeader><CardTitle className="font-serif text-lg">Contact</CardTitle></CardHeader><CardContent className="space-y-3">
                  {profile.contact_email && <Button variant="outline" className="w-full justify-start" onClick={() => window.open(`mailto:${profile.contact_email}`, '_blank')}><Mail className="w-4 h-4 mr-2" />Email</Button>}
                  {profile.twitter && <Button variant="outline" className="w-full justify-start" onClick={() => window.open(`https://twitter.com/${profile.twitter}`, '_blank')}><Twitter className="w-4 h-4 mr-2" />@{profile.twitter}</Button>}
                  {profile.telegram && <Button variant="outline" className="w-full justify-start" onClick={() => window.open(`https://t.me/${profile.telegram}`, '_blank')}><Send className="w-4 h-4 mr-2" />Telegram</Button>}
                  {profile.calendar_link && <Button variant="outline" className="w-full justify-start" onClick={() => window.open(profile.calendar_link!, '_blank')}><Calendar className="w-4 h-4 mr-2" />Book a Call</Button>}
                </CardContent></Card>

                {isOwner && (
                  <Card><CardHeader><CardTitle className="font-serif text-lg">Analytics</CardTitle></CardHeader><CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="w-4 h-4" />Profile Views</div><span className="font-semibold">{profile.profile_views.toLocaleString()}</span></div>
                    <Separator />
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-muted-foreground"><MousePointerClick className="w-4 h-4" />Contact Clicks</div><span className="font-semibold">{profile.contact_clicks.toLocaleString()}</span></div>
                  </CardContent></Card>
                )}

                <Card><CardContent className="pt-6"><div className="text-center">
                  <Badge variant={profile.tier === 'premium' ? 'default' : 'secondary'} className="text-xs uppercase tracking-wider">{profile.tier} member</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div></CardContent></Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
