import React from "react";

interface Sender {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  country: string;
}

interface Client {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  country: string;
}

interface LineItem {
  id: string | number;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface PreviewInvoiceProps {
  sender: Sender;
  client: Client;
  lineItems: LineItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  logoUrl: string | null;
  invoiceNumber: string;
  date: string;
  themeColor?: string;
  currency?: string;
  templateId?: number;
}

export function PreviewInvoice(props: PreviewInvoiceProps) {
  const { themeColor = "#8b5cf6", templateId = 1, currency = "€" } = props;

  return (
    <div
      className="bg-[#ffffff] mx-auto relative overflow-hidden text-[#1e293b]"
      style={{ 
        width: "210mm", 
        minHeight: "250mm", 
        printColorAdjust: "exact", 
        WebkitPrintColorAdjust: "exact" 
      }}
      id="invoice-preview"
    >
      {templateId === 1 && <Template1 {...props} themeColor={themeColor} />}
      {templateId === 2 && <Template2 {...props} themeColor={themeColor} />}
      {templateId === 3 && <Template3 {...props} themeColor={themeColor} />}
      {templateId === 4 && <Template4 {...props} themeColor={themeColor} />}
      {templateId === 5 && <Template5 {...props} themeColor={themeColor} />}
      {templateId === 6 && <Template6 {...props} themeColor={themeColor} />}
      {templateId === 7 && <Template7 {...props} themeColor={themeColor} />}
      {templateId === 8 && <Template8 {...props} themeColor={themeColor} />}
      {templateId === 9 && <Template9 {...props} themeColor={themeColor} />}
      {templateId === 10 && <Template10 {...props} themeColor={themeColor} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers

const getDynamicSpacing = (itemsCount: number) => {
  if (itemsCount >= 10) return { rowPad: "py-1", mbSection: "mb-2", containerPad: "p-4" };
  if (itemsCount >= 7) return { rowPad: "py-1", mbSection: "mb-4", containerPad: "p-6" };
  if (itemsCount >= 4) return { rowPad: "py-2", mbSection: "mb-6", containerPad: "p-8" };
  return { rowPad: "py-3", mbSection: "mb-8", containerPad: "p-10" };
};

// ---------------------------------------------------------------------------
const Logo = ({ url, className = "" }: { url: string | null, className?: string }) => {
  if (url) return <img src={url} alt="Logo" className={`max-h-24 object-contain ${className}`} />;
  return <div className={`h-24 w-48 bg-[#f1f5f9] border-2 border-dashed border-[#cbd5e1] flex items-center justify-center text-[#94a3b8] rounded-xl ${className}`}>Pas de logo</div>;
};

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// ---------------------------------------------------------------------------
// Modèle 1: Classique
// ---------------------------------------------------------------------------
function Template1({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);
  return (
    <div className={`\${containerPad}`}>
      <div className={`flex justify-between items-start ${mbSection}`}>
        <Logo url={logoUrl} />
        <div className="text-right">
          <h1 className="text-4xl font-bold mb-2" style={{ color: themeColor }}>FACTURE</h1>
          <p className="text-[#64748b] font-medium">N° {invoiceNumber}</p>
          <p className="text-[#64748b]">Date: {date}</p>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-12 ${mbSection}`}>
        <div className="bg-[#f8fafc] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#64748b] uppercase tracking-wider mb-4">Émetteur</h3>
          <div className="space-y-1">
            <p className="font-bold text-lg">{sender.name}</p>
            <p className="whitespace-pre-line">{sender.address1}</p>
            <p>{sender.address2}</p>
            <p>{sender.country}</p>
            <p>{sender.email}</p>
            <p>{sender.phone}</p>
          </div>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: hexToRgba(themeColor, 0.05) }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: themeColor }}>Client</h3>
          <div className="space-y-1">
            <p className="font-bold text-lg">{client.name}</p>
            <p className="whitespace-pre-line">{client.address1}</p>
            <p>{client.address2}</p>
            <p>{client.country}</p>
            <p>{client.email}</p>
            <p>{client.phone}</p>
          </div>
        </div>
      </div>

      <div className={`${mbSection}`}>
        <table className="w-full text-left border-collapse">
          <thead className="table-header-group">
            <tr className="border-b-2 break-inside-avoid" style={{ borderColor: themeColor }}>
              <th className={`${rowPad} px-4 font-semibold text-[#475569] uppercase text-xs tracking-wider`}>Description</th>
              <th className={`${rowPad} px-4 font-semibold text-[#475569] uppercase text-xs tracking-wider text-center`}>Qté</th>
              <th className={`${rowPad} px-4 font-semibold text-[#475569] uppercase text-xs tracking-wider text-right`}>Prix Unitaire</th>
              <th className={`${rowPad} px-4 font-semibold text-[#475569] uppercase text-xs tracking-wider text-right`}>Montant HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {lineItems.map((item, i) => (
              <tr key={i} className="group hover:bg-[#f8fafc] transition-colors break-inside-avoid">
                <td className={`${rowPad} px-4 font-medium`}>{item.description}</td>
                <td className={`${rowPad} px-4 text-center text-[#475569]`}>{item.quantity}</td>
                <td className={`${rowPad} px-4 text-right text-[#475569]`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} px-4 text-right font-medium`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`flex justify-end ${mbSection}`}>
        <div className="w-80 space-y-4">
          <div className="flex justify-between items-center text-[#475569]"><span>Total HT</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between items-center text-[#475569]"><span>Total TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className="h-px w-full bg-[#e2e8f0]"></div>
          <div className="flex justify-between items-center text-xl font-bold" style={{ color: themeColor }}><span>Total TTC</span><span>{total.toFixed(2)} {currency}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 2: Moderne (Entête colorée pleine largeur)
// ---------------------------------------------------------------------------
function Template2({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div>
      <div className={`\${containerPad} flex justify-between items-center text-white`} style={{ backgroundColor: themeColor }}>
        <div>
           {logoUrl ? <img src={logoUrl} alt="Logo" className="max-h-20 object-contain bg-white p-2 rounded-xl" /> : <div className="h-20 w-40 bg-white/20 border-2 border-dashed border-white/40 flex items-center justify-center rounded-xl">Logo</div>}
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-bold tracking-widest mb-2">FACTURE</h1>
          <p className="text-white/80 text-lg">N° {invoiceNumber} • {date}</p>
        </div>
      </div>
      
      <div className={`\${containerPad}`}>
        <div className={`grid grid-cols-2 gap-12 ${mbSection}`}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#94a3b8]">De :</h3>
            <p className="font-bold text-lg">{sender.name}</p>
            <p className="whitespace-pre-line">{sender.address1}</p>
            <p>{sender.address2}</p>
            <p>{sender.country}</p>
            <p>{sender.email}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#94a3b8]">Facturé à :</h3>
            <p className="font-bold text-lg">{client.name}</p>
            <p className="whitespace-pre-line">{client.address1}</p>
            <p>{client.address2}</p>
            <p>{client.country}</p>
            <p>{client.email}</p>
          </div>
        </div>

        <div className={`${mbSection}`}>
          <table className="w-full text-left border-collapse">
            <thead className="table-header-group text-white" style={{ backgroundColor: themeColor }}>
              <tr className="break-inside-avoid">
                <th className={`${rowPad} px-4 font-medium text-sm rounded-l-lg`}>Article</th>
                <th className={`${rowPad} px-4 font-medium text-sm text-center`}>Qté</th>
                <th className={`${rowPad} px-4 font-medium text-sm text-right`}>Prix Unitaire</th>
                <th className={`${rowPad} px-4 font-medium text-sm text-right rounded-r-lg`}>Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {lineItems.map((item, i) => (
                <tr key={i} className="break-inside-avoid">
                  <td className={`${rowPad} px-4 font-medium`}>{item.description}</td>
                  <td className={`${rowPad} px-4 text-center`}>{item.quantity}</td>
                  <td className={`${rowPad} px-4 text-right`}>{item.unitPrice.toFixed(2)} {currency}</td>
                  <td className={`${rowPad} px-4 text-right font-semibold`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-72 bg-[#f8fafc] rounded-xl p-6 space-y-3 border border-[#e2e8f0]">
            <div className="flex justify-between items-center text-sm"><span>Total HT</span><span>{subtotal.toFixed(2)} {currency}</span></div>
            <div className="flex justify-between items-center text-sm"><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
            <div className="h-px w-full bg-[#cbd5e1]"></div>
            <div className="flex justify-between items-center text-xl font-bold" style={{ color: themeColor }}><span>TTC</span><span>{total.toFixed(2)} {currency}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 3: Minimaliste
// ---------------------------------------------------------------------------
function Template3({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} flex flex-col items-center text-center`}>
      <Logo url={logoUrl} className="mb-8" />
      <h1 className="text-2xl font-light tracking-widest mb-1">FACTURE</h1>
      <p className={`text-sm text-[#94a3b8] ${mbSection}`}>{invoiceNumber} — {date}</p>

      <div className={`w-full flex justify-between text-left ${mbSection} px-12`}>
        <div className="w-1/2">
          <p className="text-xs text-[#94a3b8] uppercase tracking-widest mb-2">Émetteur</p>
          <p className="font-medium text-lg">{sender.name}</p>
          <p className="text-sm">{sender.address1}</p>
        </div>
        <div className="w-1/2 text-right">
          <p className="text-xs text-[#94a3b8] uppercase tracking-widest mb-2">Destinataire</p>
          <p className="font-medium text-lg" style={{ color: themeColor }}>{client.name}</p>
          <p className="text-sm">{client.address1}</p>
        </div>
      </div>

      <div className={`w-full ${mbSection}`}>
        <table className="w-full text-sm">
          <thead className="table-header-group">
            <tr className="border-y border-[#e2e8f0] break-inside-avoid">
              <th className={`${rowPad} text-left font-normal text-[#94a3b8]`}>Description</th>
              <th className={`${rowPad} text-center font-normal text-[#94a3b8]`}>Quantité</th>
              <th className={`${rowPad} text-right font-normal text-[#94a3b8]`}>Prix</th>
              <th className={`${rowPad} text-right font-normal text-[#94a3b8]`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b border-[#f1f5f9] break-inside-avoid">
                <td className={`${rowPad} text-left`}>{item.description}</td>
                <td className={`${rowPad} text-center`}>{item.quantity}</td>
                <td className={`${rowPad} text-right`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} text-right font-medium`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-end">
        <div className="w-1/3 space-y-2 text-sm text-right">
          <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between"><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-[#e2e8f0] mt-2">
            <span>Total</span><span style={{ color: themeColor }}>{total.toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 4: Bold (Gras)
// ---------------------------------------------------------------------------
function Template4({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} min-h-[250mm] flex flex-col border-[16px]`} style={{ borderColor: themeColor }}>
      <div className="flex justify-between items-end border-b-8 pb-8 mb-8" style={{ borderColor: themeColor }}>
        <Logo url={logoUrl} className="max-h-28" />
        <div className="text-right">
          <h1 className="text-6xl font-black uppercase mb-2 text-[#0f172a]">Facture</h1>
          <p className="text-2xl font-bold" style={{ color: themeColor }}>#{invoiceNumber}</p>
        </div>
      </div>

      <div className={`flex gap-8 ${mbSection}`}>
        <div className="w-1/2 p-6 text-white" style={{ backgroundColor: themeColor }}>
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">Facturé par</h3>
          <p className="font-black text-2xl mb-1">{sender.name}</p>
          <p className="font-medium text-lg opacity-90">{sender.address1}</p>
        </div>
        <div className="w-1/2 p-6 bg-[#f1f5f9] border-4 border-[#0f172a]">
          <h3 className="text-sm font-black uppercase tracking-widest mb-2 text-[#64748b]">Facturé à</h3>
          <p className="font-black text-2xl mb-1 text-[#0f172a]">{client.name}</p>
          <p className="font-medium text-lg text-[#334155]">{client.address1}</p>
        </div>
      </div>

      <div className={`${mbSection}`}>
        <table className="w-full text-left border-collapse border-4 border-[#0f172a]">
          <thead className="table-header-group bg-[#0f172a] text-white">
            <tr className="break-inside-avoid">
              <th className={`${rowPad} px-4 font-black uppercase tracking-wider border-r-2 border-[#334155]`}>Description</th>
              <th className={`${rowPad} px-4 font-black uppercase tracking-wider text-center border-r-2 border-[#334155]`}>Qté</th>
              <th className={`${rowPad} px-4 font-black uppercase tracking-wider text-right border-r-2 border-[#334155]`}>Prix</th>
              <th className={`${rowPad} px-4 font-black uppercase tracking-wider text-right`}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b-4 border-[#0f172a] break-inside-avoid bg-white">
                <td className={`${rowPad} px-4 font-bold border-r-4 border-[#0f172a]`}>{item.description}</td>
                <td className={`${rowPad} px-4 font-bold text-center border-r-4 border-[#0f172a]`}>{item.quantity}</td>
                <td className={`${rowPad} px-4 font-bold text-right border-r-4 border-[#0f172a]`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} px-4 font-black text-right text-lg`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-auto">
        <div className="w-96">
          <div className={`flex justify-between items-center ${rowPad} font-bold text-lg border-b-4 border-[#0f172a]`}><span>Sous-total</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className={`flex justify-between items-center ${rowPad} font-bold text-lg border-b-4 border-[#0f172a]`}><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className={`flex justify-between items-center ${rowPad} font-black text-3xl mt-4`} style={{ color: themeColor }}><span>TOTAL</span><span>{total.toFixed(2)} {currency}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 5: Élégant (Serif)
// ---------------------------------------------------------------------------
function Template5({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} border-[1px] m-4 border-[#cbd5e1] font-serif min-h-[250mm]`}>
      <div className={`flex flex-col items-center ${mbSection}`}>
        <Logo url={logoUrl} className="mb-8 max-h-20" />
        <h1 className="text-3xl tracking-[0.2em] mb-4 text-[#334155]">FACTURE</h1>
        <div className="h-[1px] w-12 mb-4" style={{ backgroundColor: themeColor }}></div>
        <p className="text-sm italic text-[#64748b]">Numéro {invoiceNumber} — Le {date}</p>
      </div>

      <div className={`flex justify-between ${mbSection} text-sm`}>
        <div className="w-5/12">
          <p className="uppercase tracking-widest text-xs mb-4 text-[#94a3b8]">De la part de</p>
          <p className="text-lg font-semibold mb-2">{sender.name}</p>
          <p className="leading-relaxed">{sender.address1}<br/>{sender.email}<br/>{sender.phone}</p>
        </div>
        <div className="w-5/12 text-right">
          <p className="uppercase tracking-widest text-xs mb-4 text-[#94a3b8]">À l'attention de</p>
          <p className="text-lg font-semibold mb-2" style={{ color: themeColor }}>{client.name}</p>
          <p className="leading-relaxed">{client.address1}<br/>{client.email}<br/>{client.phone}</p>
        </div>
      </div>

      <div className={`${mbSection}`}>
        <table className="w-full text-left">
          <thead className="table-header-group border-b border-[#cbd5e1]">
            <tr className="break-inside-avoid">
              <th className={`${rowPad} font-normal italic text-[#64748b]`}>Désignation</th>
              <th className={`${rowPad} font-normal italic text-center text-[#64748b]`}>Quantité</th>
              <th className={`${rowPad} font-normal italic text-right text-[#64748b]`}>Prix U.</th>
              <th className={`${rowPad} font-normal italic text-right text-[#64748b]`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b border-dashed border-[#e2e8f0] break-inside-avoid">
                <td className={`${rowPad} pr-4`}>{item.description}</td>
                <td className={`${rowPad} px-4 text-center`}>{item.quantity}</td>
                <td className={`${rowPad} px-4 text-right`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} pl-4 text-right`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className={`flex justify-between ${rowPad} border-b border-[#e2e8f0]`}><span>Total HT</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className={`flex justify-between ${rowPad} border-b border-[#e2e8f0]`}><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className={`flex justify-between ${rowPad} text-2xl mt-4`}>
            <span className="italic">Total TTC</span><span className="font-semibold" style={{ color: themeColor }}>{total.toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 6: Sidebar
// ---------------------------------------------------------------------------
function Template6({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className="flex min-h-[250mm]">
      <div className={`w-1/3 ${containerPad} text-white`} style={{ backgroundColor: themeColor }}>
        <Logo url={logoUrl} className={`${mbSection} bg-white/10 p-4 rounded-xl`} />
        <div className={`${mbSection}`}>
          <h1 className="text-3xl font-bold tracking-wider mb-2">FACTURE</h1>
          <p className="opacity-80">N° {invoiceNumber}</p>
          <p className="opacity-80">{date}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 opacity-70">Infos Émetteur</h3>
          <p className="font-bold text-lg mb-2">{sender.name}</p>
          <p className="opacity-90 leading-relaxed whitespace-pre-line mb-4">{sender.address1}</p>
          <p className="opacity-90">{sender.email}</p>
          <p className="opacity-90">{sender.phone}</p>
        </div>
      </div>

      <div className={`w-2/3 ${containerPad} bg-white flex flex-col`}>
        <div className={`${mbSection} self-end text-right`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#94a3b8]">Facturé à</h3>
          <p className="font-bold text-2xl mb-2 text-[#0f172a]">{client.name}</p>
          <p className="text-[#475569] leading-relaxed whitespace-pre-line mb-2">{client.address1}</p>
          <p className="text-[#475569]">{client.email}</p>
        </div>

        <div className={`${mbSection} flex-grow`}>
          <table className="w-full text-left">
            <thead className="table-header-group border-b-2" style={{ borderColor: themeColor }}>
              <tr className="break-inside-avoid">
                <th className={`${rowPad} text-sm font-bold uppercase tracking-wider`}>Article</th>
                <th className={`${rowPad} text-sm font-bold uppercase tracking-wider text-center`}>Qté</th>
                <th className={`${rowPad} text-sm font-bold uppercase tracking-wider text-right`}>Prix</th>
                <th className={`${rowPad} text-sm font-bold uppercase tracking-wider text-right`}>Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i} className="border-b border-[#f1f5f9] break-inside-avoid">
                  <td className={`${rowPad} font-medium`}>{item.description}</td>
                  <td className={`${rowPad} text-center text-[#64748b]`}>{item.quantity}</td>
                  <td className={`${rowPad} text-right text-[#64748b]`}>{item.unitPrice.toFixed(2)} {currency}</td>
                  <td className={`${rowPad} text-right font-bold`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#f8fafc] p-6 rounded-2xl ml-auto w-full max-w-sm">
          <div className="flex justify-between items-center mb-2 text-[#64748b]"><span>Total HT</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between items-center mb-4 text-[#64748b]"><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between items-center text-2xl font-bold pt-4 border-t border-[#e2e8f0]" style={{ color: themeColor }}>
            <span>Total TTC</span><span>{total.toFixed(2)} {currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 7: Corporate (Strict Grid)
// ---------------------------------------------------------------------------
function Template7({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} font-sans`}>
      <div className="flex justify-between items-start mb-8 pb-8 border-b-4" style={{ borderColor: themeColor }}>
        <div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight text-[#0f172a] mb-1">FACTURE</h1>
          <p className="text-lg font-medium text-[#64748b]">{invoiceNumber} | {date}</p>
        </div>
        <Logo url={logoUrl} className="max-h-16" />
      </div>

      <div className="flex gap-4 mb-8">
        <div className="w-1/2 p-5 bg-[#f1f5f9] border border-[#cbd5e1]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-3">Prestataire / Vendeur</p>
          <p className="font-bold text-lg text-[#0f172a]">{sender.name}</p>
          <p className="mt-1 text-sm">{sender.address1}</p>
          <p className="mt-2 text-sm">✉️ {sender.email}</p>
          <p className="text-sm">📞 {sender.phone}</p>
        </div>
        <div className="w-1/2 p-5 border-2" style={{ borderColor: hexToRgba(themeColor, 0.3), backgroundColor: hexToRgba(themeColor, 0.02) }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: themeColor }}>Client / Acheteur</p>
          <p className="font-bold text-lg text-[#0f172a]">{client.name}</p>
          <p className="mt-1 text-sm">{client.address1}</p>
          <p className="mt-2 text-sm">✉️ {client.email}</p>
          <p className="text-sm">📞 {client.phone}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full text-left border-collapse border border-[#cbd5e1]">
          <thead className="table-header-group bg-[#f8fafc]">
            <tr className="break-inside-avoid">
              <th className={`${rowPad} px-3 border border-[#cbd5e1] text-xs font-bold uppercase`}>Description</th>
              <th className={`${rowPad} px-3 border border-[#cbd5e1] text-xs font-bold uppercase text-center`}>Qté</th>
              <th className={`${rowPad} px-3 border border-[#cbd5e1] text-xs font-bold uppercase text-right`}>PU HT</th>
              <th className={`${rowPad} px-3 border border-[#cbd5e1] text-xs font-bold uppercase text-right`}>Montant HT</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="break-inside-avoid">
                <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm`}>{item.description}</td>
                <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm text-center`}>{item.quantity}</td>
                <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm text-right`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm text-right font-semibold`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <table className="w-1/2 border-collapse border border-[#cbd5e1]">
          <tbody>
            <tr>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm font-bold bg-[#f8fafc]`}>Total HT</td>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm text-right`}>{subtotal.toFixed(2)} {currency}</td>
            </tr>
            <tr>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm font-bold bg-[#f8fafc]`}>TVA</td>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-sm text-right`}>{taxTotal.toFixed(2)} {currency}</td>
            </tr>
            <tr>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-lg font-black text-white`} style={{ backgroundColor: themeColor }}>TOTAL TTC</td>
              <td className={`${rowPad} px-3 border border-[#cbd5e1] text-lg font-black text-right text-white`} style={{ backgroundColor: themeColor }}>{total.toFixed(2)} {currency}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 8: Créatif (Asymétrique)
// ---------------------------------------------------------------------------
function Template8({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className="relative p-12 min-h-[250mm] overflow-hidden bg-[#fafafa]">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-bl-full z-0 opacity-10" style={{ backgroundColor: themeColor }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full z-0 opacity-20" style={{ backgroundColor: themeColor }} />
      
      <div className="relative z-10">
        <div className={`${mbSection}`}>
          <Logo url={logoUrl} className="max-h-24 shadow-xl rounded-2xl bg-white p-2" />
        </div>

        <div className={`flex justify-between items-end ${mbSection}`}>
          <div>
            <h1 className="text-6xl font-black mb-2" style={{ color: themeColor }}>Facture</h1>
            <div className="flex gap-4 text-[#64748b] font-medium">
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">N° {invoiceNumber}</span>
              <span className="bg-white px-3 py-1 rounded-full shadow-sm">{date}</span>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-8 ${mbSection}`}>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#f1f5f9]">
            <p className="text-sm font-bold uppercase tracking-widest text-[#94a3b8] mb-4">Émetteur</p>
            <p className="font-bold text-xl mb-2">{sender.name}</p>
            <p className="text-[#475569]">{sender.address1}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border-2" style={{ borderColor: themeColor }}>
            <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: themeColor }}>Destinataire</p>
            <p className="font-bold text-xl mb-2">{client.name}</p>
            <p className="text-[#475569]">{client.address1}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
          <table className="w-full text-left">
            <thead className="table-header-group text-[#94a3b8]">
              <tr className="break-inside-avoid">
                <th className="pb-4 font-semibold uppercase tracking-wider text-sm">Description</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-sm text-center">Qté</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-sm text-right">Prix</th>
                <th className="pb-4 font-semibold uppercase tracking-wider text-sm text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {lineItems.map((item, i) => (
                <tr key={i} className="break-inside-avoid">
                  <td className={`${rowPad} font-medium text-lg`}>{item.description}</td>
                  <td className={`${rowPad} text-center font-medium text-[#64748b]`}>{item.quantity}</td>
                  <td className={`${rowPad} text-right font-medium text-[#64748b]`}>{item.unitPrice.toFixed(2)} {currency}</td>
                  <td className={`${rowPad} text-right font-bold text-lg`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-80 bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: themeColor }} />
            <div className="flex justify-between text-[#64748b] mb-2"><span>Sous-total</span><span>{subtotal.toFixed(2)} {currency}</span></div>
            <div className="flex justify-between text-[#64748b] mb-6"><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
            <div className="flex justify-between text-2xl font-black" style={{ color: themeColor }}><span>TOTAL</span><span>{total.toFixed(2)} {currency}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 9: Compact (Optimisé pour l'espace)
// ---------------------------------------------------------------------------
function Template9({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} text-sm`}>
      <div className="flex justify-between items-center bg-[#f1f5f9] p-4 rounded-lg mb-6">
        <Logo url={logoUrl} className="max-h-12" />
        <div className="text-right">
          <h1 className="text-2xl font-bold uppercase" style={{ color: themeColor }}>FACTURE #{invoiceNumber}</h1>
          <p className="text-[#64748b]">Date: {date}</p>
        </div>
      </div>

      <div className="flex justify-between gap-4 mb-6">
        <div className="w-1/2">
          <p className="font-bold border-b pb-1 mb-2" style={{ borderColor: themeColor }}>DE: {sender.name}</p>
          <p>{sender.address1}</p>
          <p>{sender.email} | {sender.phone}</p>
        </div>
        <div className="w-1/2">
          <p className="font-bold border-b pb-1 mb-2" style={{ borderColor: themeColor }}>À: {client.name}</p>
          <p>{client.address1}</p>
          <p>{client.email} | {client.phone}</p>
        </div>
      </div>

      <div className="mb-6">
        <table className="w-full text-left border-collapse">
          <thead className="table-header-group text-white" style={{ backgroundColor: themeColor }}>
            <tr className="break-inside-avoid">
              <th className={`${rowPad} px-2 font-medium`}>Description</th>
              <th className={`${rowPad} px-2 font-medium text-center w-16`}>Qté</th>
              <th className={`${rowPad} px-2 font-medium text-right w-24`}>Prix</th>
              <th className={`${rowPad} px-2 font-medium text-right w-24`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => (
              <tr key={i} className="border-b border-[#e2e8f0] break-inside-avoid">
                <td className={`${rowPad} px-2`}>{item.description}</td>
                <td className={`${rowPad} px-2 text-center`}>{item.quantity}</td>
                <td className={`${rowPad} px-2 text-right`}>{item.unitPrice.toFixed(2)} {currency}</td>
                <td className={`${rowPad} px-2 text-right font-bold`}>{(item.quantity * item.unitPrice).toFixed(2)} {currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1 border-b border-[#e2e8f0]"><span>Total HT</span><span>{subtotal.toFixed(2)} {currency}</span></div>
          <div className="flex justify-between py-1 border-b border-[#e2e8f0]"><span>TVA</span><span>{taxTotal.toFixed(2)} {currency}</span></div>
          <div className={`flex justify-between ${rowPad} text-lg font-bold`} style={{ color: themeColor }}><span>Total TTC</span><span>{total.toFixed(2)} {currency}</span></div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modèle 10: Tech (Monospace / Terminal)
// ---------------------------------------------------------------------------
function Template10({ sender, client, lineItems, subtotal, taxTotal, total, logoUrl, invoiceNumber, date, themeColor , currency }: PreviewInvoiceProps & { themeColor: string }) {
  const { rowPad, mbSection, containerPad } = getDynamicSpacing(lineItems.length);

  return (
    <div className={`\${containerPad} bg-[#0f172a] text-[#38bdf8] font-mono min-h-[250mm]`}>
      <div className="border border-[#334155] p-6 mb-8 relative">
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-[#94a3b8]">SYSTEM.INVOICE_GEN</div>
        <div className="flex justify-between items-start">
          <div className="bg-white p-2 inline-block"><Logo url={logoUrl} className="max-h-16 filter grayscale" /></div>
          <div className="text-right">
            <h1 className="text-3xl font-bold tracking-widest text-white mb-2">{">"} INVOICE.exe</h1>
            <p className="text-[#94a3b8]">ID: {invoiceNumber}</p>
            <p className="text-[#94a3b8]">TS: {date}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-8 mb-8">
        <div className="w-1/2 border border-[#334155] p-6 relative">
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-[#94a3b8]">NODE.SENDER</div>
          <p className="text-white font-bold text-lg mb-2">{sender.name}</p>
          <p className="text-[#94a3b8]">{sender.address1}</p>
          <p className="text-[#94a3b8]">{sender.email}</p>
        </div>
        <div className="w-1/2 border border-[#334155] p-6 relative" style={{ borderColor: themeColor }}>
          <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0f172a] px-2 text-xs font-bold" style={{ color: themeColor }}>NODE.CLIENT</div>
          <p className="text-white font-bold text-lg mb-2">{client.name}</p>
          <p className="text-[#94a3b8]">{client.address1}</p>
          <p className="text-[#94a3b8]">{client.email}</p>
        </div>
      </div>

      <div className="border border-[#334155] relative mb-8">
        <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-[#94a3b8]">ARRAY.ITEMS</div>
        <table className="w-full text-left border-collapse mt-4">
          <thead className="table-header-group text-[#94a3b8] border-b border-[#334155]">
            <tr className="break-inside-avoid">
              <th className={`${rowPad} px-4 font-normal`}>{"{ desc }"}</th>
              <th className={`${rowPad} px-4 font-normal text-center`}>{"[ qty ]"}</th>
              <th className={`${rowPad} px-4 font-normal text-right`}>{"< price >"}</th>
              <th className={`${rowPad} px-4 font-normal text-right`}>{"= total ="}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {lineItems.map((item, i) => (
              <tr key={i} className="break-inside-avoid hover:bg-[#1e293b] transition-colors">
                <td className={`${rowPad} px-4 text-white`}>{item.description}</td>
                <td className={`${rowPad} px-4 text-center`}>{item.quantity}</td>
                <td className={`${rowPad} px-4 text-right`}>{item.unitPrice.toFixed(2)}</td>
                <td className={`${rowPad} px-4 text-right`} style={{ color: themeColor }}>{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-80 border border-[#334155] p-6 relative">
           <div className="absolute top-0 left-4 -translate-y-1/2 bg-[#0f172a] px-2 text-xs text-[#94a3b8]">CALC.SUMMARY</div>
           <div className="flex justify-between py-1 text-[#94a3b8]"><span>_SUBTOTAL</span><span>{subtotal.toFixed(2)}</span></div>
           <div className="flex justify-between py-1 text-[#94a3b8] mb-4"><span>_TAX</span><span>{taxTotal.toFixed(2)}</span></div>
           <div className={`flex justify-between ${rowPad} border-t border-[#334155] text-xl text-white font-bold`}>
             <span>$TOTAL</span><span style={{ color: themeColor }}>{total.toFixed(2)}</span>
           </div>
        </div>
      </div>
    </div>
  );
}
