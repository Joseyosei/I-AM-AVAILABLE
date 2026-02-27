import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileCard } from '@/components/ProfileCard';
import {
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  ArrowRight,
  MapPin,
  Sparkles,
  Check,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/lib/types';
import { dbToUserProfile } from '@/lib/profileUtils';

// ── Animated count-up hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function AnimatedStat({ target, label }: { target: number; label: string }) {
  const { count, ref } = useCountUp(target);
  return (
    <motion.div ref={ref} className="stat-card" variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
      <p className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}
      </p>
      <p className="text-muted-foreground">{label}</p>
    </motion.div>
  );
}

// ── Live stats ────────────────────────────────────────────────────────────────
function useLiveStats() {
  const [stats, setStats] = useState([
    { value: 0, label: 'Active Profiles' },
    { value: 0, label: 'Connections Made' },
    { value: 0, label: 'Companies Founded' },
  ]);

  const fetchStats = useCallback(async () => {
    const [profiles, connections, companies] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('availability', 'unavailable'),
      supabase.from('saved_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
    ]);
    setStats([
      { value: profiles.count ?? 0, label: 'Active Profiles' },
      { value: connections.count ?? 0, label: 'Connections Made' },
      { value: companies.count ?? 0, label: 'Companies Founded' },
    ]);
  }, []);

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel('landing-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, fetchStats)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchStats]);

  return stats;
}

// ── Featured profiles ─────────────────────────────────────────────────────────
function useFeaturedProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .eq('featured', true)
      .neq('availability', 'unavailable')
      .order('last_active', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setProfiles(data.map(dbToUserProfile));
      });
  }, []);

  return profiles;
}

// ── Newsletter section ────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    const { error } = await supabase
      .from('newsletter_subscribers' as any)
      .insert({ email: email.trim().toLowerCase(), source: 'landing' });

    if (error) {
      if ((error as any).code === '23505') {
        setStatus('success');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      }
    } else {
      setStatus('success');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-primary/5 border-y border-primary/10">
      <div className="container-wide">
        <motion.div
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Stay in the loop</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get notified about featured professionals and platform updates. No spam — ever.
          </p>
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <Check className="w-5 h-5" />
              You're on the list!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1"
              />
              <Button type="submit" disabled={status === 'loading'} className="shrink-0">
                {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Notify Me'}
              </Button>
            </form>
          )}
          {errorMsg && <p className="text-destructive text-sm mt-3">{errorMsg}</p>}
        </motion.div>
      </div>
    </section>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const howItWorks = [
  {
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up in 2 minutes. Add your skills, role, and what you\'re open to: freelance, co-founding, full-time, and more.',
  },
  {
    step: '02',
    title: 'Signal Availability',
    description: 'Set your status to Available Now, Open to Conversations, or Not Available. Update it any time.',
  },
  {
    step: '03',
    title: 'Get Discovered',
    description: 'Founders, companies, and collaborators search by skill and availability and reach out directly — no middlemen.',
  },
];

const whoItsFor = [
  {
    icon: Briefcase,
    title: 'Entrepreneurs',
    description: 'Find co-founders, advisors, and early team members who share your vision.',
  },
  {
    icon: Code,
    title: 'Developers',
    description: 'Connect with projects that need your skills: from side projects to funded startups.',
  },
  {
    icon: Palette,
    title: 'Freelancers',
    description: 'Get discovered by clients who value quality work and are ready to pay for expertise.',
  },
  {
    icon: TrendingUp,
    title: 'Investors',
    description: 'Find promising founders and operators before anyone else does.',
  },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  const stats = useLiveStats();
  const featuredProfiles = useFeaturedProfiles();

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="py-20 md:py-32">
        <div className="container-wide">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Signal Your{' '}
              <span className="text-gradient">Availability</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              The professional network where talent openly signals it's ready. No cold outreach. No LinkedIn theater. Just direct connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Create Your Profile — It's Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8">
                  Browse Directory
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero mockup card */}
          <motion.div
            className="mt-16 max-w-sm mx-auto hidden md:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="profile-card shadow-xl border-primary/20 pointer-events-none select-none">
              <div className="flex items-center gap-1 text-primary text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Featured
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-emerald-400/30 border-2 border-border flex items-center justify-center font-serif text-xl font-bold text-primary shrink-0">
                  JD
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold">Jordan Davis</p>
                  <p className="text-muted-foreground text-sm">Full-Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" /> San Francisco, CA
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium">Available Now</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                Open to co-founding or freelance contracts. 8 years building SaaS products that scale.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js'].map((skill) => (
                  <span key={skill} className="px-2 py-1 rounded-full bg-secondary text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Live Stats ── */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="container-wide">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} target={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Profiles ── */}
      {featuredProfiles.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Featured Professionals</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Meet some of the talented professionals available right now
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featuredProfiles.map((profile) => (
                <motion.div key={profile.id} variants={fadeInUp}>
                  <ProfileCard profile={profile} />
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-10">
              <Link to="/directory">
                <Button variant="outline" size="lg">
                  Browse All Profiles <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container-wide">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three steps from signup to your first real connection
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} className="relative flex flex-col items-center text-center" variants={fadeInUp}>
                {/* Connector arrow — visible only between cards on lg screens */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 -right-4 z-10 items-center">
                    <ArrowRight className="w-6 h-6 text-primary/40" />
                  </div>
                )}
                <div className="feature-card w-full">
                  <p className="font-serif text-6xl font-bold text-primary/15 mb-4 leading-none">{step.step}</p>
                  <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trust Indicators ── */}
      <section className="py-16 border-y border-border">
        <div className="container-wide">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium mb-8">
              Trusted by professionals from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              {['Google', 'Stripe', 'Notion', 'Linear', 'Figma', 'Vercel'].map((company) => (
                <span key={company} className="font-serif text-xl font-semibold text-foreground/25 hover:text-foreground/50 transition-colors">
                  {company}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {stats[0].value > 0 ? `${stats[0].value.toLocaleString()}+` : 'Growing'} active professionals
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                Zero recruiter spam
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                Direct connections only
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section className="py-20 md:py-28">
        <div className="container-wide">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Who It's For</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're building something new or looking for your next opportunity
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {whoItsFor.map((item) => (
              <motion.div key={item.title} className="feature-card" variants={fadeInUp}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Final CTA ── */}
      <section className="py-20 md:py-28">
        <div className="container-wide">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to signal you're available?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join professionals who are finding their next opportunity through authentic connections — not job boards.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-base px-8">
                Create Your Profile — It's Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
