
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ข้อมูลตัวอย่างสำหรับรายการหลักสูตร
const MOCK_COURSES = [
  {
    id: "C001",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    upcoming: 2,
    capacity: 30,
    duration: "6 ชั่วโมง",
    teams: [{id: "T1", name: "ทีมฝ่ายบุคคล"}, {id: "T2", name: "ทีมฝ่ายพัฒนา"}]
  },
  {
    id: "C002",
    name: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    type: "Productivity",
    upcoming: 1,
    capacity: 25,
    duration: "3 ชั่วโมง",
    teams: [{id: "T3", name: "ทีมฝ่ายบุคคล"}]
  },
  {
    id: "C003",
    name: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    type: "Technical",
    upcoming: 3,
    capacity: 20,
    duration: "6 ชั่วโมง",
    teams: [{id: "T2", name: "ทีมฝ่ายพัฒนา"}, {id: "T4", name: "ทีมไอที"}, {id: "T5", name: "ทีมนวัตกรรม"}]
  },
  {
    id: "C004",
    name: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    type: "Technical",
    upcoming: 1,
    capacity: 15,
    duration: "12 ชั่วโมง",
    teams: []
  },
  {
    id: "C005",
    name: "กฎหมายแรงงานที่หัวหน้างานควรรู้",
    type: "Required",
    upcoming: 0,
    capacity: 40,
    duration: "6 ชั่วโมง",
    teams: [{id: "T1", name: "ทีมฝ่ายบุคคล"}]
  },
  {
    id: "C006",
    name: "ความปลอดภัยในการทำงาน",
    type: "Required",
    upcoming: 4,
    capacity: 30,
    duration: "3 ชั่วโมง",
    teams: [{id: "T6", name: "ทีมความปลอดภัย"}]
  }
];

// ประเภทหลักสูตร
const COURSE_TYPES = ["ทั้งหมด", "Soft Skills", "Technical", "Productivity", "Required"];

const TrainingCourseList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ทั้งหมด");

  // กรองหลักสูตรตามคำค้นหาและประเภท
  const filteredCourses = MOCK_COURSES
    .filter(course => 
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === "ทั้งหมด" || course.type === selectedType)
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="ค้นหาหลักสูตร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {COURSE_TYPES.map((type) => (
            <Badge 
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
        
        <Button className="ml-auto">
          <Plus className="mr-2 h-4 w-4" />
          สร้างหลักสูตรใหม่
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัส</TableHead>
              <TableHead>ชื่อหลักสูตร</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>ระยะเวลา</TableHead>
              <TableHead>รอบที่กำลังจะมา</TableHead>
              <TableHead>ทีมที่ดูแลหลักสูตร</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.type}</Badge>
                  </TableCell>
                  <TableCell>{course.duration}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {course.upcoming > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{course.upcoming} รอบ</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">ไม่มีรอบกำหนด</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {course.teams.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{course.teams.length} ทีม</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        ไม่มีทีม
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  ไม่พบข้อมูลหลักสูตรที่ค้นหา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrainingCourseList;
