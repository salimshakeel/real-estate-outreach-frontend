'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  getTemplates, 
  createTemplate, 
  deleteTemplate,
  seedDefaultTemplates,
  previewTemplate,
  type EmailTemplate 
} from '@/lib/api';
import { Plus, Trash2, Eye, Star, X } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState<{
    original: { subject: string; body: string };
    personalized: { subject: string; body: string };
  } | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const result = await getTemplates();
      setTemplates(result.items || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async () => {
    if (!formName.trim() || !formSubject.trim() || !formBody.trim()) return;
    try {
      await createTemplate({
        name: formName,
        subject: formSubject,
        body: formBody,
        is_default: formIsDefault,
      });
      resetForm();
      setShowCreateModal(false);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to create template:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this template?')) return;
    try {
      await deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      await seedDefaultTemplates();
      fetchTemplates();
    } catch (err) {
      console.error('Failed to seed templates:', err);
    }
  };

  const handlePreview = async (id: number) => {
    try {
      const result = await previewTemplate(id, {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Oak Street, Miami FL',
        property_type: 'Single Family',
        estimated_value: '$450,000',
      });
      setShowPreviewModal({
        original: result.original,
        personalized: result.personalized,
      });
    } catch (err) {
      console.error('Failed to preview:', err);
    }
  };

  const resetForm = () => {
    setFormName('');
    setFormSubject('');
    setFormBody('');
    setFormIsDefault(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Email Templates</h1>
            <p className="text-slate-500">Manage your email templates</p>
          </div>
          
          <div className="flex gap-2">
            {templates.length === 0 && (
              <button 
                onClick={handleSeedDefaults}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Load Defaults
              </button>
            )}
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              New Template
            </button>
          </div>
        </div>

        {/* Templates List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-500 mb-4">No templates yet.</p>
              <button 
                onClick={handleSeedDefaults}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Load Default Templates
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{template.name}</h3>
                      {template.is_default && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">
                          <Star size={12} />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">Subject:</span> {template.subject}
                    </p>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                      {template.body}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handlePreview(template.id)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Placeholders Reference */}
        <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-2">Available Placeholders</h3>
          <div className="flex flex-wrap gap-2">
            {['{{first_name}}', '{{last_name}}', '{{full_name}}', '{{email}}', '{{phone}}', '{{address}}', '{{property_type}}', '{{estimated_value}}'].map((p) => (
              <code key={p} className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-sm">{p}</code>
            ))}
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">New Template</h2>
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Initial Outreach"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Quick question about {{address}}"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
                  <textarea
                    placeholder="Hi {{first_name}},&#10;&#10;I noticed your property at {{address}}..."
                    value={formBody}
                    onChange={(e) => setFormBody(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formIsDefault}
                    onChange={(e) => setFormIsDefault(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">Set as default template</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
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

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Template Preview</h2>
                <button onClick={() => setShowPreviewModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Original Template</h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-900 mb-2">
                      Subject: {showPreviewModal.original.subject}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                      {showPreviewModal.original.body}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-slate-700 mb-2">Personalized Preview</h3>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-medium text-slate-900 mb-2">
                      Subject: {showPreviewModal.personalized.subject}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                      {showPreviewModal.personalized.body}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => setShowPreviewModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
