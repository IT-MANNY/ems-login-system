
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Search,
  Filter,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  User,
  Car,
  FileText,
} from "lucide-react";
import TrainingHistoryCard from "@/components/training/TrainingHistoryCard";
import TrainingStats from "@/components/training/TrainingStats";
import TrainingFilters from "@/components/training/TrainingFilters";

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
  const [activeTab, setActiveTab] = useState("overview");

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
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6" />
            <h1 className="text-2xl font-bold">ประวัติการดูแลงานอบรม</h1>
          </div>
          <p className="text-blue-100">
            ข้อมูลการปฏิบัติงานของทีมดูแลงานอบรม การมอบหมายงาน และผลการดำเนินงาน
          </p>
        </div>

        {/* Statistics Overview */}
        <TrainingStats trainings={TEAM_TRAINING_HISTORY} />

        {/* Filters and Search */}
        <TrainingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
        />

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              งานที่เสร็จแล้ว
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              งานที่กำลังจะมา
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((training) => (
                  <TrainingHistoryCard key={training.id} training={training} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">ไม่พบข้อมูลงานอบรม</p>
                  <p className="text-sm">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid gap-4">
              {filteredHistory.filter(t => t.status === "completed").map((training) => (
                <TrainingHistoryCard key={training.id} training={training} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-4">
              {filteredHistory.filter(t => t.status === "upcoming").map((training) => (
                <TrainingHistoryCard key={training.id} training={training} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Training;
