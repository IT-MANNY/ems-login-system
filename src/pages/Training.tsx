
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Users, Plus, Settings, BarChart3 } from "lucide-react";
import TrainingDashboard from "@/components/training/TrainingDashboard";
import { useNavigate } from "react-router-dom";

// Mock data for team training management history
const TEAM_TRAINING_HISTORY = [
  {
    id: "TH001",
    courseId: "C001",
    courseName: "การพัฒนาทักษะการสื่อสารในองค์กร",
    date: "2025-03-15",
    location: "ห้องประชุมใหญ่ สำนักงานใหญ่",
    company: "Training Excellence Co., Ltd.",
    instructor: "ดร.สมชาย ใจดี",
    duration: "6 ชั่วโมง",
    participants: 25,
    capacity: 30,
    status: "completed",
    teamMembers: ["สุรชัย มานะ", "วิภาพร ใจดี", "นภาพร วงศ์สกุล"],
    vehicle: "รถตู้ 1",
    notes: "งานสำเร็จเรียบร้อย ผู้เข้าร่วมให้ความร่วมมือดี",
    rating: 4.8,
    feedback: "ทีมงานประสานงานได้ดีมาก"
  },
  {
    id: "TH002", 
    courseId: "C002",
    courseName: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    date: "2025-04-22",
    location: "ห้องอบรม 2 อาคาร B",
    company: "Time Management Institute",
    instructor: "คุณวิภา เวลาทอง",
    duration: "3 ชั่วโมง",
    participants: 20,
    capacity: 25,
    status: "completed",
    teamMembers: ["วิภาพร ใจดี", "พิไลพร จริยา"],
    vehicle: "รถเก๋ง 1",
    notes: "อุปกรณ์เสียงมีปัญหาเล็กน้อยในช่วงแรก",
    rating: 4.5,
    feedback: "แก้ไขปัญหาได้รวดเร็ว"
  },
  {
    id: "TH003",
    courseId: "C003", 
    courseName: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    date: "2025-06-10",
    location: "ห้องประชุม Innovation Hub",
    company: "TechTrain Thailand", 
    instructor: "คุณสมศักดิ์ เทคโนโลยี",
    duration: "6 ชั่วโมง",
    participants: 18,
    capacity: 20,
    status: "upcoming",
    teamMembers: ["ธนกร พัฒนา", "วีระพงษ์ สุขใจ", "มนัส พากเพียร"],
    vehicle: "รถตู้ 2",
    notes: "เตรียมอุปกรณ์โสตทัศนูปกรณ์พิเศษ",
    rating: null,
    feedback: null
  },
  {
    id: "TH004",
    courseId: "C004",
    courseName: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ", 
    date: "2025-07-05",
    location: "ศูนย์อบรมดิจิทัล",
    company: "Data Decision Co., Ltd.",
    instructor: "ดร.วิเคราะห์ ข้อมูลดี",
    duration: "12 ชั่วโมง",
    participants: 10,
    capacity: 15,
    status: "upcoming",
    teamMembers: ["สุรชัย มานะ", "วิภาพร ใจดี", "ธนกร พัฒนา", "นภาพร วงศ์สกุล"],
    vehicle: "รถตู้ 1",
    notes: "งานใหญ่ ต้องการทีมงานเยอะ",
    rating: null,
    feedback: null
  },
  {
    id: "TH005",
    courseId: "C005",
    courseName: "กฎหมายแรงงานที่หัวหน้างานควรรู้",
    date: "2025-03-30", 
    location: "ห้องกฎหมาย อาคารสำนักงานใหญ่",
    company: "Legal Expert Team",
    instructor: "ทนายวิชัย กฎหมาย",
    duration: "6 ชั่วโมง",
    participants: 35,
    capacity: 40,
    status: "completed",
    teamMembers: ["สุรชัย มานะ", "พิไลพร จริยา", "มนัส พากเพียร"],
    vehicle: "รถบัส",
    notes: "ผู้เข้าร่วมเยอะ ต้องใช้รถบัส",
    rating: 4.9,
    feedback: "ประสานงานดีเยี่ยม"
  }
];

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const navigate = useNavigate();

  // Filter training history
  const filteredHistory = TEAM_TRAINING_HISTORY.filter(training => {
    const matchesSearch = training.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.teamMembers.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    
    const matchesMonth = monthFilter === "all" || 
                        (monthFilter && training.date.includes(`-${monthFilter}-`));
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  return (
    <Layout title="ประวัติการดูแลงานอบรม">
      <div className="space-y-6">
        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">ระบบจัดการงานอบรม</h1>
                <p className="text-blue-100 text-lg">
                  จัดการทีมงาน วางแผนการอบรม และติดตามผลการดำเนินงานแบบครบวงจร
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/manage-trainings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                จัดการระบบ
              </Button>
              <Button 
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate('/manage-trainings')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                วางแผนงาน
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <TrainingDashboard
          trainings={TEAM_TRAINING_HISTORY}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
          filteredHistory={filteredHistory}
        />
      </div>
    </Layout>
  );
};

export default Training;
