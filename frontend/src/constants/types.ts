export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface JobSummary {
  activeJobs: number;
  jobMatchings: number;
  expiringJobs: number;
}

export interface QuickLink {
  id: number;
  name: string;
  route: string;
  icon: string;
  isExternal?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MenuItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}
