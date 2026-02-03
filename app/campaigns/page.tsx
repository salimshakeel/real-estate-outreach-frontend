'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  getCampaigns, 
  createCampaign, 
  startCampaign, 
  pauseCampaign,
  resumeCampaign,
  completeCampaign,
  deleteCampaign,
  getLeads,
  getTemplates,
  type Campaign 
} from '@/lib/api';
import { Play, Pause, CheckCircle, Trash2, Plus, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-amber-100 text-amber-700',
  completed: 'bg-purple-100 text-purple-700',
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState<Campaign | null>(null);
  const [newCampaignName, setNewCampaignName] = useState('');
  
  // For starting campaigns
  const [leads, setLeads] = useState<{id: number; email: string; first_name: string}[]>([]);
  const [templates, setTemplates] = useState<{id: number; name: string}[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const result = await getCampaigns();
      setCampaigns(result.items || []);
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeadsAndTemplates = async () => {
    try {
      const [leadsRes, templatesRes] = await Promise.all([
        getLeads(1, 100, 'uploaded'),
        getTemplates()
      ]);
      setLeads(leadsRes.items || []);
      setTemplates(templatesRes.items || []);
    } catch (err) {
      console.error('Failed to fetch leads/templates:', err);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async () => {
    if (!newCampaignName.trim()) return;
    try {
      await createCampaign({ name: newCampaignName });
      setNewCampaignName('');
      setShowCreateModal(false);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  const handleOpenStart = async (campaign: Campaign) => {
    setShowStartModal(campaign);
    setSelectedLeads([]);
    setSelectedTemplate(null);
    await fetchLeadsAndTemplates();
  };

  const handleStart = async () => {
    if (!showStartModal || selectedLeads.length === 0 || !selectedTemplate) return;
    try {
      await startCampaign(showStartModal.id, selectedLeads, selectedTemplate);
      setShowStartModal(null);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to start campaign:', err);
    }
  };

  const handlePause = async (id: number) => {
    try {
      await pauseCampaign(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
    }
  };

  const handleResume = async (id: number) => {
    try {
      await resumeCampaign(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to resume campaign:', err);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await completeCampaign(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to complete campaign:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this campaign?')) return;
    try {
      await deleteCampaign(id);
      fetchCampaigns();
    } catch (err) {
      console.error('Failed to delete campaign:', err);
    }
  };

  const toggleLeadSelection = (id: number) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllLeads = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
            <p className="text-slate-500">Manage your outreach campaigns</p>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            New Campaign
          </button>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : campaigns.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-500">No campaigns yet. Create one to get started.</p>
            </div>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{campaign.name}</h3>
                    {campaign.description && (
                      <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`}>
                        {campaign.status}
                      </span>
                      {campaign.started_at && (
                        <span className="text-xs text-slate-400">
                          Started: {new Date(campaign.started_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleOpenStart(campaign)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Play size={16} />
                        Start
                      </button>
                    )}
                    {campaign.status === 'active' && (
                      <>
                        <button
                          onClick={() => handlePause(campaign.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm"
                        >
                          <Pause size={16} />
                          Pause
                        </button>
                        <button
                          onClick={() => handleComplete(campaign.id)}
                          className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                        >
                          <CheckCircle size={16} />
                          Complete
                        </button>
                      </>
                    )}
                    {campaign.status === 'paused' && (
                      <button
                        onClick={() => handleResume(campaign.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        <Play size={16} />
                        Resume
                      </button>
                    )}
                    {campaign.status !== 'active' && (
                      <button
                        onClick={() => handleDelete(campaign.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">New Campaign</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Campaign name..."
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Start Campaign Modal */}
        {showStartModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Start Campaign: {showStartModal.name}</h2>
                <button onClick={() => setShowStartModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {/* Template Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Email Template
                </label>
                <select
                  value={selectedTemplate || ''}
                  onChange={(e) => setSelectedTemplate(Number(e.target.value) || null)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a template...</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Lead Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Select Leads ({selectedLeads.length} selected)
                  </label>
                  <button 
                    onClick={selectAllLeads}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {selectedLeads.length === leads.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="border border-slate-200 rounded-lg max-h-60 overflow-auto">
                  {leads.length === 0 ? (
                    <p className="p-4 text-slate-500 text-sm">No leads with "uploaded" status. Upload some leads first.</p>
                  ) : (
                    leads.map((lead) => (
                      <label 
                        key={lead.id} 
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                          className="rounded"
                        />
                        <span className="text-sm">
                          {lead.first_name} - {lead.email}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowStartModal(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleStart}
                  disabled={selectedLeads.length === 0 || !selectedTemplate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send to {selectedLeads.length} leads
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
