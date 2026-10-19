import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type InvoiceItemInsert = Database["public"]["Tables"]["invoice_items"]["Insert"];

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export async function getInvoices(): Promise<InvoiceWithItems[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  return (invoices || []).map((inv: any) => ({
    ...inv,
    items: inv.invoice_items || [],
  }));
}

export async function getInvoiceById(id: string): Promise<InvoiceWithItems | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    items: (data as any).invoice_items || [],
  };
}

export async function createInvoiceRecord(
  invoice: Omit<InvoiceInsert, "user_id">,
  items: Omit<InvoiceItemInsert, "invoice_id" | "id" | "created_at">[]
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  // 1. Insert invoice
  const { data: newInvoice, error: invError } = await supabase
    .from("invoices")
    .insert({
      ...invoice,
      user_id: user.id,
    })
    .select()
    .single();

  if (invError || !newInvoice) throw invError;

  // 2. Insert items
  if (items.length > 0) {
    const itemsToInsert = items.map((it) => ({
      ...it,
      invoice_id: newInvoice.id,
    }));

    const { error: itemsError } = await supabase
      .from("invoice_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error inserting invoice items:", itemsError);
    }
  }

  return newInvoice;
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInvoiceRecord(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw error;
}

export async function getDashboardStats() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalRevenue: 0,
      pendingRevenue: 0,
      overdueRevenue: 0,
      totalInvoices: 0,
      activeClientsCount: 0,
      recentInvoices: [],
    };
  }

  // Invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("*, invoice_items(*)")
    .order("created_at", { ascending: false });

  // Clients
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "Actif");

  const allInvoices = invoices || [];
  let totalRevenue = 0;
  let pendingRevenue = 0;
  let overdueRevenue = 0;

  for (const inv of allInvoices) {
    const amt = Number(inv.total_amount) || 0;
    if (inv.status === "Payée") {
      totalRevenue += amt;
    } else if (inv.status === "En attente") {
      pendingRevenue += amt;
    } else if (inv.status === "En retard") {
      overdueRevenue += amt;
    }
  }

  return {
    totalRevenue,
    pendingRevenue,
    overdueRevenue,
    totalInvoices: allInvoices.length,
    activeClientsCount: clientsCount || 0,
    recentInvoices: allInvoices.slice(0, 5).map((inv: any) => ({
      ...inv,
      items: inv.invoice_items || [],
    })),
  };
}
