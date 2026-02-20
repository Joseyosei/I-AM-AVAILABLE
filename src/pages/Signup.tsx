import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const { signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const result = await signup(name, email, password);
    setIsLoading(false);
    if (result.error) {
      setErrors({ general: result.error });
    } else if (result.needsConfirmation) {
      setNeedsConfirmation(true);
    } else {
      navigate('/dashboard/profile');
    }
  };

  if (needsConfirmation) {
    return (
      <PublicLayout hideFooter>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          <motion.div className="w-full max-w-md text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold mb-4">Check your email</h1>
              <p className="text-muted-foreground mb-6">We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
              <Link to="/login"><Button variant="outline">Back to Login</Button></Link>
            </div>
          </motion.div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-semibold">I Am Available</span>
              </div>
            </div>
            <h1 className="font-serif text-2xl font-bold text-center mb-8">Create your account</h1>

            {errors.general && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 mb-4">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={errors.name ? 'border-destructive' : ''} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={errors.email ? 'border-destructive' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? 'border-destructive' : ''} />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>) : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
