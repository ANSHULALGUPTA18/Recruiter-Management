import { JobSummary } from '../models/types';

const mockJobSummary: JobSummary = {
  activeJobs: 500,
  jobMatchings: 2,
  expiringJobs: 3
};

export const getJobSummary = (): JobSummary => {
  return mockJobSummary;
};
