import { cn } from '@/src/lib/utils';
import { NAV_ITEMS } from '@/src/constants';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 flex flex-col bg-surface-lowest/80 backdrop-blur-xl border-r border-white/5 z-50">
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tight text-primary uppercase font-headline">
          Kinetic Observatory
        </h1>
        <p className="text-[10px] text-zinc-500 mt-1 font-mono tracking-widest uppercase">
          실시간 게임 분석 시스템
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const Icon = (Icons as any)[item.icon];
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group relative",
                isActive 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-zinc-500 hover:text-zinc-100 hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute right-0 top-3 bottom-3 w-1 bg-primary rounded-full"
                />
              )}
              <Icon size={20} className={cn(isActive && "text-primary")} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 bg-surface-lowest/50 border-t border-white/5">
        <button className="w-full kinetic-gradient text-on-primary font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98] text-sm">
          새 보고서 생성
        </button>
      </div>

      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-100 rounded-lg text-sm transition-colors">
          <Icons.Settings size={18} />
          <span>설정</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-zinc-100 rounded-lg text-sm transition-colors">
          <Icons.HelpCircle size={18} />
          <span>고객 지원</span>
        </button>
      </div>

      <div className="p-6 pt-4 border-t border-white/5 bg-surface-lowest/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-primary/20 p-0.5">
             <img 
              src="https://picsum.photos/seed/techlead/100/100" 
              alt="Avatar" 
              className="rounded-full w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-100">운영 관리자</span>
            <span className="text-[10px] text-zinc-500 font-mono">마스터 레벨</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
