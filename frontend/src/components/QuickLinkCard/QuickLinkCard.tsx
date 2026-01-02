import { LucideIcon, Plus, X } from 'lucide-react';

interface QuickLinkCardProps {
  icon?: LucideIcon;
  label: string;
  href?: string;
  isAddCard?: boolean;
  isExternal?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export default function QuickLinkCard({
  icon: Icon,
  label,
  href = '#',
  isAddCard = false,
  isExternal = false,
  onDelete,
  onClick,
}: QuickLinkCardProps) {
  if (isAddCard) {
    return (
      <button
        onClick={onClick}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px] hover:bg-blue-100 transition-colors cursor-pointer"
        aria-label="Add new quick link"
      >
        <Plus className="w-10 h-10 text-primary-500 mb-2" strokeWidth={1.5} />
        <span className="text-sm font-medium text-primary-500">{label}</span>
      </button>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div className="relative group">
      {onDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all z-10"
          aria-label={`Delete ${label}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px] hover:shadow-md hover:border-gray-300 transition-all cursor-pointer block"
      >
        {Icon && <Icon className="w-10 h-10 text-primary-500 mb-3" strokeWidth={1.5} />}
        <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
      </a>
    </div>
  );
}
