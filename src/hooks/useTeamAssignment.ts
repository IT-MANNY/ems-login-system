
import { useState } from "react";
import { Team, Course, TeamAssignment } from "@/types/training";

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
    location: "ห้องประชุมใหญ่"
  },
  {
    id: "C002",
    name: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    type: "Productivity",
    date: "2025-06-18",
    capacity: 25,
    registered: 20,
    duration: "3 ชั่วโมง",
    location: "ห้องอบรม 2"
  },
  {
    id: "C003",
    name: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    type: "Technical",
    date: "2025-06-22",
    capacity: 20,
    registered: 18,
    duration: "6 ชั่วโมง",
    location: "ห้อง Innovation Hub"
  },
  {
    id: "C004",
    name: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    type: "Technical",
    date: "2025-07-05",
    capacity: 15,
    registered: 10,
    duration: "12 ชั่วโมง",
    location: "ศูนย์อบรมดิจิทัล"
  },
  {
    id: "C001",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    date: "2025-07-20",
    capacity: 30,
    registered: 15,
    duration: "6 ชั่วโมง",
    location: "ห้องประชุมใหญ่"
  }
];

// ข้อมูลตัวอย่างสำหรับการกำหนดทีมให้กับหลักสูตร
const MOCK_ASSIGNMENTS: TeamAssignment[] = [
  { id: "A1", teamId: "T1", courseId: "C001", date: "2025-06-15" },
  { id: "A2", teamId: "T2", courseId: "C001", date: "2025-06-15" },
  { id: "A3", teamId: "T3", courseId: "C002", date: "2025-06-18" },
  { id: "A4", teamId: "T2", courseId: "C003", date: "2025-06-22" },
  { id: "A5", teamId: "T4", courseId: "C003", date: "2025-06-22" },
  { id: "A6", teamId: "T5", courseId: "C003", date: "2025-06-22" }
];

const useTeamAssignment = () => {
  const [teams] = useState<Team[]>(MOCK_TEAMS);
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [assignments, setAssignments] = useState<TeamAssignment[]>(MOCK_ASSIGNMENTS);
  
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
        date
      };
      
      setAssignments([...assignments, newAssignment]);
    }
  };
  
  // ลบการกำหนดทีม
  const removeAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
  };
  
  return {
    teams,
    courses,
    assignments,
    assignTeam,
    removeAssignment
  };
};

export default useTeamAssignment;
