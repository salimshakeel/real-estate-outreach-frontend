// API Client for Real Estate Outreach Backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============ HEALTH ============
export async function checkHealth() {
  const res = await fetch(`${API_URL}/health`);
  return res.json();
}

// ============ DASHBOARD ============
export async function getDashboard() {
  const res = await fetch(`${API_URL}/api/dashboard`);
  return res.json();
}

export async function getDashboardStats() {
  const res = await fetch(`${API_URL}/api/dashboard/stats`);
  return res.json();
}

export async function getDashboardFunnel() {
  const res = await fetch(`${API_URL}/api/dashboard/funnel`);
  return res.json();
}

export async function getDashboardActivity(limit = 20) {
  const res = await fetch(`${API_URL}/api/dashboard/activity?limit=${limit}`);
  return res.json();
}

export async function getQuickStats() {
  const res = await fetch(`${API_URL}/api/dashboard/quick`);
  return res.json();
}

// ============ LEADS ============
export interface Lead {
  id: number;
  email: string;
  first_name: string;
  last_name?: string;
  company?: string;
  phone?: string;
  address?: string;
  property_type?: string;
  estimated_value?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadsResponse {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  items: Lead[];
}

export async function getLeads(page = 1, perPage = 20, status?: string, search?: string): Promise<LeadsResponse> {
  const params = new URLSearchParams({ 
    page: String(page), 
    per_page: String(perPage) 
  });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  
  const res = await fetch(`${API_URL}/api/leads?${params}`);
  return res.json();
}

export async function getLead(id: number) {
  const res = await fetch(`${API_URL}/api/leads/${id}`);
  return res.json();
}

export async function createLead(data: Partial<Lead>) {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateLead(id: number, data: Partial<Lead>) {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteLead(id: number) {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function uploadLeadsCSV(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_URL}/api/leads/upload`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

export async function downloadCSVTemplate() {
  const res = await fetch(`${API_URL}/api/leads/template/csv`);
  return res.blob();
}

// ============ TEMPLATES ============
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTemplates(page = 1, perPage = 20, search?: string) {
  const params = new URLSearchParams({ 
    page: String(page), 
    per_page: String(perPage) 
  });
  if (search) params.set('search', search);
  
  const res = await fetch(`${API_URL}/api/templates?${params}`);
  return res.json();
}

export async function getTemplate(id: number) {
  const res = await fetch(`${API_URL}/api/templates/${id}`);
  return res.json();
}

export async function getDefaultTemplate() {
  const res = await fetch(`${API_URL}/api/templates/default/active`);
  if (res.status === 404) return null;
  return res.json();
}

export async function createTemplate(data: Partial<EmailTemplate>) {
  const res = await fetch(`${API_URL}/api/templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTemplate(id: number, data: Partial<EmailTemplate>) {
  const res = await fetch(`${API_URL}/api/templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTemplate(id: number) {
  const res = await fetch(`${API_URL}/api/templates/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function previewTemplate(id: number, sampleData?: Record<string, string>) {
  const res = await fetch(`${API_URL}/api/templates/${id}/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sampleData || {}),
  });
  return res.json();
}

export async function seedDefaultTemplates() {
  const res = await fetch(`${API_URL}/api/templates/seed/defaults`, {
    method: 'POST',
  });
  return res.json();
}

// ============ CAMPAIGNS ============
export interface Campaign {
  id: number;
  name: string;
  description?: string;
  email_template?: string;
  status: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getCampaigns(page = 1, perPage = 20, status?: string, search?: string) {
  const params = new URLSearchParams({ 
    page: String(page), 
    per_page: String(perPage) 
  });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  
  const res = await fetch(`${API_URL}/api/campaigns?${params}`);
  return res.json();
}

export async function getCampaign(id: number) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}`);
  return res.json();
}

export async function createCampaign(data: Partial<Campaign>) {
  const res = await fetch(`${API_URL}/api/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCampaign(id: number, data: Partial<Campaign>) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCampaign(id: number) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function startCampaign(id: number, leadIds: number[], templateId?: number, subject?: string, body?: string) {
  const payload: Record<string, unknown> = { lead_ids: leadIds };
  if (templateId) payload.email_template_id = templateId;
  if (subject) payload.subject = subject;
  if (body) payload.body = body;
  
  const res = await fetch(`${API_URL}/api/campaigns/${id}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function pauseCampaign(id: number) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}/pause`, {
    method: 'POST',
  });
  return res.json();
}

export async function resumeCampaign(id: number) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}/resume`, {
    method: 'POST',
  });
  return res.json();
}

export async function completeCampaign(id: number) {
  const res = await fetch(`${API_URL}/api/campaigns/${id}/complete`, {
    method: 'POST',
  });
  return res.json();
}

export async function getCampaignEmails(id: number, page = 1, perPage = 50, status?: string) {
  const params = new URLSearchParams({ 
    page: String(page), 
    per_page: String(perPage) 
  });
  if (status) params.set('status', status);
  
  const res = await fetch(`${API_URL}/api/campaigns/${id}/emails?${params}`);
  return res.json();
}

export async function quickStartCampaign(name: string, leadIds: number[], templateId?: number, subject?: string, body?: string) {
  const params = new URLSearchParams({ 
    name, 
    lead_ids: leadIds.join(',') 
  });
  if (templateId) params.set('template_id', String(templateId));
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  
  const res = await fetch(`${API_URL}/api/campaigns/quick-start?${params}`, {
    method: 'POST',
  });
  return res.json();
}

// ============ DEMO SIMULATION ============
// These would call demo endpoints if they exist on backend
export async function simulateEmailOpen(leadId: number) {
  const res = await fetch(`${API_URL}/api/demo/simulate/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead_id: leadId }),
  });
  return res.json();
}

export async function simulateEmailReply(leadId: number, sentiment: string = 'interested') {
  const res = await fetch(`${API_URL}/api/demo/simulate/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead_id: leadId, sentiment }),
  });
  return res.json();
}

export async function simulateBooking(leadId: number) {
  const res = await fetch(`${API_URL}/api/demo/simulate/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead_id: leadId }),
  });
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch(`${API_URL}/api/demo/reset`, {
    method: 'POST',
  });
  return res.json();
}
