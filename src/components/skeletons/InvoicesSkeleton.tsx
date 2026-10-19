import { Skeleton } from "@/components/ui/skeleton";

export function InvoicesTableSkeleton() {
  return (
    <>
      {/* Mobile Cards Skeleton */}
      <div className="md:hidden flex flex-col gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 bg-slate-50 px-4 py-3.5 rounded-xl mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <div className="flex justify-end">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[1.5fr_2fr_1.2fr_1.2fr_1fr_1.2fr] gap-4 items-center px-4 py-3.5 border-b border-slate-50 last:border-0"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-14 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function InvoicesSkeleton({ contentOnly = false }: { contentOnly?: boolean } = {}) {
  if (contentOnly) {
    return <InvoicesTableSkeleton />;
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-in fade-in-50 duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border-none p-6">
        {/* Search & Filters Bar Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-11 w-72 rounded-xl" />
          </div>
        </div>

        <InvoicesTableSkeleton />
      </div>
    </div>
  );
}
