import { cn } from '@/src/lib/utils';
import * as Icons from 'lucide-react';

const LOG_EVENTS = [
  {
    id: 1,
    title: '인앱 결제 완료 (Premium Pack)',
    user: 'Player_7721',
    time: '방금 전',
    description: "'전설 장비 패키지'를 구매했습니다. 이전 결제 이후 4일만의 재구매입니다.",
    icon: 'ShoppingCart',
    color: 'primary',
    tag: '고가치 유저 세그먼트 자동 배정',
    tagIcon: 'Sparkles',
  },
  {
    id: 2,
    title: 'PvP 매칭 실패 후 이탈',
    user: 'Shadow_Hunter',
    time: '2분 전',
    description: '3회 연속 매칭 취소 후 앱을 종료했습니다. 대기 시간 45초 초과.',
    icon: 'AlertCircle',
    color: 'tertiary',
    tag: '매칭 밸런싱 최적화 필요 그룹',
    tagIcon: 'Activity',
  },
  {
    id: 3,
    title: '신규 유저 튜토리얼 완료',
    user: 'Newbie_01',
    time: '5분 전',
    description: '스테이지 1-5를 클리어하고 기본 튜토리얼을 100% 완료했습니다.',
    icon: 'UserPlus',
    color: 'secondary',
    tag: '활성 정착 유저 세그먼트',
    tagIcon: 'Users',
  },
];

export function BehaviorLog() {
  return (
    <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
      <div className="p-6 flex justify-between items-center border-b border-white/5">
        <h3 className="font-headline font-bold text-lg text-zinc-100">사용자 행동 타임라인</h3>
        <div className="flex gap-2">
          {['모든 이벤트', '결제', '소셜'].map((tab, i) => (
            <button 
              key={tab}
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded transition-all",
                i === 0 ? "bg-surface-high text-zinc-100" : "text-zinc-500 hover:text-zinc-100"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 space-y-12 relative">
        <div className="absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-white/5 to-transparent" />
        
        {LOG_EVENTS.map((event) => {
          const Icon = (Icons as any)[event.icon];
          const TagIcon = (Icons as any)[event.tagIcon];
          
          return (
            <div key={event.id} className="relative flex gap-8 group">
              <div className={cn(
                "z-10 w-6 h-6 mt-1 rounded-full bg-surface-lowest flex items-center justify-center border-2 border-surface-background shadow-lg transition-transform duration-300 group-hover:scale-110",
                `ring-4 ring-${event.color}/10`
              )}>
                <Icon size={12} className={`text-${event.color}`} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-zinc-200">{event.title}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">{event.user}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">기록: {event.time}</span>
                </div>
                
                <p className="text-xs text-zinc-400 mb-4 leading-relaxed max-w-xl">
                  {event.description}
                </p>

                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    `bg-${event.color}/10 text-${event.color}`
                  )}>
                    <TagIcon size={10} />
                    {event.tag}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
