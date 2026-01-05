import { useCallback, useState } from 'react';
import { ClipboardCheck, Users, Hourglass, FileText, FileCheck } from 'lucide-react';
import JobCard from '../components/JobCard/JobCard';
import QuickLinkCard from '../components/QuickLinkCard/QuickLinkCard';
import AddQuickLinkModal from '../components/AddQuickLinkModal/AddQuickLinkModal';
import { jobApi, quickLinkApi } from '../services/api';
import { useApi } from '../hooks/useApi';
import { JobSummary, QuickLink } from '../constants/types';

const iconMap: { [key: string]: typeof FileText } = {
  FileText: FileText,
  FileCheck: FileCheck,
};

export default function Dashboard() {
  const [showAddPanel, setShowAddPanel] = useState(false);

  const fetchJobSummary = useCallback(() => jobApi.getSummary(), []);
  const fetchQuickLinks = useCallback(() => quickLinkApi.getAll(), []);

  const { data: jobSummary, loading: jobsLoading } = useApi<JobSummary>(fetchJobSummary, []);
  const { data: quickLinks, loading: linksLoading, refetch: refetchLinks } = useApi<QuickLink[]>(fetchQuickLinks, []);

  const handleAddQuickLink = async (name: string, url: string) => {
    await quickLinkApi.create(name, url);
    refetchLinks();
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
    <div className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
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
            {/* Add new link card */}
            <QuickLinkCard
              label="Add new link"
              isAddCard
              onClick={() => setShowAddPanel(true)}
            />
          </div>
        )}
      </section>

      {/* Right Side Panel for Adding Quick Link */}
      <AddQuickLinkModal
        isOpen={showAddPanel}
        onClose={() => setShowAddPanel(false)}
        onAdd={handleAddQuickLink}
      />
    </div>
  );
}
