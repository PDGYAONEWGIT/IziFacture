import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InvoiceNewSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12 animate-in fade-in-50 duration-300">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="space-y-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>

          {/* Numbers & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white p-6 rounded-3xl shadow-sm">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>

          {/* Logo Skeleton */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">
            <Skeleton className="h-4 w-48 mb-3" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>

          {/* Bill From / To Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-none shadow-sm bg-white p-6 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
            </Card>

            <Card className="rounded-2xl border-none shadow-sm bg-white p-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-full rounded-xl" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </Card>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-80 shrink-0">
          <Card className="rounded-3xl border-none shadow-sm bg-white p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="w-8 h-8 rounded-full" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-xl mt-3" />
            </div>
          </Card>
        </div>
      </div>

      {/* Line items skeleton */}
      <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}
