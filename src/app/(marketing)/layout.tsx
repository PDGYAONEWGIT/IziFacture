import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex h-20 items-center justify-between px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-sm shadow-violet-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <div className="flex gap-[3px] items-end h-[18px]">
              <div className="w-[4px] h-[10px] bg-white/70 rounded-full transition-all duration-300 group-hover:h-[14px]"></div>
              <div className="w-[4px] h-[18px] bg-white rounded-full transition-all duration-300 group-hover:h-[18px]"></div>
              <div className="w-[4px] h-[14px] bg-white/50 rounded-full transition-all duration-300 group-hover:h-[10px]"></div>
            </div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">IziFacture</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#product" className="hover:text-violet-600 transition-colors">Produit</Link>
          <Link href="#features" className="hover:text-violet-600 transition-colors">Fonctionnalités</Link>
          <Link href="#pricing" className="hover:text-violet-600 transition-colors">Tarifs</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium text-slate-600 hover:text-violet-600">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6">S'inscrire</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-950 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 overflow-hidden">
                <div className="flex gap-[3px] items-end h-[16px]">
                  <div className="w-[3px] h-[9px] bg-white/70 rounded-full"></div>
                  <div className="w-[3px] h-[16px] bg-white rounded-full"></div>
                  <div className="w-[3px] h-[12px] bg-white/50 rounded-full"></div>
                </div>
              </div>
              <span className="font-bold text-2xl text-white">IziFacture</span>
            </Link>
            <p className="text-sm text-slate-400">Facturation simple et suivi des paiements pour les entreprises en croissance.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Comment ça marche</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tarifs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Assistance</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Nous contacter</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500">
          <p>© 2024 IziFacture. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
