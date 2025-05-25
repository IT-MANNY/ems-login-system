
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Users, Settings, Calendar, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TrainingHistoryCard from "@/components/training/TrainingHistoryCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

// Mock data for personal training history
const PERSONAL_TRAINING_HISTORY = [
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
  const { hasRole } = useUser();

  const canManage = hasRole(['manager', 'admin']);

  // Filter training history
  const filteredHistory = PERSONAL_TRAINING_HISTORY.filter(training => {
    const matchesSearch = training.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    
    const matchesMonth = monthFilter === "all" || 
                        (monthFilter && training.date.includes(`-${monthFilter}-`));
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Simple stats
  const completedCount = filteredHistory.filter(t => t.status === "completed").length;
  const upcomingCount = filteredHistory.filter(t => t.status === "upcoming").length;
  const totalHours = filteredHistory
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + parseInt(t.duration), 0);

  return (
    <Layout title="ประวัติงานอบรม">
      <div className="space-y-6">
        {/* Simple Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ประวัติงานอบรม</h1>
                <p className="text-gray-600">งานที่เคยดูแลและกำลังจะมา</p>
              </div>
            </div>
            {canManage && (
              <Button 
                onClick={() => navigate('/manage-trainings')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                จัดการระบบ
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">{completedCount}</div>
                <div className="text-sm text-green-600">งานที่เสร็จแล้ว</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-800">{upcomingCount}</div>
                <div className="text-sm text-blue-600">งานที่กำลังจะมา</div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-800">{totalHours}</div>
                <div className="text-sm text-purple-600">ชั่วโมงงานรวม</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาหลักสูตร หรือ บริษัท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                <SelectItem value="upcoming">กำลังจะมา</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="เดือน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกเดือน</SelectItem>
                <SelectItem value="03">มีนาคม</SelectItem>
                <SelectItem value="04">เมษายน</SelectItem>
                <SelectItem value="06">มิถุนายน</SelectItem>
                <SelectItem value="07">กรกฎาคม</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Training History List */}
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((training) => (
              <TrainingHistoryCard key={training.id} training={training} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500 mb-2">ไม่พบประวัติงานอบรม</p>
              <p className="text-sm text-gray-400">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Training;
