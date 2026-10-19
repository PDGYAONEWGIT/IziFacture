"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Box, 
  LayoutTemplate, 
  HelpCircle, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { name: "Factures", href: "/invoices", icon: FileText },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Produits", href: "/products", icon: Box },
];

const secondaryNavigation = [
  { name: "Modèles", href: "/templates", icon: LayoutTemplate },
  { name: "Aide & Support", href: "/support", icon: HelpCircle },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex shrink-0 h-16 items-center px-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <div className="flex gap-[3px] items-end h-[16px]">
              <div className="w-[3px] h-[9px] bg-white/70 rounded-full transition-all duration-300 group-hover:h-[12px]"></div>
              <div className="w-[3px] h-[16px] bg-white rounded-full transition-all duration-300 group-hover:h-[16px]"></div>
              <div className="w-[3px] h-[12px] bg-white/50 rounded-full transition-all duration-300 group-hover:h-[9px]"></div>
            </div>
          </div>
          <span className="text-white text-xl font-semibold">IziFacture</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        <div>
          <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Principal</h3>
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-600 text-white"
                      : "hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Autres</h3>
          <nav className="flex flex-col gap-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-violet-600 text-white"
                      : "hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-slate-950 text-slate-300">
      <SidebarContent />
    </div>
  );
}
