"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Search, MoreHorizontal, Edit, Trash, Mail, Phone, Loader2, Plus, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClients, createClientRecord, updateClientRecord, deleteClientRecord, type ClientWithStats } from "@/lib/services/clients";
import { ClientsSkeleton } from "@/components/skeletons/ClientsSkeleton";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithStats | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    city: "",
    country: "France",
    status: "Actif" as "Actif" | "Inactif",
  });

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const openAddDialog = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address_line1: "",
      city: "",
      country: "France",
      status: "Actif",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: ClientWithStats) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address_line1: client.address_line1 || "",
      city: client.city || "",
      country: client.country || "France",
      status: (client.status as "Actif" | "Inactif") || "Actif",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      if (editingClient) {
        await updateClientRecord(editingClient.id, formData);
      } else {
        await createClientRecord(formData);
      }
      setIsDialogOpen(false);
      await loadClients();
    } catch (error: any) {
      alert("Erreur lors de l'enregistrement: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;
    try {
      await deleteClientRecord(id);
      await loadClients();
    } catch (error: any) {
      alert("Erreur lors de la suppression: " + error.message);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Gérez votre portefeuille de clients synchronisé avec Supabase.</p>
        </div>
        <Button 
          onClick={openAddDialog}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-11 px-6 shadow-md shadow-violet-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Ajouter un client
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="Rechercher par nom, email ou tél..." 
              className="pl-10 rounded-xl bg-slate-50 border-none h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <ClientsSkeleton contentOnly />
        ) : (
          <>
            {/* Vue Mobile */}
            <div className="md:hidden flex flex-col gap-4 mt-2">
              {filteredClients.map((client) => (
                <div key={client.id} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">{client.name}</span>
                    <Badge variant="secondary" className={`${client.status === "Actif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"} border-none font-medium px-2.5 py-0.5`}>
                      {client.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {client.email && (
                      <div className="flex items-center text-slate-500 text-sm">
                        <Mail className="w-3.5 h-3.5 mr-2" />
                        {client.email}
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center text-slate-500 text-sm">
                        <Phone className="w-3.5 h-3.5 mr-2" />
                        {client.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-2">
                    <span className="text-slate-500 text-sm">Total Facturé</span>
                    <span className="font-medium text-slate-900">
                      {client.totalBilled.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                  <div className="pt-2 mt-1 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(client)} 
                      className="flex-1 rounded-xl"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredClients.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium">Aucun client trouvé</p>
                  <p className="text-sm text-slate-400 mt-1">Créez votre premier client pour commencer à facturer.</p>
                </div>
              )}
            </div>

            {/* Vue Desktop */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 bg-slate-50 text-slate-500 font-medium px-4 py-4 rounded-xl mb-2">
                <div>Entreprise / Client</div>
                <div>Contact</div>
                <div>Total Facturé</div>
                <div>Statut</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="space-y-1">
                {filteredClients.map((client) => (
                  <div key={client.id} className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 items-center px-4 py-3 hover:bg-slate-50/50 rounded-xl transition-colors border-b border-slate-50 last:border-0">
                    <div>
                      <div className="font-medium text-slate-900">{client.name}</div>
                      {client.city && <span className="text-xs text-slate-400">{client.city}, {client.country}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-900">{client.email || "-"}</span>
                      <span className="text-xs text-slate-500">{client.phone || "-"}</span>
                    </div>
                    <div className="font-medium text-slate-900">
                      {client.totalBilled.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </div>
                    <div>
                      <Badge variant="secondary" className={`${client.status === "Actif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"} border-none font-medium px-2.5 py-0.5`}>
                        {client.status}
                      </Badge>
                    </div>
                    <div className="text-right flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditDialog(client)}
                        className="text-slate-400 hover:text-violet-600 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(client.id)}
                        className="text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredClients.length === 0 && (
                  <div className="text-center py-16 text-slate-500">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-medium">Aucun client enregistré</p>
                    <p className="text-sm text-slate-400 mt-1">Cliquez sur "+ Ajouter un client" pour commencer.</p>
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
                {editingClient ? "Modifier le client" : "Ajouter un client"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nom de l'entreprise ou client *</Label>
                <Input 
                  id="client-name"
                  placeholder="Ex: Globex Corp"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input 
                    id="client-email"
                    type="email"
                    placeholder="contact@globex.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-phone">Téléphone</Label>
                  <Input 
                    id="client-phone"
                    placeholder="+33 1 23 45 67 89"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-address">Adresse</Label>
                <Input 
                  id="client-address"
                  placeholder="123 Rue de la République"
                  value={formData.address_line1}
                  onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-city">Ville</Label>
                  <Input 
                    id="client-city"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-country">Pays</Label>
                  <Input 
                    id="client-country"
                    placeholder="France"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => {
                    if (val === "Actif" || val === "Inactif") {
                      setFormData({ ...formData, status: val });
                    }
                  }}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Inactif">Inactif</SelectItem>
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
