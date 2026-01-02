import { User } from '../models/types';

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined
};

export const getUserProfile = (): User => {
  return mockUser;
};
