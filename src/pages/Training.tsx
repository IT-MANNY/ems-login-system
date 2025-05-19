
import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Calendar,
  MapPin,
  User,
  Clock,
  Layers,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ข้อมูลจำลองสำหรับการฝึกอบรม
const MOCK_TRAINING_DATA = [
  {
    id: "TR001",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    date: "2025-03-15",
    location: "ห้องประชุมใหญ่ สำนักงานใหญ่",
    company: "Training Excellence Co., Ltd.",
    instructor: "ดร.สมชาย ใจดี",
    duration: "6 ชั่วโมง",
    status: "completed"
  },
  {
    id: "TR002",
    name: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    type: "Productivity",
    date: "2025-04-22",
    location: "ห้องอบรม 2 อาคาร B",
    company: "Time Management Institute",
    instructor: "คุณวิภา เวลาทอง",
    duration: "3 ชั่วโมง",
    status: "completed"
  },
  {
    id: "TR003",
    name: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    type: "Technical",
    date: "2025-06-10",
    location: "ห้องประชุม Innovation Hub",
    company: "TechTrain Thailand",
    instructor: "คุณสมศักดิ์ เทคโนโลยี",
    duration: "6 ชั่วโมง",
    status: "upcoming"
  },
  {
    id: "TR004",
    name: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    type: "Technical",
    date: "2025-07-05",
    location: "ศูนย์อบรมดิจิทัล",
    company: "Data Decision Co., Ltd.",
    instructor: "ดร.วิเคราะห์ ข้อมูลดี",
    duration: "12 ชั่วโมง",
    status: "upcoming"
  },
  {
    id: "TR005",
    name: "กฎหมายแรงงานที่หัวหน้างานควรรู้",
    type: "Required",
    date: "2025-03-30",
    location: "ห้องกฎหมาย อาคารสำนักงานใหญ่",
    company: "Legal Expert Team",
    instructor: "ทนายวิชัย กฎหมาย",
    duration: "6 ชั่วโมง",
    status: "completed"
  }
];

// ข้อมูลจำลองสำหรับหลักสูตรที่เปิดให้ลงทะเบียน
const MOCK_AVAILABLE_COURSES = [
  {
    id: "CR001",
    name: "ความปลอดภัยในการทำงาน",
    type: "Required",
    date: "2025-06-20",
    seats: 30,
    remaining: 12,
    duration: "3 ชั่วโมง"
  },
  {
    id: "CR002",
    name: "ทักษะการเป็นผู้นำยุคใหม่",
    type: "Leadership",
    date: "2025-06-25",
    seats: 20,
    remaining: 5,
    duration: "6 ชั่วโมง"
  },
  {
    id: "CR003",
    name: "เทคนิคการนำเสนองานอย่างมืออาชีพ",
    type: "Soft Skills",
    date: "2025-07-15",
    seats: 25,
    remaining: 15,
    duration: "6 ชั่วโมง"
  }
];

const Training = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  
  // กรองข้อมูลการอบรมตามคำค้นหา
  const filteredTrainings = MOCK_TRAINING_DATA.filter(training =>
    training.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // แสดงสถานะเป็นภาษาไทย
  const getStatusText = (status: string): string => {
    return status === "completed" ? "เสร็จสิ้น" : status === "upcoming" ? "กำลังจะมาถึง" : "ไม่ทราบสถานะ";
  };
  
  // แสดงสีของ Badge ตามสถานะ
  const getStatusColor = (status: string): string => {
    return status === "completed" ? "bg-green-100 text-green-800" : 
           status === "upcoming" ? "bg-blue-100 text-blue-800" : 
           "bg-gray-100 text-gray-800";
  };

  // ฟอแมตวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  return (
    <Layout title="ประวัติอบรม">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="max-w-md w-full">
            <Input
              placeholder="ค้นหาหลักสูตร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={() => setShowRegistration(!showRegistration)}
            variant={showRegistration ? "secondary" : "default"}
          >
            {showRegistration ? "ดูประวัติการอบรม" : "ดูหลักสูตรเปิดรับสมัคร"}
          </Button>
        </div>
        
        {!showRegistration ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">ประวัติการอบรมของคุณ</h2>
              {filteredTrainings.length > 0 ? (
                <div className="space-y-6">
                  {filteredTrainings.map((training) => (
                    <Card key={training.id} className="overflow-hidden border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{training.name}</CardTitle>
                            <CardDescription className="mt-1">{training.id} - {training.type}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(training.status)}>
                            {getStatusText(training.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{formatThaiDate(training.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{training.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{training.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{training.instructor}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 italic">
                  ไม่พบข้อมูลการอบรม
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">หลักสูตรที่เปิดรับสมัคร</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสหลักสูตร</TableHead>
                      <TableHead>ชื่อหลักสูตร</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>ระยะเวลา</TableHead>
                      <TableHead>ที่นั่งคงเหลือ</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_AVAILABLE_COURSES.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.id}</TableCell>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{formatThaiDate(course.date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-100">
                            {course.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>
                          <span className={course.remaining < 5 ? "text-amber-600 font-medium" : ""}>
                            {course.remaining}/{course.seats}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm">ลงทะเบียน</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-medium">สรุปการเข้าอบรม</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-700 mb-1">จำนวนชั่วโมงอบรมทั้งหมด</p>
                  <p className="text-2xl font-semibold text-blue-800">
                    {MOCK_TRAINING_DATA.filter(t => t.status === "completed").reduce(
                      (total, training) => total + parseInt(training.duration.split(' ')[0]), 0
                    )} ชั่วโมง
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-green-700 mb-1">หลักสูตรที่เคยผ่านการอบรม</p>
                  <p className="text-2xl font-semibold text-green-800">
                    {MOCK_TRAINING_DATA.filter(t => t.status === "completed").length} หลักสูตร
                  </p>
                </div>
                <Layers className="h-8 w-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-700 mb-1">หลักสูตรที่มีแผนจะอบรม</p>
                  <p className="text-2xl font-semibold text-purple-800">
                    {MOCK_TRAINING_DATA.filter(t => t.status === "upcoming").length} หลักสูตร
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Training;
