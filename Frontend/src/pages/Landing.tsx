import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import googleLogo from "@/assets/google-logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { triggerOAuthLogin } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, setAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await triggerOAuthLogin();

      if (response.status === "success") {
        setAuthenticated(true); // Set auth state
        navigate("/chat");
      }
    } catch (err) {
      setError("Failed to connect. Please try again.");
      console.error("OAuth login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gradient">
            Welcome
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to continue to your account
          </p>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          variant="outline"
          size="lg"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-card hover:bg-card/80 border-border h-12 text-base"
        >
          {isLoading ? (
            <>
              <Spinner className="w-5 h-5" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <img src={googleLogo} alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </>
          )}
        </Button>

        {error && (
          <p className="text-destructive text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Landing;