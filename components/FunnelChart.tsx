'use client';

interface FunnelData {
  uploaded: number;
  contacted: number;
  replied: number;
  interested: number;
  booked: number;
  closed: number;
}

interface FunnelChartProps {
  data: FunnelData;
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const stages = [
    { key: 'uploaded', label: 'Uploaded', color: 'bg-slate-400' },
    { key: 'contacted', label: 'Contacted', color: 'bg-blue-400' },
    { key: 'replied', label: 'Replied', color: 'bg-purple-400' },
    { key: 'interested', label: 'Interested', color: 'bg-amber-400' },
    { key: 'booked', label: 'Booked', color: 'bg-green-400' },
    { key: 'closed', label: 'Closed', color: 'bg-green-600' },
  ];

  const maxValue = Math.max(...Object.values(data), 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Lead Funnel</h3>
      <div className="space-y-3">
        {stages.map(({ key, label, color }) => {
          const value = data[key as keyof FunnelData] || 0;
          const percentage = (value / maxValue) * 100;
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
              <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
