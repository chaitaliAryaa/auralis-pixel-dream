import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import heroImage from "@/assets/hero-habits.jpg";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (isSignUp) {
      toast.success("Check your email to confirm your account!");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Hero image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={heroImage} alt="Healthy habits illustration" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 flex flex-col justify-center h-full p-12">
          <h1 className="text-5xl font-extrabold text-primary-foreground leading-tight mb-4">
            Build Better<br />Habits Today
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Track, analyze, and improve your daily routines with AI-powered insights and beautiful visualizations.
          </p>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">A</div>
              <span className="text-2xl font-bold text-foreground">Auralis</span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Start tracking habits today" : "Sign in to continue your journey"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl"
            />
            <Button type="submit" className="w-full h-12 rounded-xl gradient-hero text-primary-foreground font-semibold" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary font-medium hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
