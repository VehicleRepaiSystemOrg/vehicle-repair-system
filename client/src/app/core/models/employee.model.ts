// Employee model used by Staff Management feature

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
}
