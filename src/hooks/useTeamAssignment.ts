
import { useState } from "react";
import { Team, Course, TeamAssignment, TeamMember, Vehicle } from "@/types/training";

// ข้อมูลตัวอย่างสำหรับสมาชิกทีม
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

// ข้อมูลตัวอย่างสำหรับทีม
const MOCK_TEAMS: Team[] = [
  { id: "T1", name: "ทีมฝ่ายบุคคล", members: 5 },
  { id: "T2", name: "ทีมฝ่ายพัฒนา", members: 4 },
  { id: "T3", name: "ทีมฝึกอบรม", members: 6 },
  { id: "T4", name: "ทีมไอที", members: 3 },
  { id: "T5", name: "ทีมนวัตกรรม", members: 4 },
  { id: "T6", name: "ทีมความปลอดภัย", members: 5 }
];

// ข้อมูลตัวอย่างสำหรับหลักสูตรที่จะจัดในเดือนต่างๆ
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

// ข้อมูลตัวอย่างสำหรับการกำหนดทีมให้กับหลักสูตร
const MOCK_ASSIGNMENTS: TeamAssignment[] = [
  { 
    id: "A1", 
    teamId: "T1", 
    courseId: "C001", 
    date: "2025-06-15",
    members: ["M1", "M2"],
    vehicle: "V1"
  },
  { 
    id: "A2", 
    teamId: "T2", 
    courseId: "C001", 
    date: "2025-06-15",
    members: ["M3", "M4"]
  },
  { 
    id: "A3", 
    teamId: "T3", 
    courseId: "C002", 
    date: "2025-06-18",
    members: ["M2", "M7"]
  },
  { 
    id: "A4", 
    teamId: "T2", 
    courseId: "C003", 
    date: "2025-06-22",
    members: ["M4", "M6"],
    vehicle: "V3"
  },
  { 
    id: "A5", 
    teamId: "T4", 
    courseId: "C003", 
    date: "2025-06-22",
    members: ["M3", "M8"]
  },
  { 
    id: "A6", 
    teamId: "T5", 
    courseId: "C003", 
    date: "2025-06-22",
    members: ["M1"]
  }
];

const useTeamAssignment = () => {
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [assignments, setAssignments] = useState<TeamAssignment[]>(MOCK_ASSIGNMENTS);
  const [teamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [vehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  
  // กำหนดทีมให้กับหลักสูตร
  const assignTeam = (teamId: string, courseId: string, date: string) => {
    // ตรวจสอบว่าทีมนี้ได้ถูกกำหนดให้กับหลักสูตรนี้แล้วหรือไม่
    const exists = assignments.some(
      a => a.teamId === teamId && a.courseId === courseId && a.date === date
    );
    
    if (!exists) {
      const newAssignment: TeamAssignment = {
        id: `A${Date.now()}`,
        teamId,
        courseId,
        date,
        members: []
      };
      
      setAssignments([...assignments, newAssignment]);
    }
  };
  
  // ลบการกำหนดทีม
  const removeAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
  };

  // กำหนดสมาชิกทีมให้กับการมอบหมายงาน
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

  // ลบสมาชิกทีมจากการมอบหมายงาน
  const removeMember = (assignmentId: string, memberId: string) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId && assignment.members) {
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
  
  return {
    teams,
    courses,
    assignments,
    teamMembers,
    vehicles,
    assignTeam,
    removeAssignment,
    assignMember,
    removeMember,
    assignVehicle
  };
};

export default useTeamAssignment;
