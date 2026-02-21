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
  ArrowRight,
  Radio,
  UserPlus,
  Filter,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

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

const stats = [
  { value: 1247, label: 'Active Profiles' },
  { value: 3842, label: 'Connections Made' },
  { value: 127, label: 'Companies Founded' },
];

const features = [
  {
    icon: Radio,
    title: 'Real-time Availability Signals',
    description: 'Show the world you\'re available right now: no guesswork, no outdated profiles.',
  },
  {
    icon: UserPlus,
    title: 'Self-service Profiles',
    description: 'Set up your profile in minutes with your skills, experience, and what you\'re open to.',
  },
  {
    icon: Filter,
    title: 'Advanced Filtering',
    description: 'Find the right people fast with filters for skills, availability, and opportunity type.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Contact',
    description: 'Reach out directly via email, Twitter, or calendar: no middlemen, no recruiter spam.',
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
              Signal Your{' '}
              <span className="text-gradient">Availability</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Where professionals openly signal they're available for collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Create Profile
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
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} target={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              A simple, transparent way to connect with the right people
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="feature-card text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
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
                Create Your Profile: It's Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
