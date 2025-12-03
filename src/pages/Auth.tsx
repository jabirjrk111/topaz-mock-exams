import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, GraduationCap, Shield } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'signup');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
          return;
        }
        const success = await signup(email, password, name, role);
        if (success) {
          toast({ title: 'Welcome to Topaz!', description: 'Your account has been created successfully.' });
          navigate(role === 'admin' ? '/admin' : '/dashboard');
        }
      } else {
        const success = await login(email, password);
        if (success) {
          toast({ title: 'Welcome back!', description: 'You have signed in successfully.' });
        } else {
          toast({ title: 'Error', description: 'Invalid email or password', variant: 'destructive' });
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-topaz">
                <span className="text-lg font-bold text-primary-foreground">T</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Topaz</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isSignUp
                ? 'Start your learning journey today'
                : 'Sign in to continue your progress'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>I am a</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        role === 'student'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <GraduationCap className="h-5 w-5" />
                      <span className="font-medium">Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all ${
                        role === 'admin'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Admin</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-primary hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          {!isSignUp && (
            <div className="mt-8 rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm font-medium text-foreground">Demo Accounts</p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>Admin: admin@topaz.com</p>
                <p>Student: student@topaz.com</p>
                <p className="text-xs">(any password works)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden bg-gradient-hero lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-topaz shadow-glow">
            <span className="text-4xl font-bold text-primary-foreground">T</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            Unlock Your Potential
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Practice with thousands of questions, track your progress, and achieve your academic goals with Topaz.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            {['Math', 'Science', 'English'].map((subject, i) => (
              <div key={i} className="rounded-lg bg-primary-foreground/10 p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-primary-foreground">{subject}</div>
                <div className="text-sm text-primary-foreground/60">Tests available</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
