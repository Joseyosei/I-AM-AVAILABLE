# I Am Available — Implementation Plan

## Overview

Three areas: a critical bug fix (image upload), landing page improvements to grow users, and platform polish to impress investors.

---

## Section 1 — Fix: Profile Image Upload

**File:** `src/pages/ProfileEditor.tsx`

### What's broken
The "Upload Photo" button (line ~118) has no `onClick`, no `<input type="file">`, and no upload logic. It is purely decorative.

### Changes

1. **Add `useRef` import + new state**
   ```tsx
   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
   const [avatarError, setAvatarError] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   ```

2. **Replace the Upload button block** with:
   - A hidden `<input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} />`
   - Button `onClick` triggers `fileInputRef.current?.click()`
   - Button shows `<Loader2 animate-spin />Uploading...` while `isUploadingAvatar=true`
   - Error message below button if upload fails

3. **Add `handleAvatarChange` function**
   - Validate file ≤ 2 MB and `type.startsWith('image/')`
   - Upload to `supabase.storage.from('avatars').upload(`${user.id}/avatar.${ext}`, file, { upsert: true })`
   - Get public URL via `supabase.storage.from('avatars').getPublicUrl(path)`
   - Call `updateProfile({ avatar: publicUrl })` and update `formData.avatar`
   - Show `toast` on success, set `avatarError` on failure

4. **Update `<AvatarImage>`** to use `formData.avatar || profile?.avatar`

5. **Add `avatar` field** to `formData` state and the `useEffect` that syncs from `profile`

6. **Import `supabase`** from `@/integrations/supabase/client` (not yet imported in this file)

### Supabase: create `avatars` storage bucket
New migration file `supabase/migrations/<timestamp>_avatars_bucket.sql`:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload/update only their own folder
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read
CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

---

## Section 2 — Attract More Users: Landing Page Improvements

**Primary file:** `src/pages/Landing.tsx`

### 2.1 Featured Profiles Showcase

- Extract `dbToUserProfile` from `Directory.tsx` into a new shared file `src/lib/profileUtils.ts`
- Add a `useFeaturedProfiles()` hook in `Landing.tsx` that fetches profiles where `featured=true` ordered by `last_active`, limit 4
- Add a **"Featured Professionals"** section between Stats and How It Works:
  - 4-column `ProfileCard` grid
  - "Browse All Profiles →" link button below the grid

### 2.2 "How It Works" — 3-Step Visual Flow

Replace the current abstract 4-card features grid with a clear **3-step numbered flow**:

| Step | Title | Description |
|------|-------|-------------|
| 01 | Create Your Profile | Sign up in 2 minutes. Add your skills, role, and what you're open to. |
| 02 | Signal Your Availability | Set your status: Available Now, Open to Conversations, or Not Available. |
| 03 | Get Discovered | Founders and companies search by skill and reach out directly — no middlemen. |

Desktop: 3-column grid with `ArrowRight` connector icons between steps. Large styled step numbers (`text-5xl text-primary/20 font-bold`).

### 2.3 Social Proof / Trust Indicators

Add a section after "How It Works":
- Text-based company name badges: `Google · Stripe · Notion · Linear · Figma · Vercel` styled with `opacity-40 hover:opacity-70`
- Animated pills: `{profileCount}+ active professionals`, `Zero recruiter spam`, `Direct connections only`
- Uses the existing `stats` already in scope — no new Supabase query needed

### 2.4 Newsletter / Waitlist CTA

**New Supabase migration** (`<timestamp>_newsletter_subscribers.sql`):
```sql
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'landing',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
```

Add a `<NewsletterSection />` component in `Landing.tsx`:
- Email input + "Notify Me" button form
- Inserts into `newsletter_subscribers` on submit
- Handles `23505` unique violation as a silent success (already subscribed)
- Success state shows a `<Check />` icon and "You're on the list!"
- Placed between "Who It's For" and the final CTA section

---

## Section 3 — Attract Investors: Platform Polish

### 3.1 About Page Improvements

**File:** `src/pages/About.tsx`

- **Live traction metrics bar** below the hero: "Active Professionals", "Connections Made", "40+ Countries" — 3-card grid pulling live counts from Supabase
- **Sharpen mission statement**: Replace the current generic subtitle with something crisp:
  > "I Am Available is the professional network built on one truth: real connections start with honest availability signals. No LinkedIn theater. No cold outreach into the void."
- **Team section**: Avatar + name + role + bio cards (2-column grid)
- **"Early traction" credibility block** above "Get in Touch": bullet list of growth stats (organic growth, premium adoption rate)

### 3.2 Pricing Page — Annual Billing Toggle

**File:** `src/pages/Pricing.tsx`

- Add `isAnnual` boolean state
- Add a **Monthly / Annual toggle switch** (using existing `Switch` UI component) with a "Save 20%" badge
- Display prices dynamically: `monthly × 0.8 × 12` when annual is selected, with `/year` period label
- Add annual Stripe Price IDs to `STRIPE_TIERS` constant (create them in Stripe dashboard first)
- Wire `handleSubscribe` to pick the correct price ID based on `isAnnual`

### 3.3 Landing Page Hero — Profile Card Mockup

**File:** `src/pages/Landing.tsx`

Add a **static profile card mockup** below the hero CTA buttons — built with pure Tailwind JSX (no images needed):
- Fake profile card: initials avatar, name, role, "Available Now" green dot, location, bio snippet, skill tags
- Gives visitors an instant visual of the product before they sign up
- Animated entrance with `framer-motion` (`delay: 0.3`)
- Hidden on small screens (`hidden md:block`) to avoid crowding

---

## Implementation Order

| # | Task | Files | Notes |
|---|------|-------|-------|
| 1 | **Image Upload fix** | `ProfileEditor.tsx` + migration | Supabase bucket migration first |
| 2 | **Extract shared utility** | Create `src/lib/profileUtils.ts`, update `Directory.tsx` | Needed before step 3 |
| 3 | **Featured Profiles** | `Landing.tsx` | Depends on step 2 |
| 4 | **How It Works redesign** | `Landing.tsx` | Pure UI, no deps |
| 5 | **Trust indicators** | `Landing.tsx` | Uses existing `stats` |
| 6 | **Newsletter CTA** | `Landing.tsx` + migration | Migration first |
| 7 | **Hero mockup** | `Landing.tsx` | Pure UI |
| 8 | **Annual billing toggle** | `Pricing.tsx` | Stripe price IDs needed first |
| 9 | **About page polish** | `About.tsx` | Mostly prose + layout |
