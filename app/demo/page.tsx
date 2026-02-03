'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  getLeads,
  simulateEmailOpen,
  simulateEmailReply,
  simulateBooking,
  resetDemoData,
  type Lead
} from '@/lib/api';
import { Mail, MessageSquare, Calendar, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';

export default function DemoPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const result = await getLeads(1, 50);
      setLeads(result.items || []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const showResult = (type: 'success' | 'error', message: string) => {
    setActionResult({ type, message });
    setTimeout(() => setActionResult(null), 3000);
  };

  const handleSimulateOpen = async (leadId: number, leadName: string) => {
    try {
      await simulateEmailOpen(leadId);
      showResult('success', `Simulated email open for ${leadName}`);
      fetchLeads();
    } catch (err) {
      showResult('error', 'Failed to simulate open. Is the demo endpoint enabled?');
    }
  };

  const handleSimulateReply = async (leadId: number, leadName: string, sentiment: string) => {
    try {
      await simulateEmailReply(leadId, sentiment);
      showResult('success', `Simulated ${sentiment} reply for ${leadName}`);
      fetchLeads();
    } catch (err) {
      showResult('error', 'Failed to simulate reply. Is the demo endpoint enabled?');
    }
  };

  const handleSimulateBooking = async (leadId: number, leadName: string) => {
    try {
      await simulateBooking(leadId);
      showResult('success', `Simulated booking for ${leadName}`);
      fetchLeads();
    } catch (err) {
      showResult('error', 'Failed to simulate booking. Is the demo endpoint enabled?');
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all demo data? This will clear leads, campaigns, and start fresh.')) return;
    try {
      await resetDemoData();
      showResult('success', 'Demo data reset successfully');
      fetchLeads();
    } catch (err) {
      showResult('error', 'Failed to reset demo data. Is the endpoint enabled?');
    }
  };

  const statusColors: Record<string, string> = {
    uploaded: 'bg-slate-100 text-slate-700',
    contacted: 'bg-blue-100 text-blue-700',
    replied: 'bg-purple-100 text-purple-700',
    interested: 'bg-amber-100 text-amber-700',
    booked: 'bg-green-100 text-green-700',
    closed: 'bg-green-200 text-green-800',
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Demo Controls</h1>
            <p className="text-slate-500">Simulate email opens, replies, and bookings</p>
          </div>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <RotateCcw size={18} />
            Reset Demo
          </button>
        </div>

        {/* Status Message */}
        {actionResult && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 ${
            actionResult.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {actionResult.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {actionResult.message}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to use Demo Mode</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Go to <strong>Leads</strong> and upload a CSV (or use existing leads)</li>
            <li>Go to <strong>Templates</strong> and load default templates</li>
            <li>Go to <strong>Campaigns</strong>, create a campaign, and start it with some leads</li>
            <li>Come back here and simulate events: opens → replies → bookings</li>
            <li>Watch the <strong>Dashboard</strong> update in real-time!</li>
          </ol>
        </div>

        {/* Note about backend */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These simulation endpoints need to be added to your backend. 
            See the demo endpoints in the API client: <code className="bg-amber-100 px-1 rounded">POST /api/demo/simulate/open</code>, etc.
          </p>
        </div>

        {/* Leads with Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Leads - Simulate Events</h3>
          </div>
          
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Simulate Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    No leads found. Upload some leads first.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-sm text-slate-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSimulateOpen(lead.id, lead.first_name)}
                          disabled={lead.status === 'uploaded'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Simulate email open"
                        >
                          <Mail size={14} />
                          Open
                        </button>
                        
                        <button
                          onClick={() => handleSimulateReply(lead.id, lead.first_name, 'interested')}
                          disabled={lead.status === 'uploaded'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Simulate interested reply"
                        >
                          <MessageSquare size={14} />
                          Interested
                        </button>
                        
                        <button
                          onClick={() => handleSimulateReply(lead.id, lead.first_name, 'not_now')}
                          disabled={lead.status === 'uploaded'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Simulate 'not now' reply"
                        >
                          <MessageSquare size={14} />
                          Not Now
                        </button>
                        
                        <button
                          onClick={() => handleSimulateBooking(lead.id, lead.first_name)}
                          disabled={lead.status !== 'interested'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Simulate booking"
                        >
                          <Calendar size={14} />
                          Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
