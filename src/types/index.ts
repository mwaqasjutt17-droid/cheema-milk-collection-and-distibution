export type Role = 'Admin' | 'Driver' | 'Accountant' | 'Lab Technician';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}
