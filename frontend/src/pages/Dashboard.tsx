import { useCallback, useState } from 'react';
import { ClipboardCheck, Users, Hourglass, FileText, FileCheck } from 'lucide-react';
import JobCard from '../components/JobCard/JobCard';
import QuickLinkCard from '../components/QuickLinkCard/QuickLinkCard';
import { jobApi, quickLinkApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { JobSummary, QuickLink } from '../constants/types';

const iconMap: { [key: string]: typeof FileText } = {
  FileText: FileText,
  FileCheck: FileCheck,
};

export default function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchJobSummary = useCallback(() => jobApi.getSummary(), []);
  const fetchQuickLinks = useCallback(() => quickLinkApi.getAll(), []);

  const { data: jobSummary, loading: jobsLoading } = useApi<JobSummary>(fetchJobSummary, []);
  const { data: quickLinks, loading: linksLoading, refetch: refetchLinks } = useApi<QuickLink[]>(fetchQuickLinks, []);

  const handleToggleAddForm = () => {
    setShowAddForm(!showAddForm);
    if (showAddForm) {
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };

  const handleAddQuickLink = async () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;
    setIsAdding(true);
    try {
      await quickLinkApi.create(newLinkName.trim(), newLinkUrl.trim());
      refetchLinks();
      setNewLinkName('');
      setNewLinkUrl('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add quick link:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteQuickLink = async (id: number) => {
    try {
      await quickLinkApi.delete(id);
      refetchLinks();
    } catch (error) {
      console.error('Failed to delete quick link:', error);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {/* Jobs Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Jobs</h2>
        {jobsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <JobCard
              icon={ClipboardCheck}
              title="Active Jobs"
              href="/jobs/active"
            />
            <JobCard
              icon={Users}
              title="Job Matchings"
              href="/jobs/matchings"
            />
            <JobCard
              icon={Hourglass}
              title="Expiring Jobs"
              href="/jobs/expiring"
            />
          </div>
        )}
      </section>

      {/* Divider */}
      <hr className="border-gray-200 mb-8" />

      {/* Quick Links Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
        {linksLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {quickLinks?.map((link) => {
                const IconComponent = iconMap[link.icon] || FileText;
                return (
                  <QuickLinkCard
                    key={link.id}
                    icon={IconComponent}
                    label={link.name}
                    href={link.route}
                    isExternal={link.isExternal}
                    onDelete={() => handleDeleteQuickLink(link.id)}
                  />
                );
              })}
              {/* Add new link card with inline form */}
              <div className="flex flex-col">
                <QuickLinkCard
                  label="Add new link"
                  isAddCard
                  onClick={handleToggleAddForm}
                />
                {/* Inline Add Form - appears directly below the card */}
                {showAddForm && (
                  <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          value={newLinkName}
                          onChange={(e) => setNewLinkName(e.target.value)}
                          placeholder="Enter Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                        <input
                          type="text"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="Enter URL"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleAddQuickLink}
                          disabled={isAdding || !newLinkName.trim() || !newLinkUrl.trim()}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isAdding ? 'Adding...' : 'Add'}
                        </button>
                        <button
                          onClick={handleToggleAddForm}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
