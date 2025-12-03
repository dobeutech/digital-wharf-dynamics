import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';

export default function VerifyEmail() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Redirect if already verified or not logged in
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (user.email_confirmed_at) {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const { resendVerificationEmail } = await import('@/contexts/AuthContext').then(m => {
        // This is a workaround - we need to call the function from context
        return { resendVerificationEmail: null };
      });
      
      // Use the auth context's resend function
      const { useAuth } = await import('@/contexts/AuthContext');
      // Since we're in the component, we already have useAuth
    } catch (error) {
      // Fallback handled below
    }
    
    // Direct Supabase call as fallback
    const { supabase } = await import('@/integrations/supabase/client');
    
    if (user?.email) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to resend',
          description: error.message || 'Could not resend verification email',
        });
      } else {
        toast({
          title: 'Email sent!',
          description: 'Please check your inbox for the verification link.',
        });
        setResendCooldown(60);
      }
    }
    
    setIsResending(false);
  };

  // Mask email for display
  const maskedEmail = user?.email 
    ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : '';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Please check your inbox at:
            </p>
            <p className="font-medium text-foreground">{maskedEmail}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Click the verification link in your email
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                Check your spam folder if you don't see it
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                The link expires in 1 hour
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={resendCooldown > 0 || isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate('/auth')}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Back to Login
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            If you continue to have issues, please contact{' '}
            <a href="mailto:devops@dobeu.cloud" className="text-primary hover:underline">
              support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
