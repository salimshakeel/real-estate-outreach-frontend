'use client';

import { Mail, MessageSquare, Calendar, UserPlus } from 'lucide-react';

interface Activity {
  type: string;
  lead_id: number;
  lead_name: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const iconMap: Record<string, typeof Mail> = {
  email_sent: Mail,
  reply_received: MessageSquare,
  booking_created: Calendar,
  lead_created: UserPlus,
};

const colorMap: Record<string, string> = {
  email_sent: 'bg-blue-100 text-blue-600',
  reply_received: 'bg-purple-100 text-purple-600',
  booking_created: 'bg-green-100 text-green-600',
  lead_created: 'bg-slate-100 text-slate-600',
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <p className="text-slate-400 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = iconMap[activity.type] || Mail;
          const colorClass = colorMap[activity.type] || 'bg-slate-100 text-slate-600';
          
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium truncate">
                  {activity.lead_name}
                </p>
                <p className="text-sm text-slate-500 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
