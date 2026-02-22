

# Implementation Plan

## 1. Landing Page Stats: Real-time from Database (Currently Hardcoded)

The stats section on the landing page shows hardcoded values (1,247 / 3,842 / 127). These need to be replaced with live counts from the database:

- **Active Profiles**: `SELECT count(*) FROM profiles WHERE availability != 'unavailable'`
- **Connections Made**: `SELECT count(*) FROM saved_profiles`
- **Companies Founded**: `SELECT count(*) FROM jobs` (or a new metric)

Since the platform is new, these will start at **zero** and grow as real users join.

**Changes:**
- Update `Landing.tsx` to fetch real counts from Supabase on mount using `useEffect` + `supabase.from(...).select('*', { count: 'exact', head: true })`
- Pass fetched values to the `AnimatedStat` components instead of hardcoded numbers
- Add Supabase Realtime subscription to the `profiles` table so counts update live without refreshing

**Database migration needed:** Enable Realtime on `profiles`, `saved_profiles`, and `jobs` tables.

---

## 2. Fix Free Plan Widget on Pricing Page

The "Your Plan" badge on the Free tier card overlaps with the card border (visible in the screenshot). The issue is the `absolute -top-3 right-4` positioning combined with the `ring-2 ring-primary` border.

**Fix:**
- Add `overflow-visible` to the pricing card container
- Adjust the "Your Plan" badge positioning so it doesn't clip or overlap awkwardly
- Ensure the Free card properly shows as selected without the badge being cut off

---

## 3. Replace Logo on Sign In and Sign Up Pages

Both pages currently show a generic `Sparkles` icon from Lucide with "I Am Available" text. The user wants the actual company logo (`src/assets/logo.png`) used instead.

**Changes:**
- In `Login.tsx` and `Signup.tsx`, replace the `Sparkles` icon + text block with an `<img>` tag importing the `logo.png` asset
- Size it appropriately (e.g., `h-12` or similar) and center it

---

## 4. Platform Enhancement Discussion

Here are recommended additions to round out the platform:

| Feature | Description |
|---------|-------------|
| **Profile view tracking** | Increment `profile_views` in real-time when someone visits a profile |
| **Search / discovery** | Full-text search across profiles by name, skills, bio |
| **Email notifications** | Send emails for new endorsements, profile views milestones |
| **Social login** | Google / GitHub OAuth for faster onboarding |
| **Admin dashboard** | Moderate profiles, jobs, and view platform-wide analytics |
| **Messaging system** | Direct messages between users (already partially built) |
| **Profile sharing** | Generate shareable links with OG meta tags |

---

## Technical Details

### Database Migration
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
```

### Files to Modify
- `src/pages/Landing.tsx` - Fetch real stats + Realtime subscription
- `src/pages/Pricing.tsx` - Fix Free plan card styling
- `src/pages/Login.tsx` - Replace Sparkles icon with logo.png
- `src/pages/Signup.tsx` - Replace Sparkles icon with logo.png

### Files Unchanged
- No new files created
- No edge functions needed

