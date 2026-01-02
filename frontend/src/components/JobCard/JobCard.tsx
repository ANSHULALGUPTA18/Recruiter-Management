import { ArrowRight, LucideIcon } from 'lucide-react';

interface JobCardProps {
  icon: LucideIcon;
  title: string;
  href?: string;
}

export default function JobCard({ icon: Icon, title, href = '#' }: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center hover:shadow-md transition-shadow min-h-[180px]">
      <div className="flex flex-col items-center flex-1 justify-center">
        <Icon className="w-12 h-12 text-primary-500 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-gray-900 text-center">
          {title}
        </h3>
      </div>
      <a
        href={href}
        className="self-end mt-4 flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>view all</span>
      </a>
    </div>
  );
}
