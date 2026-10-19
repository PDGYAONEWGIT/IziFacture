import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-32 px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            La facturation conçue pour les entreprises en croissance
          </h1>
          <p className="text-xl text-slate-600 max-w-md">
            Créez, envoyez et suivez vos factures automatiquement — pour ne plus rien laisser passer.
          </p>
          <Link 
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8 h-14 text-lg")}
          >
            Générer une facture
          </Link>
        </div>
        
        {/* Abstract Dashboard Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-violet-100/50 rounded-3xl transform translate-x-4 translate-y-4" />
          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-100 p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="w-32 h-6 bg-slate-100 rounded-full" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100" />
                <div className="w-8 h-8 rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-violet-50 rounded-2xl border border-violet-100" />
              <div className="h-24 bg-slate-50 rounded-2xl" />
              <div className="h-24 bg-slate-50 rounded-2xl" />
            </div>
            <div className="relative h-64 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-inner">
              <Image 
                src="/hero-chart.jpg"
                alt="Évolution du chiffre d'affaires"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-violet-50/50 py-24 text-center space-y-12 px-8">
        <p className="font-semibold text-slate-500 uppercase tracking-widest text-sm">Ils nous font confiance</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            {
              quote: "IziFacture a divisé par deux le temps que je passe sur ma facturation. Le suivi en temps réel est un vrai game changer pour ma trésorerie.",
              author: "Amadou Diallo",
              role: "Fondateur, TechAfrica",
              img: "https://i.pravatar.cc/150?u=amadou"
            },
            {
              quote: "Enfin un outil pensé pour notre réalité. Les factures sont élégantes, pro, et l'interface est d'une simplicité enfantine. Je recommande à 100%.",
              author: "Fatou Diop",
              role: "Consultante Indépendante",
              img: "https://i.pravatar.cc/150?u=fatou"
            },
            {
              quote: "Les rappels automatiques ont sauvé notre cash flow. Nos clients paient beaucoup plus rapidement depuis qu'on utilise cette plateforme.",
              author: "Marc Leroy",
              role: "Gérant, Digital Studio",
              img: "https://i.pravatar.cc/150?u=marc"
            }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative">
              <div className="text-violet-300 mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 18L16.41 11.594V7H21.5V11.594L19.106 18H14.017ZM3.5 18L5.893 11.594V7H10.983V11.594L8.59 18H3.5Z" />
                </svg>
              </div>
              <p className="text-slate-700 text-lg mb-8 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-violet-100">
                  <AvatarImage src={t.img} alt={t.author} />
                  <AvatarFallback>{t.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-slate-900">{t.author}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-8 max-w-7xl mx-auto w-full text-center space-y-16">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">Tout ce dont vous avez besoin</span>
          <h2 className="text-3xl font-bold text-slate-900">
            Des paiements plus rapides à une meilleure visibilité, gérez vos factures en toute confiance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Card className="group rounded-3xl border-none shadow-sm bg-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white cursor-pointer">
            <CardContent className="p-8 flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-md">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Création de factures automatisée</h3>
                <p className="text-slate-600 leading-relaxed">Réduisez les erreurs et accélérez la facturation avec des factures intelligentes générées automatiquement.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group rounded-3xl border-none shadow-sm bg-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white cursor-pointer">
            <CardContent className="p-8 flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-md">
                <Zap className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Statut de paiement en temps réel</h3>
                <p className="text-slate-600 leading-relaxed">Obtenez une visibilité à jour des paiements pour gérer votre trésorerie en temps réel.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group rounded-3xl border-none shadow-sm bg-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white cursor-pointer">
            <CardContent className="p-8 flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-md">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Rappels intelligents</h3>
                <p className="text-slate-600 leading-relaxed">Augmentez les paiements dans les délais grâce à des rappels pertinents envoyés automatiquement.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group rounded-3xl border-none shadow-sm bg-slate-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white cursor-pointer">
            <CardContent className="p-8 flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white group-hover:shadow-md">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Rapports prêts pour la comptabilité</h3>
                <p className="text-slate-600 leading-relaxed">Accédez à des rapports organisés qui rendent la comptabilité facile et sans stress.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-violet-900 text-white py-32 px-8">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-6">
            <span className="bg-violet-800 text-violet-200 text-xs font-semibold px-3 py-1 rounded-full">Comment ça marche</span>
            <h2 className="text-3xl font-bold">Un flux de travail simple conçu pour vous aider à mieux facturer et être payé à temps.</h2>
          </div>

          <div className="text-left max-w-xl mx-auto space-y-12">
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center font-bold text-sm">1</div>
              <div className="absolute left-4 top-10 bottom-[-40px] w-px bg-violet-800" />
              <h3 className="text-xl font-bold mb-2">Créer une facture</h3>
              <p className="text-violet-200">Générez automatiquement des factures en utilisant les informations de facturation enregistrées.</p>
            </div>
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center font-bold text-sm">2</div>
              <div className="absolute left-4 top-10 bottom-[-40px] w-px bg-violet-800" />
              <h3 className="text-xl font-bold mb-2">Envoyer et suivre</h3>
              <p className="text-violet-200">Envoyez des factures instantanément et suivez le statut de paiement en temps réel.</p>
            </div>
            <div className="relative pl-12">
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="text-xl font-bold mb-2">Être payé et réconcilier</h3>
              <p className="text-violet-200">Recevez les paiements plus rapidement et accédez aux rapports comptables à tout moment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-8 max-w-7xl mx-auto w-full text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Tarifs</h2>
          <p className="text-slate-600">Une tarification simple et transparente qui évolue avec votre entreprise</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
          {[
            {
              name: "Starter",
              desc: "Pour les indépendants et les petites équipes qui se lancent.",
              price: "4 500",
              features: ["Création de factures basique", "Envoi par email", "Statut de paiement", "Rappels automatiques", "Rapports simples", "Support par email"]
            },
            {
              name: "Pro",
              desc: "Pour les entreprises en croissance qui ont besoin de plus de contrôle.",
              price: "7 500",
              popular: true,
              features: ["Tout dans Starter", "Factures illimitées", "Suivi avancé des paiements", "Personnalisation des factures", "Rapports comptables", "Support prioritaire"]
            },
            {
              name: "Business",
              desc: "Pour les grandes équipes gérant de gros volumes de factures.",
              price: "11 500",
              features: ["Tout dans Pro", "Accès multi-utilisateurs", "Analyses avancées", "Actions en masse", "Support dédié", "API & intégrations"]
            }
          ].map((plan, i) => (
            <Card key={i} className={`rounded-3xl overflow-visible ${plan.popular ? 'border-2 border-violet-600 shadow-xl relative' : 'border-slate-200 shadow-sm'}`}>
              {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap z-10">LE PLUS POPULAIRE</div>}
              <CardContent className="p-8 flex flex-col h-full">
                <div className="mb-8 mt-2">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-500 min-h-[40px]">{plan.desc}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price} FCFA</span>
                    <span className="text-slate-500">/mois</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex gap-3 items-start text-sm text-slate-700">
                      <Check className="w-5 h-5 text-violet-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Button className={`w-full rounded-xl h-12 font-semibold ${plan.popular ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
