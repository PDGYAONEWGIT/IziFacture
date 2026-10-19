"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Image as ImageIcon, Trash2, Pencil, Check, Eye, Save, Download, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PreviewInvoice } from "@/components/invoices/PreviewInvoice";
import { useReactToPrint } from "react-to-print";
import { getProfile, uploadLogo } from "@/lib/services/profile";
import { getClients, type ClientWithStats } from "@/lib/services/clients";
import { getProducts, type Product } from "@/lib/services/products";
import { createInvoiceRecord } from "@/lib/services/invoices";
import { InvoiceNewSkeleton } from "@/components/skeletons/InvoiceNewSkeleton";

export default function CreateInvoicePage() {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [availableClients, setAvailableClients] = useState<ClientWithStats[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Dates
  const todayStr = new Date().toISOString().split("T")[0];
  const dueDateDefault = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, "0")}/${Math.floor(100 + Math.random() * 900)}`
  );
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [invoiceDueDate, setInvoiceDueDate] = useState(dueDateDefault);
  const [isSaving, setIsSaving] = useState(false);
  const [themeColor, setThemeColor] = useState("#8b5cf6");
  const [templateId, setTemplateId] = useState(1);
  const [currency, setCurrency] = useState("€");
  const COLORS = ["#0f172a", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#d946ef"];

  const [sender, setSender] = useState({
    name: "Mon Entreprise",
    address1: "123 Rue de l'Exemple",
    address2: "75001 Paris",
    country: "France",
    phone: "+33 1 23 45 67 89",
    email: "contact@monentreprise.com",
  });
  const [isEditingSender, setIsEditingSender] = useState(false);

  const [client, setClient] = useState({
    name: "Client Exemple",
    address1: "1901 Rue du Commerce",
    address2: "69000 Lyon",
    country: "France",
    phone: "+33 4 12 34 56 78",
    email: "contact@clientexemple.com",
  });
  const [isEditingClient, setIsEditingClient] = useState(false);

  const [lineItems, setLineItems] = useState([
    { id: 1, productId: "", description: "Prestation de service", quantity: 1, unitPrice: 150 },
  ]);

  // Load user profile, clients, and products from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const [profile, clientsList, productsList] = await Promise.all([
          getProfile(),
          getClients(),
          getProducts(),
        ]);

        if (profile) {
          setSender({
            name: profile.company_name || "Mon Entreprise",
            address1: profile.address_line1 || "",
            address2: profile.address_line2 || (profile.city ? `${profile.city}` : ""),
            country: profile.country || "France",
            phone: profile.phone || "",
            email: profile.email || "",
          });
          if (profile.currency) setCurrency(profile.currency);
          if (profile.theme_color) setThemeColor(profile.theme_color);
          if (profile.template_id) setTemplateId(profile.template_id);
          if (profile.logo_url) setLogoPreview(profile.logo_url);
        }

        setAvailableClients(clientsList);
        setAvailableProducts(productsList);

        if (clientsList.length > 0) {
          const first = clientsList[0];
          setSelectedClientId(first.id);
          setClient({
            name: first.name,
            address1: first.address_line1 || "",
            address2: first.city || "",
            country: first.country || "France",
            phone: first.phone || "",
            email: first.email || "",
          });
        }
      } catch (err) {
        console.error("Error loading Supabase initial data:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle client dropdown selection
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const selected = availableClients.find((c) => c.id === clientId);
    if (selected) {
      setClient({
        name: selected.name,
        address1: selected.address_line1 || "",
        address2: selected.city || "",
        country: selected.country || "France",
        phone: selected.phone || "",
        email: selected.email || "",
      });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Veuillez sélectionner une image au format JPEG ou PNG.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 4 Mo.");
      return;
    }

    try {
      setIsUploadingLogo(true);
      const publicUrl = await uploadLogo(file);
      setLogoPreview(publicUrl);
    } catch (err: any) {
      console.error(err);
      // Fallback local preview
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now(), productId: "", description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: number, field: string, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleProductSelect = (itemId: number, productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    if (product) {
      setLineItems(
        lineItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                productId: product.id,
                description: product.name + (product.description ? ` - ${product.description}` : ""),
                unitPrice: Number(product.price) || 0,
              }
            : item
        )
      );
    }
  };

  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.20; // 20% standard
  const total = subtotal + tax;

  const handleSave = async () => {
    if (!client.name.trim()) {
      alert("Veuillez renseigner les informations du client.");
      return;
    }

    setIsSaving(true);
    try {
      await createInvoiceRecord(
        {
          client_id: selectedClientId || null,
          client_name: client.name,
          client_email: client.email,
          client_phone: client.phone,
          client_address: `${client.address1} ${client.address2}, ${client.country}`.trim(),
          invoice_number: invoiceNumber,
          issue_date: invoiceDate,
          due_date: invoiceDueDate,
          status: "En attente",
          subtotal: subtotal,
          tax_amount: tax,
          total_amount: total,
          currency: currency,
          theme_color: themeColor,
          template_id: templateId,
          logo_url: logoPreview,
        },
        lineItems.map((it) => ({
          product_id: it.productId || null,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          total: it.quantity * it.unitPrice,
        }))
      );

      alert("Facture enregistrée avec succès sur Supabase !");
      router.push("/invoices");
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de l'enregistrement de la facture: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `facture-${invoiceNumber || "nouvelle"}`,
  });

  if (isInitialLoading) {
    return <InvoiceNewSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12 overflow-hidden lg:overflow-visible">
      {/* Top Split: Form info & Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Form Area */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Nouvelle facture</h1>
              <p className="text-slate-500 text-sm mt-0.5">Enregistrée directement dans votre base Supabase.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button id="page-btn-preview" variant="outline" className="flex items-center gap-2 bg-white rounded-xl">
                      <Eye className="w-4 h-4" />
                      Aperçu
                    </Button>
                  }
                />
                <DialogContent className="max-w-[95vw] lg:max-w-5xl w-fit flex justify-center max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none">
                  <PreviewInvoice 
                    sender={sender}
                    client={client}
                    lineItems={lineItems}
                    subtotal={subtotal}
                    taxTotal={tax}
                    total={total}
                    logoUrl={logoPreview}
                    invoiceNumber={invoiceNumber}
                    date={invoiceDate}
                    themeColor={themeColor}
                    templateId={templateId}
                    currency={currency}
                  />
                </DialogContent>
              </Dialog>

              <Button 
                id="page-btn-save" 
                variant="outline" 
                onClick={handleSave} 
                disabled={isSaving} 
                className="flex items-center gap-2 bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 rounded-xl"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>

              <Button id="page-btn-download" onClick={() => handleDownloadPDF()} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                <Download className="w-4 h-4" />
                Télécharger
              </Button>
            </div>
          </div>
          
          <div style={{ display: "none" }}>
            <div ref={printRef}>
              <PreviewInvoice 
                sender={sender}
                client={client}
                lineItems={lineItems}
                subtotal={subtotal}
                taxTotal={tax}
                total={total}
                logoUrl={logoPreview}
                invoiceNumber={invoiceNumber}
                date={invoiceDate}
                themeColor={themeColor}
                templateId={templateId}
                currency={currency}
              />
            </div>
          </div>

          {/* Invoice Numbers & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-3xl shadow-sm">
            <div className="space-y-2">
              <Label className="text-slate-500 font-medium">N° de Facture</Label>
              <Input 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)} 
                className="rounded-xl h-11 bg-slate-50 border-none font-medium" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-500 font-medium">Date d'émission</Label>
              <Input 
                type="date" 
                value={invoiceDate} 
                onChange={(e) => setInvoiceDate(e.target.value)} 
                className="rounded-xl h-11 bg-slate-50 border-none" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-500 font-medium">Date d'échéance</Label>
              <Input 
                type="date" 
                value={invoiceDueDate} 
                onChange={(e) => setInvoiceDueDate(e.target.value)} 
                className="rounded-xl h-11 bg-slate-50 border-none" 
              />
            </div>
          </div>

          {/* Logo Upload Box */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <Label className="text-slate-500 font-medium mb-3 block">Logo de l'entreprise (Supabase Storage)</Label>
            <input 
              type="file" 
              ref={logoInputRef} 
              onChange={handleLogoUpload} 
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden" 
            />
            <div 
              onClick={() => logoInputRef.current?.click()}
              className="group min-h-[120px] w-full border-2 border-dashed border-violet-200 bg-violet-50/50 rounded-2xl flex flex-col items-center justify-center text-violet-600 cursor-pointer transition-all duration-300 hover:bg-violet-50 hover:border-violet-400 p-4"
            >
              {isUploadingLogo ? (
                <div className="flex items-center gap-2 text-sm text-violet-700">
                  <Loader2 className="w-5 h-5 animate-spin" /> Upload vers Supabase Storage...
                </div>
              ) : logoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={logoPreview} alt="Logo" className="max-h-20 object-contain rounded-lg" />
                  <span className="text-xs text-slate-500 group-hover:text-violet-600">Cliquez pour modifier le logo</span>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-violet-100/50 rounded-full mb-2">
                    <ImageIcon className="h-6 w-6 opacity-80" />
                  </div>
                  <span className="font-medium text-sm">Ajouter un logo</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG ou WEBP jusqu'à 4 Mo</span>
                </>
              )}
            </div>
          </div>

          {/* Bill From / To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-none shadow-sm relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
              <CardContent className="p-6 pl-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-slate-700">Émetteur</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditingSender(!isEditingSender)}
                    className="h-8 w-8 text-violet-600 hover:bg-violet-100 rounded-full"
                  >
                    {isEditingSender ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </Button>
                </div>
                {isEditingSender ? (
                  <div className="space-y-2">
                    <Input value={sender.name} onChange={(e) => setSender({ ...sender, name: e.target.value })} placeholder="Nom" className="h-9 text-sm" />
                    <Input value={sender.address1} onChange={(e) => setSender({ ...sender, address1: e.target.value })} placeholder="Adresse" className="h-9 text-sm" />
                    <Input value={sender.address2} onChange={(e) => setSender({ ...sender, address2: e.target.value })} placeholder="Ville" className="h-9 text-sm" />
                    <Input value={sender.country} onChange={(e) => setSender({ ...sender, country: e.target.value })} placeholder="Pays" className="h-9 text-sm" />
                    <Input value={sender.phone} onChange={(e) => setSender({ ...sender, phone: e.target.value })} placeholder="Téléphone" className="h-9 text-sm" />
                    <Input value={sender.email} onChange={(e) => setSender({ ...sender, email: e.target.value })} placeholder="Email" className="h-9 text-sm" />
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-base text-slate-900">{sender.name}</p>
                    <p className="text-slate-500">{sender.address1}</p>
                    <p className="text-slate-500">{sender.address2}</p>
                    <p className="text-slate-500">{sender.country}</p>
                    <p className="text-slate-500 pt-2">{sender.phone}</p>
                    <p className="text-slate-500">{sender.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl border-none shadow-sm relative overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600" />
              <CardContent className="p-6 pl-8">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-700">Client destinataire</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsEditingClient(!isEditingClient)}
                    className="h-8 w-8 text-violet-600 hover:bg-violet-100 rounded-full"
                  >
                    {isEditingClient ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  </Button>
                </div>

                {availableClients.length > 0 && (
                  <div className="mb-3">
                    <Select value={selectedClientId} onValueChange={(val) => val && handleClientSelect(val)}>
                      <SelectTrigger className="w-full h-9 rounded-xl bg-slate-50 border-slate-200 text-xs">
                        <SelectValue placeholder="Sélectionner un client existant" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {availableClients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} {c.city ? `(${c.city})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {isEditingClient ? (
                  <div className="space-y-2">
                    <Input value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} placeholder="Nom" className="h-9 text-sm" />
                    <Input value={client.address1} onChange={(e) => setClient({ ...client, address1: e.target.value })} placeholder="Adresse" className="h-9 text-sm" />
                    <Input value={client.address2} onChange={(e) => setClient({ ...client, address2: e.target.value })} placeholder="Ville" className="h-9 text-sm" />
                    <Input value={client.country} onChange={(e) => setClient({ ...client, country: e.target.value })} placeholder="Pays" className="h-9 text-sm" />
                    <Input value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} placeholder="Téléphone" className="h-9 text-sm" />
                    <Input value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} placeholder="Email" className="h-9 text-sm" />
                  </div>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-base text-slate-900">{client.name}</p>
                    <p className="text-slate-500">{client.address1}</p>
                    <p className="text-slate-500">{client.address2}</p>
                    <p className="text-slate-500">{client.country}</p>
                    <p className="text-slate-500 pt-2">{client.phone}</p>
                    <p className="text-slate-500">{client.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Settings Sidebar */}
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
                <div className="border border-slate-200 rounded-3xl p-1 bg-white" style={{ borderColor: themeColor }}>
                  <div className="bg-slate-50 rounded-2xl p-4 overflow-hidden relative h-[160px] flex items-center justify-center">
                    <MiniMockup templateId={templateId} color={themeColor} />
                  </div>
                </div>
                <Button 
                  onClick={() => setTemplateId((prev) => (prev === 10 ? 1 : prev + 1))}
                  className="w-full rounded-xl h-12 text-white font-medium mt-4 shadow-sm"
                  style={{ backgroundColor: themeColor }}
                >
                  Changer de modèle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Line Items Area */}
      <div className="w-full space-y-8">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Articles & Prestations</h3>
            {availableProducts.length > 0 && (
              <span className="text-xs text-slate-400">
                Vous pouvez sélectionner directement un article de votre catalogue
              </span>
            )}
          </div>

          <div className="space-y-3">
            {lineItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
                {availableProducts.length > 0 && (
                  <div className="w-full md:w-56">
                    <Select 
                      value={item.productId} 
                      onValueChange={(val) => val && handleProductSelect(item.id, val)}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 text-xs">
                        <SelectValue placeholder="Choisir du catalogue..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {availableProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({Number(p.price).toFixed(2)} €)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex-1 w-full">
                  <Input 
                    value={item.description} 
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Description de la prestation ou de l'article"
                    className="h-11 rounded-xl bg-white"
                  />
                </div>

                <div className="w-full md:w-28 flex items-center gap-2">
                  <span className="text-xs text-slate-400 md:hidden">Qté:</span>
                  <Input 
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    className="h-11 rounded-xl bg-white text-center"
                    placeholder="Qté"
                  />
                </div>

                <div className="w-full md:w-36 flex items-center gap-2">
                  <span className="text-xs text-slate-400 md:hidden">Prix:</span>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-3 text-slate-400 text-sm">{currency}</span>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="h-11 rounded-xl bg-white pl-8 text-right font-medium"
                    />
                  </div>
                </div>

                <div className="w-full md:w-32 flex items-center justify-between md:justify-end gap-2">
                  <span className="font-semibold text-slate-900">
                    {(item.quantity * item.unitPrice).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button 
              variant="outline" 
              onClick={addLineItem}
              className="w-full h-11 border-dashed border-slate-300 text-slate-600 hover:text-violet-600 hover:border-violet-300 rounded-xl mt-3"
            >
              <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne d'article
            </Button>
          </div>

          {/* Totals */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 mt-6 border-t border-slate-100">
            <div className="text-sm text-slate-400 max-w-sm">
              TVA calculée automatiquement à 20%. Tous les montants sont enregistrés et sécurisés sur Supabase.
            </div>

            <div className="w-full md:w-72 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Sous-total HT</span>
                <span className="font-medium text-slate-900">
                  {subtotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>TVA (20%)</span>
                <span className="font-medium text-slate-900">
                  {tax.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total TTC</span>
                <span className="text-violet-700 text-xl font-bold">
                  {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMockup({ templateId, color }: { templateId: number; color: string }) {
  const HeaderLine = ({ w = "100%", c = "#cbd5e1" }: { w?: string; c?: string }) => (
    <div className="h-1 rounded-full" style={{ width: w, backgroundColor: c }} />
  );
  const Block = ({ h = "8px", w = "100%", c = "#cbd5e1" }: { h?: string; w?: string; c?: string }) => (
    <div className="rounded-sm" style={{ height: h, width: w, backgroundColor: c }} />
  );

  switch (templateId) {
    case 1:
      return (
        <div className="w-full h-full flex flex-col gap-2 p-1">
          <div className="flex justify-between items-start">
            <Block w="24px" h="12px" />
            <div className="flex flex-col gap-1 items-end w-1/3">
              <HeaderLine c={color} w="80%" />
              <HeaderLine w="40%" />
            </div>
          </div>
          <div className="flex gap-4 mt-2">
            <div className="w-1/2 flex flex-col gap-1">
              <HeaderLine w="60%" />
              <HeaderLine w="80%" />
            </div>
            <div className="w-1/2 flex flex-col gap-1">
              <HeaderLine w="60%" />
              <HeaderLine w="80%" />
            </div>
          </div>
          <Block h="4px" w="100%" c={color} />
          <Block h="24px" w="100%" />
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex flex-col gap-2 p-1">
          <div className="flex justify-between items-start">
            <Block w="24px" h="12px" c={color} />
            <div className="flex flex-col gap-1 items-end w-1/3">
              <HeaderLine c={color} w="80%" />
            </div>
          </div>
          <Block h="4px" w="100%" c={color} />
          <Block h="24px" w="100%" />
        </div>
      );
  }
}
