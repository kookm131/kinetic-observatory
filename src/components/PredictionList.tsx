import { cn } from '@/src/lib/utils';
import * as Icons from 'lucide-react';

const PREDICTIONS = [
  {
    id: 'P82',
    name: 'Player_8291',
    level: 42,
    lastSeen: '4분 전',
    churnProb: 94,
    reasons: ['결제 감소', '로그인 빈도 하락'],
  },
  {
    id: 'V11',
    name: 'Viper_Master',
    level: 120,
    lastSeen: '12시간 전',
    churnProb: 78,
    reasons: ['최고 레벨 도달', '콘텐츠 소모'],
  },
  {
    id: 'K00',
    name: 'Kim_Observer',
    level: 15,
    lastSeen: '1시간 전',
    churnProb: 42,
    reasons: ['튜토리얼 정체'],
  },
];

export function PredictionList() {
  return (
    <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
      <div className="p-6 flex justify-between items-center bg-surface-lowest/30 border-b border-white/5">
        <div>
          <h3 className="font-headline font-bold text-lg text-zinc-100">이탈 가능성 예측</h3>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">SageMaker AI 모델</p>
        </div>
        <Icons.BrainCircuit size={20} className="text-primary" />
      </div>

      <div className="divide-y divide-white/5">
        {PREDICTIONS.map((p) => (
          <div key={p.id} className="p-6 hover:bg-white/5 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-lowest flex items-center justify-center border border-white/10 font-mono font-bold text-sm text-zinc-100 group-hover:border-primary/50 transition-colors">
                  {p.id}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-200">{p.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">LV. {p.level} • 마지막 접속: {p.lastSeen}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "text-xs font-black font-mono",
                  p.churnProb > 80 ? "text-error" : p.churnProb > 50 ? "text-tertiary" : "text-secondary"
                )}>
                  이탈률 {p.churnProb}% 예측
                </p>
                <div className="w-16 h-1 bg-surface-lowest rounded-full mt-2 overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      p.churnProb > 80 ? "bg-error" : p.churnProb > 50 ? "bg-tertiary" : "bg-secondary"
                    )} 
                    style={{ width: `${p.churnProb}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {p.reasons.map((reason) => (
                <span 
                  key={reason}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full p-4 text-[10px] font-bold text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest border-t border-white/5">
        전체 예측 목록 보기
      </button>
    </div>
  );
}
