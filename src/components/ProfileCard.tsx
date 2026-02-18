import { Link } from 'react-router-dom';
import { UserProfile, OPEN_TO_LABELS } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Mail, Twitter, Calendar, Sparkles } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="profile-card">
      {/* Featured Badge */}
      {profile.featured && (
        <div className="flex items-center gap-1 text-primary text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Featured
        </div>
      )}

      {/* Header */}
      <Link to={`/profile/${profile.id}`} className="flex items-start gap-4 mb-4 group">
        <Avatar className="w-16 h-16 border-2 border-border">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="bg-secondary text-lg font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg font-semibold truncate group-hover:text-primary transition-colors">{profile.name}</h3>
          <p className="text-muted-foreground text-sm truncate">{profile.role}</p>
        </div>
      </Link>

      {/* Location & Availability */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{profile.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`availability-dot ${
              profile.availability === 'available'
                ? 'availability-dot-available'
                : profile.availability === 'open'
                ? 'availability-dot-open'
                : 'availability-dot-unavailable'
            }`}
          />
          <span className="text-xs font-medium">
            {profile.availability === 'available'
              ? 'Available Now'
              : profile.availability === 'open'
              ? 'Open to Chat'
              : 'Not Available'}
          </span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{profile.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {profile.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {profile.skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{profile.skills.length - 3}
          </Badge>
        )}
      </div>

      {/* Contact Buttons */}
      <div className="flex gap-2">
        {profile.contactEmail && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`mailto:${profile.contactEmail}`, '_blank')}
          >
            <Mail className="w-4 h-4 mr-1.5" />
            Email
          </Button>
        )}
        {profile.twitter && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://twitter.com/${profile.twitter}`, '_blank')}
          >
            <Twitter className="w-4 h-4" />
          </Button>
        )}
        {profile.calendarLink && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(profile.calendarLink, '_blank')}
          >
            <Calendar className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
