import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ANNUAL_DISCOUNT = 0.8;

const STRIPE_TIERS = {
  pro: {
    monthly: { priceId: 'price_1T3Ge3I7iNRznjwrtQAQffYk' },
    annual:  { priceId: 'price_1T3Ge3I7iNRznjwrtQAQffYk' },
  },
  premium: {
    monthly: { priceId: 'price_1T3GeAI7iNRznjwrMaw90p5L' },
    annual:  { priceId: 'price_1T3GeAI7iNRznjwrMaw90p5L' },
  },
};

const plans = [
  {
    name: 'Free', monthlyPrice: 0, tier: 'free' as const,
    description: 'Perfect for getting started',
    features: ['Create profile', 'Browse directory', '1 skill tag', 'Expires after 60 days'],
    highlighted: false, cta: 'Get Started',
  },
  {
    name: 'Pro', monthlyPrice: 29, tier: 'pro' as const,
    description: 'For serious professionals',
    features: ['Everything in Free', 'Featured placement', 'Unlimited skills', 'Extended bio (500 chars)', 'Never expires', '3 portfolio links'],
    highlighted: true, cta: 'Upgrade to Pro', badge: 'Most Popular',
  },
  {
    name: 'Premium', monthlyPrice: 79, tier: 'premium' as const,
    description: 'Maximum visibility',
    features: ['Everything in Pro', 'Homepage featured slot', 'Weekly newsletter feature', 'Unlimited portfolio links', 'Priority support'],
    highlighted: false, cta: 'Go Premium',
  },
];

export default function Pricing() {
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleSubscribe = (tier: 'pro' | 'premium') => {
    if (!isAuthenticated) { navigate('/signup'); return; }
    const priceId = isAnnual
      ? STRIPE_TIERS[tier].annual.priceId
      : STRIPE_TIERS[tier].monthly.priceId;
    navigate(`/checkout?priceId=${priceId}`);
  };

  const displayPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return '$0';
    if (isAnnual) return `$${Math.round(monthlyPrice * ANNUAL_DISCOUNT)}`;
    return `$${monthlyPrice}`;
  };

  const currentTier = profile?.tier || 'free';

  return (
    <PublicLayout>
      <div className="py-16 md:py-24">
        <div className="container-wide">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade at any time.</p>
          </motion.div>

          <motion.div className="flex items-center justify-center gap-4 mb-14" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual billing" />
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">Save 20%</span>
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const isCurrentPlan = currentTier === plan.tier;
              return (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className={`pricing-card overflow-visible relative ${plan.highlighted ? 'pricing-card-popular' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
                  {plan.badge && !isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium"><Sparkles className="w-3.5 h-3.5" />{plan.badge}</span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">Current Plan</span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="font-serif text-2xl font-semibold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-serif text-4xl font-bold">{displayPrice(plan.monthlyPrice)}</span>
                      <span className="text-muted-foreground text-sm">
                        {plan.monthlyPrice === 0 ? '' : isAnnual ? '/mo billed annually' : '/month'}
                      </span>
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-xs text-primary mt-1 font-medium">
                        ${Math.round(plan.monthlyPrice * ANNUAL_DISCOUNT * 12)}/year — save ${Math.round(plan.monthlyPrice * (1 - ANNUAL_DISCOUNT) * 12)}
                      </p>
                    )}
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
                    isCurrentPlan
                      ? <Button variant="outline" className="w-full" size="lg" disabled>Current Plan</Button>
                      : <Link to="/signup" className="block"><Button variant="outline" className="w-full" size="lg">{plan.cta}</Button></Link>
                  ) : isCurrentPlan ? (
                    <Button variant="outline" className="w-full" size="lg" disabled>Current Plan</Button>
                  ) : (
                    <Button variant={plan.highlighted ? 'default' : 'outline'} className="w-full" size="lg"
                      onClick={() => handleSubscribe(plan.tier as 'pro' | 'premium')}>
                      {plan.cta}
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="text-muted-foreground">Questions? Reach out at{' '}<a href="mailto:hello@iamavailable.co" className="text-primary hover:underline">hello@iamavailable.co</a></p>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
}
