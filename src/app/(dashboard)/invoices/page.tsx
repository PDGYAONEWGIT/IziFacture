"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Search, Filter, MoreHorizontal, Trash, X, Loader2, CheckCircle2, Clock, AlertTriangle, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";
import { PreviewInvoice } from "@/components/invoices/PreviewInvoice";
import { getInvoices, updateInvoiceStatus, deleteInvoiceRecord, type InvoiceWithItems } from "@/lib/services/invoices";
import { getProfile, type Profile } from "@/lib/services/profile";
import { InvoicesSkeleton } from "@/components/skeletons/InvoicesSkeleton";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tous");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [templateId, setTemplateId] = useState(1);
  const [currency, setCurrency] = useState("€");
  const COLORS = ["#0f172a", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#d946ef"];

  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `facture-${selectedInvoice?.invoice_number || "telechargement"}`,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, profileData] = await Promise.all([
        getInvoices(),
        getProfile(),
      ]);
      setInvoices(invoicesData);
      setProfile(profileData);
      if (profileData?.theme_color) setThemeColor(profileData.theme_color);
      if (profileData?.template_id) setTemplateId(profileData.template_id);
      if (profileData?.currency) setCurrency(profileData.currency);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateInvoiceStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      await deleteInvoiceRecord(id);
      await loadData();
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Payée":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-medium px-2.5 py-0.5">Payée</Badge>;
      case "En attente":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none font-medium px-2.5 py-0.5">En attente</Badge>;
      case "En retard":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none font-medium px-2.5 py-0.5">En retard</Badge>;
      case "Brouillon":
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium px-2.5 py-0.5">Brouillon</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium px-2.5 py-0.5">{status}</Badge>;
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Tous" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getInvoicePreviewProps = (inv: InvoiceWithItems | null) => {
    if (!inv) return null;

    const sender = {
      name: profile?.company_name || "Mon Entreprise",
      address1: profile?.address_line1 || "123 Rue de l'Entreprise",
      address2: profile?.address_line2 || profile?.city || "Paris",
      country: profile?.country || "France",
      phone: profile?.phone || "+33 1 23 45 67 89",
      email: profile?.email || "contact@monentreprise.com",
    };

    const client = {
      name: inv.client_name,
      address1: inv.client_address || "",
      address2: "",
      country: "France",
      phone: inv.client_phone || "",
      email: inv.client_email || "",
    };

    const lineItems = inv.items.map((it, idx) => ({
      id: idx + 1,
      description: it.description,
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unit_price) || 0,
    }));

    return {
      sender,
      client,
      lineItems,
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

  const previewProps = getInvoicePreviewProps(selectedInvoice);

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Toutes les factures</h1>
          <p className="text-slate-500 mt-1">Gérez et suivez l'état de vos factures synchronisées avec Supabase.</p>
        </div>
        <Link 
          href="/invoices/new" 
          className={cn(buttonVariants(), "bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6 shadow-md shadow-violet-200")}
        >
          <Plus className="w-4 h-4 mr-2" /> Créer une facture
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Rechercher par client ou N°..." 
              className="pl-10 rounded-xl bg-slate-50 border-none h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
              {["Tous", "Payée", "En attente", "En retard"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    statusFilter === s
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <InvoicesSkeleton contentOnly />
        ) : (
          <>
            {/* Vue Mobile */}
            <div className="md:hidden flex flex-col gap-4 mt-2">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{invoice.invoice_number}</span>
                    {getStatusBadge(invoice.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Client</span>
                    <span className="font-medium text-slate-900">{invoice.client_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Émise le</span>
                    <span className="text-slate-700">{invoice.issue_date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Montant TTC</span>
                    <span className="font-bold text-slate-900">
                      {Number(invoice.total_amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
                    </span>
                  </div>
                  <div className="pt-3 mt-1 border-t border-slate-50 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-xl text-violet-700 bg-violet-50 hover:bg-violet-100 h-10 border-violet-100"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Download className="w-4 h-4 mr-2" /> Aperçu & PDF
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-slate-400 hover:text-slate-600 rounded-xl")}>
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-2">
                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Payée")} className="cursor-pointer">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Marquer comme Payée
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "En attente")} className="cursor-pointer">
                          <Clock className="w-4 h-4 mr-2 text-amber-600" /> Marquer En attente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "En retard")} className="cursor-pointer">
                          <AlertTriangle className="w-4 h-4 mr-2 text-red-600" /> Marquer En retard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                          <Trash className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {filteredInvoices.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">Aucune facture trouvée</p>
                  <p className="text-sm text-slate-400 mt-1">Créez votre première facture dès maintenant.</p>
                </div>
              )}
            </div>

            {/* Vue Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 bg-slate-50 text-slate-500 font-medium px-4 py-4 rounded-xl mb-2">
                <div>N° Facture</div>
                <div>Client</div>
                <div>Date</div>
                <div>Montant TTC</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="space-y-1">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 items-center px-4 py-3 hover:bg-slate-50/50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                    <div className="font-semibold text-slate-900">{invoice.invoice_number}</div>
                    <div className="text-slate-900 font-medium">{invoice.client_name}</div>
                    <div className="text-slate-500 text-sm">{invoice.issue_date}</div>
                    <div className="font-semibold text-slate-900">
                      {Number(invoice.total_amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {invoice.currency}
                    </div>
                    <div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="text-right flex justify-end gap-2 items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg text-xs"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-slate-400 hover:text-slate-600 rounded-lg")}>
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-2 w-48">
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "Payée")} className="cursor-pointer">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" /> Marquer Payée
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "En attente")} className="cursor-pointer">
                            <Clock className="w-4 h-4 mr-2 text-amber-600" /> Marquer En attente
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(invoice.id, "En retard")} className="cursor-pointer">
                            <AlertTriangle className="w-4 h-4 mr-2 text-red-600" /> Marquer En retard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                            <Trash className="w-4 h-4 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">Aucune facture enregistrée</p>
                    <p className="text-sm text-slate-400 mt-1">Cliquez sur "+ Créer une facture" pour démarrer.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Aperçu & Impression */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-[95vw] lg:max-w-6xl w-fit h-[90vh] flex flex-col lg:flex-row gap-6 bg-slate-50/50 p-6 border-none shadow-2xl rounded-3xl overflow-y-auto lg:overflow-hidden">
          <div className="absolute right-4 top-4 z-50">
            <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(null)} className="h-8 w-8 rounded-full bg-white shadow-sm hover:bg-slate-100">
              <X className="h-4 w-4 text-slate-500" />
            </Button>
          </div>

          <div className="flex-1 bg-transparent rounded-2xl overflow-y-auto flex justify-center items-start lg:pr-4">
            {previewProps && (
              <div className="shadow-lg rounded-sm overflow-hidden" ref={printRef}>
                <PreviewInvoice {...previewProps} themeColor={themeColor} templateId={templateId} currency={currency} />
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
                  <Label className="font-medium text-slate-600">Couleur d'accent</Label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((color) => (
                      <div 
                        key={color}
                        onClick={() => setThemeColor(color)}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${themeColor === color ? "scale-110 ring-2 ring-violet-500 ring-offset-2" : "hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                      >
                        {themeColor === color && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                      </div>
                    ))}
                  </div>
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
