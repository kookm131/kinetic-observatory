import { cn } from '@/src/lib/utils';
import * as Icons from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  icon?: string;
  color?: string;
  className?: string;
}

export function StatsCard({ label, value, subValue, trend, icon, color = 'primary', className }: StatsCardProps) {
  const Icon = (Icons as any)[icon || 'Hexagon'];
  
  return (
    <div className={cn("glass-panel p-6 rounded-xl border border-white/5 kinetic-glow group transition-all duration-300 hover:border-white/10", className)}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">{label}</span>
        {icon && <Icon size={18} className={`text-${color}`} />}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-headline font-black text-zinc-100")}>{value}</span>
        {subValue && <span className="text-xs text-zinc-500">{subValue}</span>}
      </div>

      {trend && (
        <div className="flex items-center gap-2 mt-3">
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded",
            trend.isUp ? "text-secondary bg-secondary/10" : "text-error bg-error/10"
          )}>
            {trend.isUp ? <Icons.TrendingUp size={12} /> : <Icons.TrendingDown size={12} />}
            {trend.value}
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">이전 기간 대비</span>
        </div>
      )}
    </div>
  );
}
