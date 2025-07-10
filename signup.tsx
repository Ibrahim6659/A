import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, Calendar, Briefcase, ShoppingBag, UserPlus, Film, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const passwordCriteria = [
    { label: "Au moins 8 caractères", met: password.length >= 8 },
    { label: "Au moins une lettre majuscule", met: /[A-Z]/.test(password) },
    { label: "Au moins un chiffre", met: /[0-9]/.test(password) },
    { label: "Au moins un caractère spécial", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const userRoles = [
    { value: "information_seeker", label: "Visiteur", icon: <Search className="h-4 w-4 mr-2" /> },
    { value: "merchant", label: "Commerçant", icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { value: "employer", label: "Employeur", icon: <Briefcase className="h-4 w-4 mr-2" /> },
    { value: "showbiz", label: "Show business", icon: <Film className="h-4 w-4 mr-2" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword || !userRole) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs, y compris votre rôle sur la plateforme.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordCriteria.every(criterion => criterion.met)) {
      toast({
        title: "Mot de passe faible",
        description: "Veuillez respecter tous les critères de sécurité.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await signup(fullName, email, password, userRole);
      if (success) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        navigate("/");
      } else {
        throw new Error("Échec de l'inscription");
      }
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulation de l'inscription avec Google
    setTimeout(() => {
      // Ici, on simulerait l'appel à un service d'authentification Google
      toast({
        title: "Inscription avec Google",
        description: "Fonctionnalité en cours de développement. Bientôt disponible!",
      });
      setIsLoading(false);
    }, 1500);
  };

  const getRoleIcon = (role: string) => {
    const roleObj = userRoles.find(r => r.value === role);
    return roleObj ? roleObj.icon : <UserPlus className="h-4 w-4 mr-2" />;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-lg">BC</span>
            </div>
            <h1 className="text-2xl font-semibold">Créer un compte</h1>
            <p className="text-muted-foreground mt-2">
              Rejoignez la communauté Burkina Connect Hub
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <div className="relative">
                <User className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Votre nom"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Pourquoi rejoignez-vous notre plateforme?</Label>
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger id="userRole" className="w-full">
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center">
                        {role.icon}
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((segment) => (
                      <div
                        key={segment}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordCriteria.filter(c => c.met).length >= segment
                            ? "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="space-y-1 text-xs">
                    {passwordCriteria.map((criterion, index) => (
                      <li
                        key={index}
                        className={`flex items-center ${
                          criterion.met ? "text-green-600" : "text-muted-foreground"
                        }`}
                      >
                        {criterion.met ? (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                        ) : (
                          <div className="w-3.5 h-3.5 border rounded-full mr-2" />
                        )}
                        {criterion.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 ${
                    confirmPassword && password !== confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : ""
                  }`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground font-normal"
              >
                J'accepte les{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-lg" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Créer un compte...
                </div>
              ) : (
                <span>Créer un compte</span>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou inscrivez-vous avec
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" className="rounded-lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Vous avez déjà un compte?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:flex md:flex-1 bg-gradient-to-br from-primary/5 to-primary/10 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556484687-30636164638b')] bg-cover bg-center opacity-5"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold mb-6">
            Pourquoi rejoindre Burkina Connect Hub?
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Événements</h3>
              <p className="text-muted-foreground">
                Restez informé des derniers événements culturels, conférences, et rassemblements à travers le pays.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Opportunités</h3>
              <p className="text-muted-foreground">
                Accédez aux dernières offres d'emploi et opportunités de bourses pour votre développement professionnel.
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/20">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Marketplace</h3>
              <p className="text-muted-foreground">
                Découvrez les produits des commerçants locaux ou promouvez vos articles auprès d'un public engagé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
