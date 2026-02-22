import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe('pk_live_51T3GHOI7iNRznjwrBbOPSi7d3TpOKPqGDJiHaVWxRGX4y2X1fRzwJZgSuB3JKPgkFG9jZfxk9PNQbhb9KxsXTBf00fBWdDiPl');

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const priceId = searchParams.get('priceId');
  const { isAuthenticated } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'complete' | 'error'>('loading');

  const fetchClientSecret = useCallback(async () => {
    if (!priceId) {
      setError('No plan selected');
      setStatus('error');
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, embedded: true },
      });
      if (fnError) throw fnError;
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        setStatus('ready');
      } else {
        throw new Error('No client secret returned');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize checkout');
      setStatus('error');
    }
  }, [priceId]);

  useEffect(() => {
    if (isAuthenticated && priceId) {
      fetchClientSecret();
    }
  }, [isAuthenticated, priceId, fetchClientSecret]);

  const handleComplete = useCallback(() => {
    setStatus('complete');
  }, []);

  if (status === 'complete') {
    return (
      <PublicLayout hideFooter>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold mb-4">Subscription Active!</h1>
              <p className="text-muted-foreground mb-6">Your plan has been upgraded successfully. Enjoy your new features!</p>
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout hideFooter>
      <div className="py-8 md:py-12">
        <div className="container-wide max-w-3xl">
          <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />Back to Pricing
          </Link>

          <h1 className="font-serif text-3xl font-bold mb-8">Complete Your Subscription</h1>

          {status === 'loading' && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {status === 'error' && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-6 text-center">
              <p className="font-medium mb-2">Something went wrong</p>
              <p className="text-sm">{error}</p>
              <Link to="/pricing"><Button variant="outline" className="mt-4">Back to Pricing</Button></Link>
            </div>
          )}

          {status === 'ready' && clientSecret && (
            <div id="checkout" className="bg-card border border-border rounded-xl p-4 md:p-8">
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete: handleComplete }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}