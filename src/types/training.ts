
export interface Team {
  id: string;
  name: string;
  members: number;
  department?: string;
  availability?: string[];
  specialties?: string[];
}

export interface Course {
  id: string;
  name: string;
  type: string;
  date: string;
  capacity: number;
  registered: number;
  participants?: number;
  duration: string;
  location: string;
  description?: string;
  prerequisites?: string[];
  status?: string;
  materials?: string[];
  targetAudience?: string;
  company?: string;
  instructor?: string;
  venue?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position?: string;
  contact?: string;
  skills?: string[];
  availability?: string[];
}

export interface TeamAssignment {
  id: string;
  teamId: string;
  courseId: string;
  date: string;
  role?: string;
  notes?: string;
  status?: string;
  members?: string[];
  vehicle?: string;
}

export interface TrainingReport {
  courseId: string;
  courseName: string;
  date: string;
  teamsAssigned: number;
  registrationRate: number;
  status: string;
}

export interface TrainingGoal {
  year: number;
  quarter: string;
  targetCourses: number;
  completedCourses: number;
  targetParticipants: number;
  actualParticipants: number;
}

export interface ResourceRequirement {
  courseId: string;
  date: string;
  roomRequired: boolean;
  equipmentRequired: string[];
  materialsNeeded: string[];
}

export interface ScheduleConflict {
  teamId: string;
  courseId1: string;
  courseId2: string;
  date: string;
  conflictType: string;
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  bookings?: string[];
}

// เพิ่มประเภทใหม่สำหรับการมอบหมายงานโดยตรง
export interface CourseAssignment {
  id: string;
  courseId: string;
  date: string;
  members: string[];
  vehicle?: string;
  notes?: string;
}
