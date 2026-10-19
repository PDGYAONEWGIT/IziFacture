"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, CheckCircle2, Loader2, Lock, Mail } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // Si la confirmation d'email n'est pas requise ou si la session est active
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl text-slate-100 text-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Vérifiez votre boîte mail
          </CardTitle>
          <CardDescription className="text-slate-300 max-w-sm">
            Un email de confirmation vous a été envoyé à <strong className="text-white">{email}</strong>. Cliquez sur le lien pour valider votre compte.
          </CardDescription>
          <Link href="/login" className="mt-4">
            <Button variant="outline" className="border-slate-700 text-slate-200 hover:text-white rounded-xl">
              Retour à la page de connexion
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl text-slate-100">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Créer un compte IziFacture
        </CardTitle>
        <CardDescription className="text-slate-400">
          Commencez à gérer et émettre vos factures en quelques secondes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-300 text-sm">
              Nom de votre entreprise
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="companyName"
                placeholder="Ex: Acme Studio"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="pl-10 h-11 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-sm">
              Email professionnel
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="contact@entreprise.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 text-sm">
              Mot de passe (min. 6 caractères)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:border-violet-500 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-medium rounded-xl shadow-lg shadow-violet-600/20 transition-all duration-200 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création du compte...
              </>
            ) : (
              <>
                Créer mon compte <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4"
          >
            Se connecter
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
