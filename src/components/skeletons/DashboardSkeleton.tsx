import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton({ withHeader = false }: { withHeader?: boolean } = {}) {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in-50 duration-300">
      {withHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      )}

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
            <Skeleton className="h-2 w-full rounded-none bg-slate-200" />
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-36 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Invoices Table Skeleton */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-52" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-white space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1fr] gap-4 bg-slate-50 px-4 py-3 rounded-xl mb-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <div className="flex justify-end">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1fr] gap-4 items-center px-4 py-3.5 border-b border-slate-50 last:border-0"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
