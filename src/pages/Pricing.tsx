import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const STRIPE_TIERS = {
  pro: { priceId: 'price_1T3Ge3I7iNRznjwrtQAQffYk', productId: 'prod_U1JGmLZxXS9uwV' },
  premium: { priceId: 'price_1T3GeAI7iNRznjwrMaw90p5L', productId: 'prod_U1JGwGv62FBCGN' },
};

const plans = [
  {
    name: 'Free', price: '$0', period: '/month', tier: 'free' as const,
    description: 'Perfect for getting started',
    features: ['Create profile', 'Browse directory', '1 skill tag', 'Expires after 60 days'],
    highlighted: false, cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$29', period: '/month', tier: 'pro' as const,
    description: 'For serious professionals',
    features: ['Everything in Free', 'Featured placement', 'Unlimited skills', 'Extended bio (500 chars)', 'Never expires', '3 portfolio links'],
    highlighted: true, cta: 'Upgrade to Pro', badge: 'Most Popular',
  },
  {
    name: 'Premium', price: '$79', period: '/month', tier: 'premium' as const,
    description: 'Maximum visibility',
    features: ['Everything in Pro', 'Homepage featured slot', 'Weekly newsletter feature', 'Unlimited portfolio links', 'Priority support'],
    highlighted: false, cta: 'Go Premium',
  },
];

export default function Pricing() {
  const { isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: 'pro' | 'premium') => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: STRIPE_TIERS[tier].priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to start checkout', variant: 'destructive' });
    }
    setLoadingTier(null);
  };

  const currentTier = profile?.tier || 'free';

  return (
    <PublicLayout>
      <div className="py-16 md:py-24">
        <div className="container-wide">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade at any time.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const isCurrentPlan = currentTier === plan.tier;
              return (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className={`pricing-card ${plan.highlighted ? 'pricing-card-popular' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium"><Sparkles className="w-3.5 h-3.5" />{plan.badge}</span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Your Plan</span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-serif text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5"><Check className="w-3 h-3 text-primary" /></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.tier === 'free' ? (
                    isCurrentPlan ? (
                      <Button variant="outline" className="w-full" size="lg" disabled>Current Plan</Button>
                    ) : (
                      <Link to="/signup" className="block"><Button variant="outline" className="w-full" size="lg">{plan.cta}</Button></Link>
                    )
                  ) : isCurrentPlan ? (
                    <Button variant="outline" className="w-full" size="lg" disabled>Current Plan</Button>
                  ) : (
                    <Button variant={plan.highlighted ? 'default' : 'outline'} className="w-full" size="lg" onClick={() => handleSubscribe(plan.tier as 'pro' | 'premium')} disabled={loadingTier === plan.tier}>
                      {loadingTier === plan.tier ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : plan.cta}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="text-muted-foreground">Questions? Reach out to us at{' '}<a href="mailto:hello@iamavailable.co" className="text-primary hover:underline">hello@iamavailable.co</a></p>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
