"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal, Edit, Trash, Package, Wrench, Loader2, Plus, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getProducts, createProductRecord, updateProductRecord, deleteProductRecord, type Product } from "@/lib/services/products";
import { ProductsSkeleton } from "@/components/skeletons/ProductsSkeleton";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Tous" | "Service" | "Bien">("Tous");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    tax_rate: 20,
    type: "Service" as "Service" | "Bien",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: 0,
      tax_rate: 20,
      type: "Service",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: Number(product.price) || 0,
      tax_rate: Number(product.tax_rate) || 20,
      type: (product.type as "Service" | "Bien") || "Service",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProductRecord(editingProduct.id, {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          tax_rate: Number(formData.tax_rate),
          type: formData.type,
        });
      } else {
        await createProductRecord({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          tax_rate: Number(formData.tax_rate),
          type: formData.type,
        });
      }
      setIsDialogOpen(false);
      await loadProducts();
    } catch (error: any) {
      alert("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      await deleteProductRecord(id);
      await loadProducts();
    } catch (error: any) {
      alert("Erreur lors de la suppression: " + error.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "Tous" || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Produits & Services</h1>
          <p className="text-slate-500 mt-1">Gérez votre catalogue pour vos factures avec Supabase.</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6 shadow-md shadow-violet-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Ajouter un produit
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Rechercher un produit ou service..." 
              className="pl-10 rounded-xl bg-slate-50 border-none h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(["Tous", "Service", "Bien"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    typeFilter === t
                      ? "bg-white text-violet-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {loading ? (
          <ProductsSkeleton contentOnly />
        ) : (
          <>
            {/* Vue Mobile */}
            <div className="md:hidden flex flex-col gap-4 mt-2">
              {filteredProducts.map((product) => {
                const IconComponent = product.type === "Bien" ? Package : Wrench;
                return (
                  <div key={product.id} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-900">{product.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none font-medium px-2.5 py-0.5">
                        {product.type}
                      </Badge>
                    </div>
                    {product.description && (
                      <p className="text-slate-500 text-sm mt-1">{product.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-3">
                      <div className="flex flex-col">
                        <span className="text-slate-500 text-xs">Prix Unitaire HT</span>
                        <span className="font-medium text-slate-900">
                          {Number(product.price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-500 text-xs">TVA</span>
                        <span className="font-medium text-slate-700">{product.tax_rate}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 mt-1 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEditDialog(product)}
                        className="flex-1 rounded-xl"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Éditer
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">Aucun produit ou service trouvé</p>
                  <p className="text-sm text-slate-400 mt-1">Ajoutez vos prestations pour faciliter la création de factures.</p>
                </div>
              )}
            </div>

            {/* Vue Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50 text-slate-500 font-medium px-4 py-4 rounded-xl mb-2">
                <div>Nom</div>
                <div>Description</div>
                <div>Type</div>
                <div className="text-right">Prix Unitaire HT</div>
                <div className="text-right">TVA</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="space-y-1">
                {filteredProducts.map((product) => {
                  const IconComponent = product.type === "Bien" ? Package : Wrench;
                  return (
                    <div key={product.id} className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] gap-4 items-center px-4 py-3 hover:bg-slate-50/50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                      <div className="font-medium text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        {product.name}
                      </div>
                      <div className="text-sm text-slate-500 truncate pr-4">{product.description || "-"}</div>
                      <div>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none font-medium px-2.5 py-0.5">
                          {product.type}
                        </Badge>
                      </div>
                      <div className="font-medium text-slate-900 text-right">
                        {Number(product.price).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </div>
                      <div className="text-slate-500 text-right">{product.tax_rate}%</div>
                      <div className="text-right flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(product)}
                          className="text-slate-400 hover:text-violet-600 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(product.id)}
                          className="text-slate-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">Aucun article dans votre catalogue</p>
                    <p className="text-sm text-slate-400 mt-1">Cliquez sur "+ Ajouter un produit" pour créer votre premier article.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Ajout / Modification */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingProduct ? "Modifier le produit / service" : "Ajouter un produit / service"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Désignation *</Label>
                <Input 
                  id="product-name"
                  placeholder="Ex: Conception UI/UX ou Ordinateur portable"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-desc">Description</Label>
                <Input 
                  id="product-desc"
                  placeholder="Description détaillée qui apparaîtra sur la facture"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Prix unitaire HT (€) *</Label>
                  <Input 
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-tax">Taux de TVA (%)</Label>
                  <Input 
                    id="product-tax"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => {
                    if (val === "Service" || val === "Bien") {
                      setFormData({ ...formData, type: val });
                    }
                  }}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Service">Service (Prestation intellectuelle, etc.)</SelectItem>
                    <SelectItem value="Bien">Bien (Produit physique ou matériel)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
