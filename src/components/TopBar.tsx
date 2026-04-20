import { cn } from '@/src/lib/utils';
import { TOP_NAV_TABS } from '@/src/constants';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';

interface TopBarProps {
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
  title: string;
}

export function TopBar({ activeTopTab, setActiveTopTab, title }: TopBarProps) {
  return (
    <header className="flex justify-between items-center px-10 w-full h-16 sticky top-0 z-40 bg-surface-background/40 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-12">
        <span className="text-xl font-bold text-zinc-100 font-headline">{title}</span>
        <nav className="flex gap-8">
          {TOP_NAV_TABS.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={cn(
                  "relative py-1 text-sm transition-colors duration-300",
                  isActive ? "text-primary font-semibold" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="top-nav-accent"
                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="플레이어 검색..." 
            className="bg-surface-lowest/50 border border-white/5 text-zinc-100 rounded-full py-1.5 px-4 pl-10 focus:ring-1 focus:ring-primary w-64 transition-all duration-300 text-xs outline-none"
          />
          <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative text-zinc-500 hover:text-primary transition-colors">
            <Icons.Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
          </button>
          <button className="text-zinc-500 hover:text-primary transition-colors">
            <Icons.HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
