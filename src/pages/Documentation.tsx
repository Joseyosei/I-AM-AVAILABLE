import { PublicLayout } from '@/components/layout/PublicLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Shield, 
  Zap, 
  HelpCircle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const sections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    content: [
      {
        q: 'What is I Am Available?',
        a: 'I Am Available is a professional networking platform where you can openly signal your availability for collaboration opportunities: freelance work, equity deals, co-founding, advising, and more. Think of it as Bella Nazzari\'s "open to work" concept, but built for everyone.',
      },
      {
        q: 'How do I create a profile?',
        a: 'Click "Create Profile" and sign up with your email. You\'ll be guided through setting up your name, role, location, skills, availability status, and contact methods. It takes less than 3 minutes.',
      },
      {
        q: 'Is it free?',
        a: 'Yes! The Free tier lets you create a profile, browse the directory, add 1 skill tag, and stay listed for 60 days. Upgrade to Pro or Premium for unlimited skills, featured placement, and more.',
      },
    ],
  },
  {
    icon: Users,
    title: 'Directory & Discovery',
    content: [
      {
        q: 'How does the directory work?',
        a: 'The directory is a searchable grid of professionals who have signaled their availability. You can filter by availability status, skills, location, and what they\'re open to (freelance, equity, co-founding, etc.).',
      },
      {
        q: 'Do I need an account to browse?',
        a: 'No. Anyone can visit the directory and browse profiles. You only need an account to create your own profile and be listed.',
      },
      {
        q: 'How does search work?',
        a: 'Search matches against names, roles, skills, and locations. Combine it with filters for availability status and opportunity type to narrow results.',
      },
    ],
  },
  {
    icon: Sparkles,
    title: 'Availability Signals',
    content: [
      {
        q: 'What do the availability statuses mean?',
        a: '"Available Now" (green) means you\'re actively looking for opportunities. "Open to Conversations" (yellow) means you\'re not urgently looking but would consider the right offer. "Not Available" (gray) means you\'re currently not taking on new work.',
      },
      {
        q: 'Can I change my status anytime?',
        a: 'Yes. Toggle your availability status from your dashboard at any time. Changes are reflected immediately in the directory.',
      },
      {
        q: 'What does "Open To" mean?',
        a: 'These are categories of opportunities you\'re interested in: Freelance Work, Equity Opportunities, Co-founding, Advising, Side Projects, and Full-time Roles. Select as many as apply.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Subscription Tiers',
    content: [
      {
        q: 'What\'s included in Free?',
        a: 'Create a profile, browse the directory, add 1 skill tag, 200-character bio. Profile expires after 60 days of inactivity.',
      },
      {
        q: 'What does Pro ($29/mo) add?',
        a: 'Featured placement in directory, unlimited skill tags, 500-character bio, 3 portfolio links, profile never expires.',
      },
      {
        q: 'What does Premium ($79/mo) include?',
        a: 'Everything in Pro, plus homepage featured slot, weekly newsletter inclusion, unlimited portfolio links, and priority support.',
      },
    ],
  },
  {
    icon: Zap,
    title: 'Contact & Privacy',
    content: [
      {
        q: 'How do people contact me?',
        a: 'You choose which contact methods to display: email, Twitter/X handle, Telegram, or a calendar booking link. Only the methods you enable are shown.',
      },
      {
        q: 'Is my email visible to everyone?',
        a: 'Only if you explicitly add it as a contact method. Your login email is never shown publicly.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Go to Settings → Danger Zone → Delete Account. This permanently removes your profile and all associated data.',
      },
    ],
  },
];

export default function Documentation() {
  return (
    <PublicLayout>
      <div className="py-12 md:py-20">
        <div className="container-wide">
          {/* Header */}
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="w-3.5 h-3.5 mr-1" />
              Documentation
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Know
            </h1>
            <p className="text-muted-foreground text-lg">
              Learn how to make the most of I Am Available and start connecting with professionals today.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, sIdx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-serif text-2xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                        <section.icon className="w-5 h-5" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.content.map((item) => (
                      <div key={item.q}>
                        <h4 className="font-semibold flex items-start gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                          {item.q}
                        </h4>
                        <p className="text-muted-foreground text-sm ml-6">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div 
            className="max-w-2xl mx-auto text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              Create a free profile and explore the platform yourself.
            </p>
            <Link to="/signup">
              <Button size="lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
