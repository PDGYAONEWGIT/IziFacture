import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <Card className="w-full bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl rounded-2xl p-4 animate-in fade-in-50 duration-300">
      <CardHeader className="space-y-3 text-center flex flex-col items-center">
        <Skeleton className="h-7 w-48 bg-slate-800" />
        <Skeleton className="h-4 w-64 bg-slate-800/60" />
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24 bg-slate-800/80" />
          <Skeleton className="h-11 w-full rounded-xl bg-slate-800" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 bg-slate-800/80" />
          <Skeleton className="h-11 w-full rounded-xl bg-slate-800" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl bg-violet-900/50" />
        <div className="flex justify-center pt-2">
          <Skeleton className="h-4 w-40 bg-slate-800/60" />
        </div>
      </CardContent>
    </Card>
  );
}
