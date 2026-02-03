'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import FunnelChart from '@/components/FunnelChart';
import ActivityFeed from '@/components/ActivityFeed';
import { getDashboard } from '@/lib/api';

interface DashboardData {
  stats: {
    total_leads: number;
    total_emails_sent: number;
    emails_opened: number;
    emails_replied: number;
    total_bookings: number;
    open_rate: number;
    reply_rate: number;
    emails_sent_today: number;
    replies_today: number;
  };
  funnel: {
    uploaded: number;
    contacted: number;
    replied: number;
    interested: number;
    booked: number;
    closed: number;
  };
  recent_activity: Array<{
    type: string;
    lead_id: number;
    lead_name: string;
    description: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getDashboard();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Real-time outreach performance</p>
          </div>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && !data ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Leads" 
                value={data.stats.total_leads}
                subtitle={`${data.stats.emails_sent_today} emails today`}
              />
              <StatCard 
                title="Emails Sent" 
                value={data.stats.total_emails_sent}
                subtitle={`${data.stats.open_rate.toFixed(1)}% open rate`}
              />
              <StatCard 
                title="Replies" 
                value={data.stats.emails_replied}
                subtitle={`${data.stats.reply_rate.toFixed(1)}% reply rate`}
              />
              <StatCard 
                title="Bookings" 
                value={data.stats.total_bookings}
                subtitle="Meetings scheduled"
              />
            </div>

            {/* Funnel + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FunnelChart data={data.funnel} />
              <ActivityFeed activities={data.recent_activity} />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
