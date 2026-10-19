"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, X, Loader2, ArrowUpRight, Clock, CheckCircle2, AlertTriangle, Users, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useReactToPrint } from "react-to-print";
import { PreviewInvoice } from "@/components/invoices/PreviewInvoice";
import { getDashboardStats, type InvoiceWithItems } from "@/lib/services/invoices";
import { getProfile, type Profile } from "@/lib/services/profile";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingRevenue: 0,
    overdueRevenue: 0,
    totalInvoices: 0,
    activeClientsCount: 0,
    recentInvoices: [] as InvoiceWithItems[],
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null);
  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [templateId, setTemplateId] = useState(1);
  const [currency, setCurrency] = useState("€");
  const COLORS = ["#0f172a", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#d946ef"];
  
  const printRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `facture-${selectedInvoice?.invoice_number || "download"}`,
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashStats, prof] = await Promise.all([
          getDashboardStats(),
          getProfile(),
        ]);
        setStats(dashStats);
        setProfile(prof);
        if (prof?.theme_color) setThemeColor(prof.theme_color);
        if (prof?.template_id) setTemplateId(prof.template_id);
        if (prof?.currency) setCurrency(prof.currency);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payée":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-medium px-2.5 py-0.5">Payée</Badge>;
      case "En attente":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium px-2.5 py-0.5">En attente</Badge>;
      case "En retard":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-medium px-2.5 py-0.5">En retard</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium px-2.5 py-0.5">{status}</Badge>;
    }
  };

  const getInvoicePreviewProps = (inv: InvoiceWithItems | null) => {
    if (!inv) return null;

    return {
      sender: {
        name: profile?.company_name || "Mon Entreprise",
        address1: profile?.address_line1 || "123 Rue de l'Entreprise",
        address2: profile?.address_line2 || profile?.city || "Paris",
        country: profile?.country || "France",
        phone: profile?.phone || "+33 1 23 45 67 89",
        email: profile?.email || "contact@monentreprise.com",
      },
      client: {
        name: inv.client_name,
        address1: inv.client_address || "",
        address2: "",
        country: "France",
        phone: inv.client_phone || "",
        email: inv.client_email || "",
      },
      lineItems: inv.items.map((it, idx) => ({
        id: idx + 1,
        description: it.description,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unit_price) || 0,
      })),
      subtotal: Number(inv.subtotal),
      taxTotal: Number(inv.tax_amount),
      total: Number(inv.total_amount),
      logoUrl: inv.logo_url || profile?.logo_url || null,
      invoiceNumber: inv.invoice_number,
      date: inv.issue_date,
      themeColor: inv.theme_color || themeColor,
      templateId: inv.template_id || templateId,
      currency: inv.currency || currency,
    };
  };

  const invoiceProps = getInvoicePreviewProps(selectedInvoice);
  const totalBilled = stats.totalRevenue + stats.pendingRevenue + stats.overdueRevenue;

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Vue d'ensemble</h1>
          <p className="text-slate-500 mt-1">
            Métriques et données en direct depuis Supabase.
          </p>
        </div>
        <Link 
          href="/invoices/new" 
          className={cn(buttonVariants(), "bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6 shadow-md shadow-violet-200")}
        >
          <Plus className="w-4 h-4 mr-2" /> Créer une facture
        </Link>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Cartes KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="h-2 w-full bg-violet-600" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Total Encaissé</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </div>
                <p className="text-xs text-slate-400 mt-1">Factures avec statut "Payée"</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="h-2 w-full bg-amber-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">En Attente</CardTitle>
                <Clock className="w-4 h-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.pendingRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </div>
                <p className="text-xs text-slate-400 mt-1">En attente de paiement client</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="h-2 w-full bg-red-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">En Retard</CardTitle>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.overdueRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </div>
                <p className="text-xs text-slate-400 mt-1">Échéance dépassée</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="h-2 w-full bg-blue-500" />
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Clients Actifs</CardTitle>
                <Users className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {stats.activeClientsCount}
                </div>
                <p className="text-xs text-slate-400 mt-1">{stats.totalInvoices} facture(s) au total</p>
              </CardContent>
            </Card>
          </div>

          {/* Factures Récentes */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Dernières factures</h2>
                <p className="text-xs text-slate-500 mt-0.5">Vos transactions les plus récentes</p>
              </div>
              <Link 
                href="/invoices" 
                className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                Voir tout <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {stats.recentInvoices.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-medium">Aucune facture enregistrée pour le moment</p>
                <p className="text-sm text-slate-400 mt-1">Créez votre première facture avec Supabase.</p>
                <Link href="/invoices/new" className="inline-block mt-4">
                  <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Créer une facture
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile */}
                <div className="md:hidden flex flex-col gap-4">
                  {stats.recentInvoices.map((inv) => (
                    <div key={inv.id} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">{inv.invoice_number}</span>
                        {getStatusBadge(inv.status)}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">{inv.client_name}</span>
                        <span className="font-bold text-slate-900">
                          {Number(inv.total_amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {inv.currency}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl mt-2"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <Download className="w-4 h-4 mr-2" /> Aperçu & PDF
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Desktop */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1fr] gap-4 bg-slate-50 text-slate-500 font-medium px-4 py-3 rounded-xl mb-2 text-sm">
                    <div>N° Facture</div>
                    <div>Client</div>
                    <div>Date</div>
                    <div>Montant TTC</div>
                    <div>Statut</div>
                    <div className="text-right">Action</div>
                  </div>
                  <div className="space-y-1">
                    {stats.recentInvoices.map((inv) => (
                      <div key={inv.id} className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1fr] gap-4 items-center px-4 py-3 hover:bg-slate-50/50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                        <div className="font-semibold text-slate-900">{inv.invoice_number}</div>
                        <div className="text-slate-900 font-medium">{inv.client_name}</div>
                        <div className="text-slate-500 text-sm">{inv.issue_date}</div>
                        <div className="font-semibold text-slate-900">
                          {Number(inv.total_amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {inv.currency}
                        </div>
                        <div>{getStatusBadge(inv.status)}</div>
                        <div className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg text-xs"
                            onClick={() => setSelectedInvoice(inv)}
                          >
                            <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Modal Aperçu & Impression */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl w-fit h-[90vh] flex flex-col lg:flex-row gap-6 bg-slate-50/50 p-6 border-none shadow-2xl rounded-3xl overflow-y-auto lg:overflow-hidden">
          <div className="absolute right-4 top-4 z-50">
            <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(null)} className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-100">
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          <div className="flex-1 bg-transparent rounded-2xl overflow-y-auto flex justify-center items-start lg:pr-4">
            {invoiceProps && (
              <div className="shadow-lg rounded-sm overflow-hidden" ref={printRef}>
                <PreviewInvoice {...invoiceProps} themeColor={themeColor} templateId={templateId} currency={currency} />
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-6 bg-white">
                <div className="space-y-3">
                  <Label className="font-medium text-slate-600">Devise</Label>
                  <Select value={currency} onValueChange={(val) => val && setCurrency(val)}>
                    <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50 border-none">
                      <SelectValue placeholder="Sélectionner la devise" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="€">🇪🇺 € EUR</SelectItem>
                      <SelectItem value="$">🇺🇸 $ USD</SelectItem>
                      <SelectItem value="FCFA">XOF (FCFA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="font-medium text-slate-600">Modèle {templateId}/10</Label>
                  <Button 
                    onClick={() => setTemplateId((prev) => (prev === 10 ? 1 : prev + 1))}
                    className="w-full rounded-xl h-12 text-white font-medium shadow-sm"
                    style={{ backgroundColor: themeColor }}
                  >
                    Changer de modèle
                  </Button>
                </div>

                <Button 
                  onClick={() => handleDownloadPDF()}
                  className="w-full rounded-xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Imprimer / Exporter PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
