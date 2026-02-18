import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { mockProfiles } from '@/lib/mock-data';
import { OPEN_TO_LABELS } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, Mail, Twitter, Calendar, Sparkles, 
  ArrowLeft, Eye, MousePointerClick, ExternalLink,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // Find by id (mock — in production this would be a username lookup)
  const profile = mockProfiles.find((p) => p.id === username);

  if (!profile) {
    return (
      <PublicLayout>
        <div className="container-wide py-20 text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">This profile doesn't exist or has been removed.</p>
          <Link to="/directory">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const initials = profile.name.split(' ').map((n) => n[0]).join('').toUpperCase();
  const isOwner = user?.id === profile.id;

  return (
    <PublicLayout>
      <div className="py-8 md:py-12">
        <div className="container-wide max-w-4xl">
          {/* Back link */}
          <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile Header */}
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
                          {profile.featured && (
                            <Badge className="bg-primary/10 text-primary border-0">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-muted-foreground">{profile.role}</p>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                          <MapPin className="w-4 h-4" />
                          {profile.location}
                        </div>
                      </div>

                      {/* Availability Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        profile.availability === 'available'
                          ? 'bg-success/10 text-success'
                          : profile.availability === 'open'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          profile.availability === 'available'
                            ? 'bg-success animate-pulse'
                            : profile.availability === 'open'
                            ? 'bg-warning'
                            : 'bg-muted-foreground'
                        }`} />
                        {profile.availability === 'available' ? 'Available Now' 
                          : profile.availability === 'open' ? 'Open to Conversations' 
                          : 'Not Available'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>

                {/* Open To */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Open To</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.openTo.map((option) => (
                        <Badge key={option} variant="secondary" className="text-sm py-1 px-3">
                          {OPEN_TO_LABELS[option]}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-sm py-1 px-3">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio */}
                {profile.portfolioLinks.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-lg">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {profile.portfolioLinks.map((link) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link}
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.contactEmail && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`mailto:${profile.contactEmail}`, '_blank')}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    )}
                    {profile.twitter && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`https://twitter.com/${profile.twitter}`, '_blank')}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        @{profile.twitter}
                      </Button>
                    )}
                    {profile.telegram && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(`https://t.me/${profile.telegram}`, '_blank')}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Telegram
                      </Button>
                    )}
                    {profile.calendarLink && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(profile.calendarLink, '_blank')}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book a Call
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Owner-only: Analytics */}
                {isOwner && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-lg">Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4" />
                          Profile Views
                        </div>
                        <span className="font-semibold">{profile.profileViews.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MousePointerClick className="w-4 h-4" />
                          Contact Clicks
                        </div>
                        <span className="font-semibold">{profile.contactClicks.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tier Badge */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Badge variant={profile.tier === 'premium' ? 'default' : 'secondary'} className="text-xs uppercase tracking-wider">
                        {profile.tier} member
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
