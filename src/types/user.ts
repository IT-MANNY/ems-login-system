
export type UserRole = 'user' | 'manager' | 'admin';

export interface Employee {
  username: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  role: UserRole;
  managerUsername: string | null;
  startDate: string;
  active: boolean;
}

export interface OTRequest {
  id: string;
  username: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverUsername: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  username: string;
  type: 'sick' | 'vacation' | 'personal' | 'maternity';
  mode: 'full-day' | 'half-day' | 'hourly';
  startDate: string;
  endDate?: string;
  halfDayPeriod?: 'morning' | 'afternoon';
  startTime?: string;
  endTime?: string;
  days?: number;
  hours?: number;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approverUsername: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  username: string;
  date: string;
  timeIn: string;
  timeOut: string;
  hoursWorked: number;
  notes?: string;
}

export interface TrainingRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  location: string;
  company: string;
  instructor: string;
  supportTeam: string;
  transportation: string;
  status: string;
  participants: string[];
}
