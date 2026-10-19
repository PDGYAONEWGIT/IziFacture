import { Skeleton } from "@/components/ui/skeleton";

export function ProductsTableSkeleton() {
  return (
    <>
      {/* Mobile Cards Skeleton */}
      <div className="md:hidden flex flex-col gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1 flex flex-col items-end">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] gap-4 bg-slate-50 px-4 py-3.5 rounded-xl mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <div className="text-right flex justify-end">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="text-right flex justify-end">
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="text-right flex justify-end">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_3fr_1fr_1fr_1fr_1fr] gap-4 items-center px-4 py-3.5 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="text-right flex justify-end">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="text-right flex justify-end">
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="text-right flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ProductsSkeleton({ contentOnly = false }: { contentOnly?: boolean } = {}) {
  if (contentOnly) {
    return <ProductsTableSkeleton />;
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
        {/* Search & Filter Bar Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Skeleton className="h-11 w-full md:w-96 rounded-xl" />
          <Skeleton className="h-11 w-52 rounded-xl" />
        </div>

        <ProductsTableSkeleton />
      </div>
    </div>
  );
}
