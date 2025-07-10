import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Burkina Connect Hub!",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Veuillez vérifier vos identifiants.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6 bg-card rounded-xl p-6 sm:p-8 border shadow-sm">
          <div className="space-y-2 text-center">
            <Link to="/" className="inline-block">
              <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">BC</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold">Se connecter</h1>
            <p className="text-muted-foreground">
              Connectez-vous à votre compte Burkina Connect
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Se souvenir de moi</span>
              </label>
              <Link to="/reset-password" className="text-primary hover:underline">
                Mot de passe oublié?
              </Link>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de compte?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
