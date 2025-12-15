import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Mask email for display
  const maskedEmail = user?.email
    ? user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  // Auth0 handles email verification automatically through their Universal Login flow
  // If user is logged in but email is not verified, they'll need to complete verification through Auth0
  const isEmailVerified = user?.email_verified ?? false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isEmailVerified ? "Email Verified" : "Verify Your Email"}
          </CardTitle>
          <CardDescription>
            {isEmailVerified
              ? "Your email has been verified successfully"
              : "Email verification is handled through Auth0. Please check your inbox for the verification link."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEmailVerified && (
            <>
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
                    The link expires in 24 hours
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <Button onClick={() => navigate("/")} className="w-full">
              {isEmailVerified ? "Go to Dashboard" : "Continue to Dashboard"}
            </Button>

            <Button
              onClick={() => navigate("/auth")}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            If you continue to have issues, please contact{" "}
            <a
              href="mailto:devops@dobeu.cloud"
              className="text-primary hover:underline"
            >
              support
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
