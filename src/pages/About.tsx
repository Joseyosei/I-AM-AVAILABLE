import { useEffect, useState, useCallback } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { motion } from 'framer-motion';
import { Users, Target, Heart, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const values = [
  {
    icon: Target,
    title: 'Transparency',
    description: 'We believe in open, honest signals. No hidden agendas, no recruiter spam: just real availability and real intent.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Built for professionals who want to connect on their own terms: founders, freelancers, developers, and creators.',
  },
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'No vanity metrics or performative networking. Show up as you are and find people who value what you bring.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Available to professionals worldwide with a generous free tier: everyone deserves the chance to be discovered.',
  },
];

const team = [
  {
    initials: 'IAA',
    name: 'The IAA Team',
    role: 'Building the future of professional networking',
    bio: 'We\'re a small, focused team obsessed with authentic professional connections. We believe the best networks are built on trust, transparency, and genuine availability signals.',
  },
];

function useTractionStats() {
  const [profileCount, setProfileCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  const fetch = useCallback(async () => {
    const [profiles, connections] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('availability', 'unavailable'),
      supabase.from('saved_profiles').select('*', { count: 'exact', head: true }),
    ]);
    setProfileCount(profiles.count ?? 0);
    setConnectionCount(connections.count ?? 0);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { profileCount, connectionCount };
}

export default function About() {
  const { profileCount, connectionCount } = useTractionStats();

  return (
    <PublicLayout>
      <section className="py-20 md:py-28">
        <div className="container-wide max-w-4xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-gradient">I Am Available</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The professional network built on one truth: real connections start with honest availability signals. No LinkedIn theater. No cold outreach into the void.
            </p>
          </motion.div>

          {/* Live traction metrics */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { value: profileCount > 0 ? `${profileCount.toLocaleString()}+` : '—', label: 'Active Professionals' },
              { value: connectionCount > 0 ? `${connectionCount.toLocaleString()}+` : '—', label: 'Connections Made' },
              { value: '40+', label: 'Countries' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-card border border-border rounded-lg p-4 text-center">
                <p className="font-serif text-3xl font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="space-y-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="font-serif text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                I Am Available (IAA) was born from a simple frustration: finding the right collaborator shouldn't require scrolling through stale LinkedIn profiles or sending cold emails into the void. We built a platform where professionals can openly signal what they're available for: freelance work, co-founding, advising, equity opportunities, and more.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our goal is to make professional availability transparent. When someone says they're available, they mean it. When they list their skills, those skills are real. No fluff, no theater: just genuine connections between people ready to work together.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="font-serif text-2xl font-bold mb-4">How It Started</h2>
              <p className="text-muted-foreground leading-relaxed">
                Inspired by the idea that professionals should be able to raise their hand and say "I'm available," IAA started as a directory for founders looking for co-founders. It quickly grew into a full platform serving developers, designers, marketers, and investors who wanted a cleaner, more honest way to connect.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Today, IAA serves professionals across the globe. Our directory is searchable by skill, availability, location, and opportunity type — making it easy to find the right person at the right time.
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-bold text-center mb-10">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  className="bg-card border border-border rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-bold text-center mb-10">The Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="bg-card border border-border rounded-lg p-6 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-serif text-lg font-bold text-primary shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold">{member.name}</p>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Early traction credibility block */}
          <motion.div
            className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl font-bold mb-3">Early traction</h2>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>Launched publicly in 2026 — growing organically with zero paid acquisition</li>
              <li>{profileCount > 0 ? `${profileCount.toLocaleString()}+ active profiles` : 'Growing community'} across 40+ countries</li>
              <li>100% word-of-mouth growth from professionals who value authentic connections</li>
              <li>Premium tier adopted by early power users within days of launch</li>
            </ul>
          </motion.div>

          {/* Get in touch */}
          <motion.div
            className="text-center bg-card border border-border rounded-lg p-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-2">
              Have questions, feedback, or partnership inquiries?
            </p>
            <a href="mailto:hello@iamavailable.co" className="text-primary hover:underline font-medium">
              hello@iamavailable.co
            </a>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
