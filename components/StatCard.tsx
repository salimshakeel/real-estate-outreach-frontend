interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatCard({ title, value, subtitle, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-1 text-slate-900">{value}</p>
      {subtitle && (
        <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
      )}
      {trend && trendValue && (
        <p className={`text-sm mt-2 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-slate-500'
        }`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </p>
      )}
    </div>
  );
}
