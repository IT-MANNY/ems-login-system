
export interface Team {
  id: string;
  name: string;
  members: number;
  department?: string;  // เพิ่มแผนก
  availability?: string[]; // วันที่พร้อมทำงาน
  specialties?: string[]; // ความเชี่ยวชาญพิเศษ
}

export interface Course {
  id: string;
  name: string;
  type: string;
  date: string;
  capacity: number;
  registered: number;
  duration: string;
  location: string;
  description?: string; // คำอธิบายเพิ่มเติม
  prerequisites?: string[]; // ความต้องการพื้นฐาน
  status?: string; // สถานะของหลักสูตร (เปิดรับสมัคร, ปิดรับสมัคร, ยกเลิก)
  materials?: string[]; // อุปกรณ์ที่ต้องใช้
  targetAudience?: string; // กลุ่มเป้าหมาย
  company?: string; // เพิ่มบริษัทที่จัดอบรม
  instructor?: string; // เพิ่มวิทยากร
  venue?: string; // สถานที่จัดอบรมละเอียดเพิ่มเติม
}

// เพิ่มข้อมูลผู้ปฏิบัติงานในทีม
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
  role?: string; // บทบาทในการดูแล (ผู้นำทีม, ผู้สอน, ผู้ช่วย)
  notes?: string; // หมายเหตุเพิ่มเติม
  status?: string; // สถานะการมอบหมาย (ยืนยันแล้ว, รอการยืนยัน)
  members?: string[]; // รายการ ID ของสมาชิกที่ได้รับมอบหมาย
  vehicle?: string; // ข้อมูลรถที่ใช้ (ถ้ามี)
}

// เพิ่มประเภทสำหรับรายงานและการวิเคราะห์
export interface TrainingReport {
  courseId: string;
  courseName: string;
  date: string;
  teamsAssigned: number;
  registrationRate: number; // อัตราการลงทะเบียน (%)
  status: string;
}

// เพิ่มประเภทสำหรับการเปรียบเทียบกับเป้าหมาย
export interface TrainingGoal {
  year: number;
  quarter: string;
  targetCourses: number;
  completedCourses: number;
  targetParticipants: number;
  actualParticipants: number;
}

// เพิ่มประเภทสำหรับการตรวจสอบทรัพยากร
export interface ResourceRequirement {
  courseId: string;
  date: string;
  roomRequired: boolean;
  equipmentRequired: string[];
  materialsNeeded: string[];
}

// เพิ่มประเภทสำหรับความขัดแย้งในตาราง
export interface ScheduleConflict {
  teamId: string;
  courseId1: string;
  courseId2: string;
  date: string;
  conflictType: string; // ประเภทความขัดแย้ง (ทีมซ้ำซ้อน, ห้องซ้ำซ้อน)
}

// เพิ่มประเภทสำหรับรถที่ใช้ในการเดินทาง
export interface Vehicle {
  id: string;
  name: string;
  type: string; // ประเภทรถ (รถตู้, รถบัส, รถเก๋ง)
  capacity: number; // จำนวนที่นั่ง
  status: string; // สถานะ (ว่าง, ถูกจอง)
  bookings?: string[]; // วันที่มีการจอง
}
