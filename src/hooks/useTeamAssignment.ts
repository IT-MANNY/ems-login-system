
import { useState } from "react";
import { Course, TeamMember, Vehicle } from "@/types/training";

// ประเภทข้อมูลใหม่สำหรับการมอบหมายงาน
interface CourseAssignment {
  id: string;
  courseId: string;
  date: string;
  members: string[];
  vehicle?: string;
  notes?: string;
}

// ข้อมูลตัวอย่างสำหรับสมาชิก
const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "M1", name: "สุรชัย มานะ", position: "หัวหน้าทีม", skills: ["การประสานงาน", "ดูแลภาพรวม"] },
  { id: "M2", name: "วิภาพร ใจดี", position: "เจ้าหน้าที่ฝึกอบรม", skills: ["จัดการเอกสาร", "ประสานงานวิทยากร"] },
  { id: "M3", name: "ธนกร พัฒนา", position: "เจ้าหน้าที่โสตฯ", skills: ["ระบบเสียง", "โสตทัศนูปกรณ์"] },
  { id: "M4", name: "นภาพร วงศ์สกุล", position: "เจ้าหน้าที่ลงทะเบียน", skills: ["ลงทะเบียน", "ต้อนรับ"] },
  { id: "M5", name: "สมศักดิ์ การุณ", position: "พนักงานขับรถ", skills: ["ขับรถ"] },
  { id: "M6", name: "มนัส พากเพียร", position: "เจ้าหน้าที่ทั่วไป", skills: ["งานทั่วไป"] },
  { id: "M7", name: "พิไลพร จริยา", position: "เจ้าหน้าที่ประสานงาน", skills: ["ประสานงานภายนอก"] },
  { id: "M8", name: "วีระพงษ์ สุขใจ", position: "ช่างเทคนิค", skills: ["ดูแลอุปกรณ์", "ระบบไฟ"] }
];

// ข้อมูลตัวอย่างสำหรับรถ
const MOCK_VEHICLES: Vehicle[] = [
  { id: "V1", name: "รถตู้ 1", type: "รถตู้", capacity: 12, status: "ว่าง" },
  { id: "V2", name: "รถตู้ 2", type: "รถตู้", capacity: 12, status: "ว่าง" },
  { id: "V3", name: "รถเก๋ง 1", type: "รถเก๋ง", capacity: 4, status: "ว่าง" },
  { id: "V4", name: "รถบัส", type: "รถบัส", capacity: 40, status: "ว่าง" }
];

// ข้อมูลตัวอย่างสำหรับหลักสูตร
const MOCK_COURSES: Course[] = [
  {
    id: "C001",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    date: "2025-06-15",
    capacity: 30,
    registered: 25,
    duration: "6 ชั่วโมง",
    location: "ห้องประชุมใหญ่",
    company: "Training Excellence Co., Ltd.",
    instructor: "ดร.สมชาย ใจดี"
  },
  {
    id: "C002",
    name: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    type: "Productivity",
    date: "2025-06-18",
    capacity: 25,
    registered: 20,
    duration: "3 ชั่วโมง",
    location: "ห้องอบรม 2",
    company: "Time Management Institute",
    instructor: "คุณวิภา เวลาทอง"
  },
  {
    id: "C003",
    name: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    type: "Technical",
    date: "2025-06-22",
    capacity: 20,
    registered: 18,
    duration: "6 ชั่วโมง",
    location: "ห้อง Innovation Hub",
    company: "TechTrain Thailand",
    instructor: "คุณสมศักดิ์ เทคโนโลยี"
  },
  {
    id: "C004",
    name: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    type: "Technical",
    date: "2025-07-05",
    capacity: 15,
    registered: 10,
    duration: "12 ชั่วโมง",
    location: "ศูนย์อบรมดิจิทัล",
    company: "Data Decision Co., Ltd.",
    instructor: "ดร.วิเคราะห์ ข้อมูลดี"
  },
  {
    id: "C005",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    date: "2025-07-20",
    capacity: 30,
    registered: 15,
    duration: "6 ชั่วโมง",
    location: "ห้องประชุมใหญ่",
    company: "Training Excellence Co., Ltd.",
    instructor: "ดร.สมชาย ใจดี"
  }
];

// ข้อมูลตัวอย่างสำหรับการกำหนดเจ้าหน้าที่ให้กับหลักสูตร
const MOCK_ASSIGNMENTS: CourseAssignment[] = [
  { 
    id: "A1", 
    courseId: "C001", 
    date: "2025-06-15",
    members: ["M1", "M2"],
    vehicle: "V1"
  },
  { 
    id: "A2", 
    courseId: "C001", 
    date: "2025-06-15",
    members: ["M3", "M4"]
  },
  { 
    id: "A3", 
    courseId: "C002", 
    date: "2025-06-18",
    members: ["M2", "M7"]
  },
  { 
    id: "A4", 
    courseId: "C003", 
    date: "2025-06-22",
    members: ["M4", "M6", "M8"],
    vehicle: "V3"
  }
];

const useTeamAssignment = () => {
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [assignments, setAssignments] = useState<CourseAssignment[]>(MOCK_ASSIGNMENTS);
  const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  
  // สร้างการมอบหมายงานใหม่
  const createAssignment = (courseId: string, date: string) => {
    // ตรวจสอบว่าหลักสูตรนี้มีการมอบหมายงานแล้วหรือไม่
    const existingAssignment = assignments.find(
      a => a.courseId === courseId && a.date === date
    );
    
    if (!existingAssignment) {
      const newAssignment: CourseAssignment = {
        id: `A${Date.now()}`,
        courseId,
        date,
        members: []
      };
      
      setAssignments([...assignments, newAssignment]);
      return newAssignment.id;
    }
    
    return existingAssignment.id;
  };
  
  // ลบการมอบหมายงาน
  const removeAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
  };

  // เพิ่มเจ้าหน้าที่ให้กับการมอบหมายงาน
  const assignMember = (assignmentId: string, memberId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        // ตรวจสอบว่าสมาชิกคนนี้ถูกเพิ่มไว้แล้วหรือไม่
        const members = assignment.members || [];
        if (!members.includes(memberId)) {
          return {
            ...assignment,
            members: [...members, memberId]
          };
        }
      }
      return assignment;
    }));
  };

  // ลบเจ้าหน้าที่จากการมอบหมายงาน
  const removeMember = (assignmentId: string, memberId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          members: assignment.members.filter(id => id !== memberId)
        };
      }
      return assignment;
    }));
  };

  // กำหนดรถให้กับการมอบหมายงาน
  const assignVehicle = (assignmentId: string, vehicleId: string | null) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          vehicle: vehicleId || undefined
        };
      }
      return assignment;
    }));
  };
  
  // เพิ่มโน้ตให้การมอบหมายงาน
  const addNotes = (assignmentId: string, notes: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          notes
        };
      }
      return assignment;
    }));
  };
  
  return {
    courses,
    assignments,
    teamMembers,
    vehicles,
    createAssignment,
    removeAssignment,
    assignMember,
    removeMember,
    assignVehicle,
    addNotes
  };
};

export default useTeamAssignment;
