import { UserProfile } from './types';

export function dbToUserProfile(p: any): UserProfile {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    location: p.location,
    bio: p.bio,
    avatar: p.avatar,
    availability: p.availability,
    openTo: p.open_to || [],
    skills: p.skills || [],
    contactEmail: p.contact_email,
    twitter: p.twitter,
    telegram: p.telegram,
    calendarLink: p.calendar_link,
    portfolioLinks: p.portfolio_links || [],
    tier: p.tier,
    featured: p.featured,
    profileViews: p.profile_views,
    contactClicks: p.contact_clicks,
    createdAt: p.created_at,
    lastActive: p.last_active,
  };
}
