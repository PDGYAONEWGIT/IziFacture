import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-500/25 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <div className="flex gap-[3px] items-end h-[20px]">
              <div className="w-[4px] h-[11px] bg-white/70 rounded-full" />
              <div className="w-[4px] h-[20px] bg-white rounded-full" />
              <div className="w-[4px] h-[15px] bg-white/50 rounded-full" />
            </div>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">IziFacture</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
