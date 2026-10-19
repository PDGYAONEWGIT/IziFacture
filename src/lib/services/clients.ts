import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

export type ClientWithStats = Client & {
  totalBilled: number;
  invoicesCount: number;
};

export async function getClients(): Promise<ClientWithStats[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Fetch clients
  const { data: clients, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (clientsError || !clients) {
    console.error("Error fetching clients:", clientsError);
    return [];
  }

  // Fetch invoices to compute total billed per client
  const { data: invoices } = await supabase
    .from("invoices")
    .select("client_id, total_amount, status");

  const statsMap = new Map<string, { totalBilled: number; count: number }>();
  if (invoices) {
    for (const inv of invoices) {
      if (inv.client_id) {
        const current = statsMap.get(inv.client_id) || { totalBilled: 0, count: 0 };
        current.totalBilled += Number(inv.total_amount) || 0;
        current.count += 1;
        statsMap.set(inv.client_id, current);
      }
    }
  }

  return clients.map((c) => ({
    ...c,
    totalBilled: statsMap.get(c.id)?.totalBilled || 0,
    invoicesCount: statsMap.get(c.id)?.count || 0,
  }));
}

export async function createClientRecord(client: Omit<ClientInsert, "user_id">) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("clients")
    .insert({
      ...client,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientRecord(id: string, updates: ClientUpdate) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClientRecord(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}
