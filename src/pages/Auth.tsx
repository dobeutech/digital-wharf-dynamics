import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<null | 'login' | 'signup' | 'google'>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setBusy('login');
    const { error } = await signIn();
    if (error) {
      toast({ variant: 'destructive', title: 'Login failed', description: error.message });
      setBusy(null);
    }
  };

  const handleSignup = async () => {
    setBusy('signup');
    const { error } = await signUp();
    if (error) {
      toast({ variant: 'destructive', title: 'Signup failed', description: error.message });
      setBusy(null);
    }
  };

  const handleGoogle = async () => {
    setBusy('google');
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ variant: 'destructive', title: 'Sign-in failed', description: error.message });
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            Access your account or create one in seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button className="w-full" onClick={handleLogin} disabled={busy !== null}>
              {busy === 'login' ? 'Redirecting...' : 'Log In'}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleSignup} disabled={busy !== null}>
              {busy === 'signup' ? 'Redirecting...' : 'Create Account'}
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogle} disabled={busy !== null}>
              {busy === 'google' ? 'Redirecting...' : 'Continue with Google'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Password reset and email verification are handled by Auth0’s login flow.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
