import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const data = [
  { time: '12:00', ccu: 85000 },
  { time: '13:00', ccu: 92000 },
  { time: '14:00', ccu: 105000 },
  { time: '15:00', ccu: 118000 },
  { time: '16:00', ccu: 108000 },
  { time: '17:00', ccu: 125000 },
  { time: '18:00', ccu: 135000 },
  { time: '19:00', ccu: 128492 }, // Current
  { time: '20:00', ccu: 115000 },
  { time: '21:00', ccu: 102000 },
  { time: '22:00', ccu: 95000 },
  { time: '23:00', ccu: 88000 },
];

export function CCUChart() {
  return (
    <div className="h-64 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-surface-bright px-3 py-2 rounded-lg border border-white/10 shadow-xl">
                    <p className="text-[10px] text-zinc-500 mb-1">{payload[0].payload.time}</p>
                    <p className="text-sm font-bold text-primary">{payload[0].value?.toLocaleString()} CCU</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="ccu" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 7 ? '#14d8ff' : 'rgba(20, 216, 255, 0.2)'} 
                className="transition-all duration-500 hover:opacity-100"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
