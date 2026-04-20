import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { Sidebar } from '@/src/components/Sidebar';
import { TopBar } from '@/src/components/TopBar';
import { StatsCard } from '@/src/components/StatsCard';
import { CCUChart } from '@/src/components/CCUChart';
import { BehaviorLog } from '@/src/components/BehaviorLog';
import { PredictionList } from '@/src/components/PredictionList';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('users');
  const [activeTopTab, setActiveTopTab] = useState('realtime');
  const [stats, setStats] = useState({ active_events_10m: 0, system_status: 'initializing' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/stats/realtime');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface-background text-zinc-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 flex flex-col min-h-screen relative">
        <TopBar 
          activeTopTab={activeTopTab} 
          setActiveTopTab={setActiveTopTab} 
          title="유저 행동 분석"
        />

        <div className="p-10 space-y-10 max-w-[1600px] mx-auto w-full">
          {/* Header Actions */}
          <section className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-surface-lowest/50 p-1 rounded-lg flex items-center gap-1 border border-white/5">
                <button className="bg-surface-high text-primary px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">실시간</button>
                <button className="text-zinc-500 px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors">24시간</button>
                <button className="text-zinc-500 px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest hover:text-zinc-300 transition-colors">7일</button>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <button className="flex items-center gap-2 text-zinc-400 bg-surface-lowest/50 px-4 py-2 rounded-lg border border-white/5 hover:bg-surface-high transition-all text-[10px] font-bold uppercase tracking-widest">
                <Icons.Filter size={12} />
                <span>고급 필터</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] text-secondary font-black tracking-widest uppercase">SageMaker Active</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono tracking-tighter">
                초당 <span className="text-zinc-200">1.2M</span> 데이터 처리 중
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-10"
            >
              {/* Top Stats & CCU Row */}
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 glass-panel p-10 rounded-xl kinetic-glow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase mb-2">실시간 동시 접속자 (CCU)</h2>
                        <div className="flex items-baseline gap-4">
                          <span className="text-5xl font-black text-primary font-headline">
                            {stats.active_events_10m.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Icons.TrendingUp size={16} />
                            <span className="text-xs font-bold">+12.4%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="bg-white/5 border border-white/5 px-4 py-1.5 rounded text-[10px] font-bold text-primary uppercase">전체 서버</button>
                        <button className="bg-transparent border border-white/5 px-4 py-1.5 rounded text-[10px] font-bold text-zinc-500 uppercase hover:text-zinc-300">아시아</button>
                      </div>
                    </div>
                    
                    <CCUChart />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  <StatsCard 
                    label="7일 잔류율 (RETENTION)" 
                    value="42.8%" 
                    icon="RotateCcw"
                    color="secondary"
                    trend={{ value: "+2.8% 목표 초과", isUp: true }}
                    className="flex-1"
                  />
                  <StatsCard 
                    label="평균 유저 생애 가치 (LTV)" 
                    value="₩48,200" 
                    icon="Coins"
                    color="tertiary"
                    subValue="(최근 30일)"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Main Analysis Grid */}
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 xl:col-span-4">
                  <PredictionList />
                </div>
                
                <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-8 rounded-xl border border-white/5 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-headline font-bold text-lg text-zinc-100">유저 세그먼트 분포</h3>
                        <Icons.PieChart size={18} className="text-secondary" />
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center py-6">
                        <div className="relative w-40 h-40">
                           <div className="absolute inset-0 rounded-full border-[12px] border-white/5" />
                           <div className="absolute inset-0 rounded-full border-[12px] border-primary border-r-transparent border-b-transparent transform rotate-45" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-black text-zinc-100 font-headline">64%</span>
                              <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">고래 유저</span>
                           </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-8 text-center leading-relaxed">
                          결제 유저 비중이 전주 대비 <span className="text-secondary font-bold">4.2%</span> 증가했습니다.
                        </p>
                      </div>
                    </div>

                    <div className="glass-panel p-8 rounded-xl border border-white/5 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-headline font-bold text-lg text-zinc-100">시스템 안정성</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-secondary font-bold uppercase tracking-widest">24ms (안정)</span>
                          <Icons.Activity size={18} className="text-secondary" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 flex-1 items-stretch py-4">
                         {Array.from({ length: 15 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={cn(
                                "rounded-sm transition-all duration-500",
                                i === 12 ? "bg-tertiary animate-pulse" : "bg-secondary/40 hover:bg-secondary"
                              )} 
                            />
                         ))}
                      </div>
                      
                      <p className="text-[10px] text-zinc-500 mt-6 leading-relaxed bg-surface-lowest p-3 rounded-lg border border-white/5 font-mono">
                        [LOG] 아시아 동부 리전에서 일시적인 트래픽 급증 감지. 자동 스케일링 프로토콜 실행 중...
                      </p>
                    </div>
                  </div>

                  <BehaviorLog />
                </div>
              </div>

              {/* Advanced Segment Analytics Footer */}
              <section className="glass-panel p-10 rounded-xl border border-white/5">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h3 className="font-headline font-bold text-2xl text-zinc-100 italic">자동 분류 세그먼트 현황</h3>
                    <p className="text-sm text-zinc-500 mt-2">SageMaker 클러스터링 기반 실시간 그룹핑 및 행동 분석</p>
                  </div>
                  <button className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-[0.2em] border-b border-primary/30 pb-1 hover:border-primary transition-all">
                    전체 원시 데이터 내보내기 (CSV)
                    <Icons.Download size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: '고래 유저 (VVIP)', value: '1,240', pct: 8, color: 'primary', icon: 'Diamond' },
                    { label: '일일 활성 유저 (DAU)', value: '18,520', pct: 42, color: 'secondary', icon: 'Zap' },
                    { label: '휴면 복귀 예정', value: '4,210', pct: 15, color: 'tertiary', icon: 'History' },
                    { label: '이탈 위험군', value: '2,880', pct: 10, color: 'error', icon: 'HeartOff' },
                  ].map((s) => {
                    const Icon = (Icons as any)[s.icon];
                    return (
                      <div key={s.label} className="bg-surface-lowest/50 p-6 rounded-xl border border-white/5 group transition-all duration-300 hover:border-white/10 hover:shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                           <span className={cn("text-[10px] font-black tracking-widest uppercase", `text-${s.color}`)}>{s.label}</span>
                           <Icon size={14} className={`text-${s.color}`} />
                        </div>
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-3xl font-headline font-black text-zinc-100">{s.value}</span>
                          <span className="text-[10px] text-zinc-600 font-mono">명</span>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                              <span>세그먼트 비중</span>
                              <span>{s.pct}%</span>
                           </div>
                           <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.pct}%` }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className={cn("h-full", `bg-${s.color}`)} 
                              />
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          </AnimatePresence>

          <footer className="pt-10 pb-16 flex flex-wrap justify-between items-center gap-6 text-[10px] text-zinc-600 border-t border-white/5">
            <div className="flex gap-8 font-mono tracking-wider uppercase">
              <span>최종 업데이트: {new Date().toLocaleString('ko-KR')}</span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                분석 엔진 v4.2.0-STABLE
              </span>
            </div>
            <div className="flex gap-6 uppercase tracking-widest font-bold">
              <a href="#" className="hover:text-zinc-300 transition-colors">개인정보 처리방침</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">이용 약관</a>
              <span className="text-zinc-700">© 2026 Kinetic Observatory Analytics</span>
            </div>
          </footer>
        </div>

        {/* Floating Accent Backgrounds */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] pointer-events-none -z-10 rounded-full" />
        <div className="fixed bottom-0 left-72 w-[600px] h-[600px] bg-secondary/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      </main>
    </div>
  );
}
