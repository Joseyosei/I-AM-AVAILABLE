import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Sparkles, 
  Clock, 
  Briefcase, 
  Code, 
  Palette, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '1,247', label: 'Active Profiles' },
  { value: '3,842', label: 'Connections Made' },
  { value: '127', label: 'Companies Founded' },
];

const howItWorks = [
  {
    icon: Users,
    title: 'Create Your Profile',
    description: 'Set up your profile in minutes with your skills, experience, and what you are looking for.',
  },
  {
    icon: Sparkles,
    title: 'Signal Availability',
    description: 'Let the world know you are open for opportunities—freelance, equity, co-founding, and more.',
  },
  {
    icon: Clock,
    title: 'Get Contacted',
    description: 'Receive direct messages from people who want to work with you. No recruiters, no spam.',
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
    description: 'Connect with projects that need your skills—from side projects to funded startups.',
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container-wide">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Connect with people who are{' '}
              <span className="text-gradient">actually available</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              No LinkedIn theater. Just real professionals openly signaling they're ready to collaborate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Create Your Profile
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="container-wide">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                variants={fadeInUp}
              >
                <p className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28">
        <div className="container-wide">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                className="feature-card text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container-wide">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Who It's For
            </h2>
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
              <motion.div
                key={item.title}
                className="feature-card"
                variants={fadeInUp}
              >
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

      {/* CTA Section */}
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
              Join thousands of professionals who are finding their next opportunity through authentic connections.
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
