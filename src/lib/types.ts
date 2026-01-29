// User and Profile Types
export type AvailabilityStatus = 'available' | 'open' | 'unavailable';
export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  bio: string;
  avatar: string;
  availability: AvailabilityStatus;
  openTo: OpenToOption[];
  skills: string[];
  contactEmail?: string;
  twitter?: string;
  telegram?: string;
  calendarLink?: string;
  portfolioLinks: string[];
  tier: SubscriptionTier;
  featured: boolean;
  profileViews: number;
  contactClicks: number;
  createdAt: string;
  lastActive: string;
}

export type OpenToOption = 
  | 'freelance'
  | 'equity'
  | 'cofounding'
  | 'advising'
  | 'sideprojects'
  | 'fulltime';

export interface FilterState {
  search: string;
  availability: 'all' | AvailabilityStatus;
  sortBy: 'featured' | 'recent';
  openTo: OpenToOption[];
}

export const OPEN_TO_LABELS: Record<OpenToOption, string> = {
  freelance: 'Freelance Work',
  equity: 'Equity Opportunities',
  cofounding: 'Co-founding',
  advising: 'Advising',
  sideprojects: 'Side Projects',
  fulltime: 'Full-time Roles',
};

export const TIER_LIMITS = {
  free: {
    skills: 1,
    bioLength: 200,
    portfolioLinks: 0,
    expiresAfterDays: 60,
  },
  pro: {
    skills: Infinity,
    bioLength: 500,
    portfolioLinks: 3,
    expiresAfterDays: null,
  },
  premium: {
    skills: Infinity,
    bioLength: 500,
    portfolioLinks: Infinity,
    expiresAfterDays: null,
  },
};
