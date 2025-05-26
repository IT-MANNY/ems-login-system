
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

// แก้ไข AttendanceRecord ให้สอดคล้องกับการนำเข้าข้อมูลจากเครื่องแสกนนิ้ว
export interface AttendanceRecord {
  id: string;
  username: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  timeIn: string;
  timeOut: string;
  totalHours: string;
  hoursWorked: number;
  status: 'ปกติ' | 'มาสาย' | 'ลาป่วย' | 'ลากิจ' | 'ลาพักร้อน' | 'ขาดงาน';
  notes?: string;
  importedFrom?: 'fingerprint-scanner'; // ระบุแหล่งที่มาของข้อมูล
  importedAt?: string; // วันที่นำเข้าข้อมูล
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
