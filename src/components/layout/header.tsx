"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Menu, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/layout/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoadingUser(false);
    }).catch(() => {
      setIsLoadingUser(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setIsLoadingUser(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isNewInvoice = pathname === "/invoices/new";

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 md:gap-4 border-b bg-white px-4 md:px-6">
      <div className="lg:hidden flex items-center">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="mr-1 md:mr-2" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-slate-950 border-r-slate-800 text-slate-300 [&>button]:text-slate-400">
            <div className="flex h-full w-full flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isNewInvoice ? (
        <div className="flex items-center gap-4 flex-1">
          <Link 
            href="/invoices"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center text-sm">
            <span className="text-slate-500">Facture</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium">Créer une facture</span>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <h1 className="text-lg font-semibold capitalize">
            {pathname.split("/")[1] || "Tableau de bord"}
          </h1>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        {isNewInvoice && (
          <>
            <Button variant="outline" className="hidden sm:inline-flex rounded-xl" onClick={() => document.getElementById('page-btn-preview')?.click()}>Aperçu</Button>
            <Button variant="outline" className="hidden md:inline-flex rounded-xl text-violet-600 border-violet-200 bg-violet-50 hover:bg-violet-100 hover:text-violet-700" onClick={() => document.getElementById('page-btn-save')?.click()}>Enregistrer</Button>
            <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2" onClick={() => document.getElementById('page-btn-download')?.click()}>Télécharger</Button>
          </>
        )}
        
        {isLoadingUser ? (
          <div className="h-9 w-9 ml-1 md:ml-4 rounded-full bg-slate-200 animate-pulse border border-slate-100" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
                  <Avatar className="h-9 w-9 ml-1 md:ml-4 border border-violet-100">
                    <AvatarFallback className="bg-violet-100 text-violet-700 font-semibold">
                      {user.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-100">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-slate-900 leading-none">
                      {user.user_metadata?.company_name || "Mon Entreprise"}
                    </p>
                    <p className="text-xs text-slate-500 truncate leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm" className="rounded-xl ml-2">
              <UserIcon className="w-4 h-4 mr-2" />
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
