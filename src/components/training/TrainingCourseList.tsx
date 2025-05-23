
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
  Filter,
  Download,
  Upload,
  ArrowDownUp,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// ประเภทหลักสูตรทั้งหมด
const COURSE_TYPES = ["ทั้งหมด", "Soft Skills", "Technical", "Productivity", "Required", "Design"];

// ข้อมูลตัวอย่างสำหรับรายการหลักสูตร
const MOCK_COURSES = [
  {
    id: "C001",
    name: "การพัฒนาทักษะการสื่อสารในองค์กร",
    type: "Soft Skills",
    upcoming: 2,
    capacity: 30,
    duration: "6 ชั่วโมง",
    teams: [{id: "T1", name: "ทีมฝ่ายบุคคล"}, {id: "T2", name: "ทีมฝ่ายพัฒนา"}],
    description: "หลักสูตรนี้มุ่งเน้นการพัฒนาทักษะการสื่อสารภายในองค์กร ทั้งการสื่อสารระหว่างบุคคลและการสื่อสารในทีม",
    materials: ["เอกสารประกอบการอบรม", "แบบฝึกหัด", "อุปกรณ์เครื่องเขียน"],
    targetAudience: "พนักงานทุกระดับ",
    popularity: "สูง"
  },
  {
    id: "C002",
    name: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    type: "Productivity",
    upcoming: 1,
    capacity: 25,
    duration: "3 ชั่วโมง",
    teams: [{id: "T3", name: "ทีมฝ่ายบุคคล"}],
    description: "เรียนรู้เทคนิคการบริหารเวลาและการจัดลำดับความสำคัญของงานอย่างมีประสิทธิภาพ",
    materials: ["แบบฟอร์มบริหารเวลา", "เอกสารประกอบการอบรม"],
    targetAudience: "พนักงานทุกระดับ",
    popularity: "ปานกลาง"
  },
  {
    id: "C003",
    name: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    type: "Technical",
    upcoming: 3,
    capacity: 20,
    duration: "6 ชั่วโมง",
    teams: [{id: "T2", name: "ทีมฝ่ายพัฒนา"}, {id: "T4", name: "ทีมไอที"}, {id: "T5", name: "ทีมนวัตกรรม"}],
    description: "แนะนำเทคโนโลยีสมัยใหม่ที่มีผลต่อการทำงานในปัจจุบันและอนาคต",
    materials: ["คอมพิวเตอร์", "เอกสารประกอบการอบรม"],
    targetAudience: "พนักงานฝ่ายเทคโนโลยี",
    popularity: "สูง"
  },
  {
    id: "C004",
    name: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    type: "Technical",
    upcoming: 1,
    capacity: 15,
    duration: "12 ชั่วโมง",
    teams: [],
    description: "เรียนรู้การวิเคราะห์ข้อมูลพื้นฐานและการนำผลลัพธ์ไปใช้ในการตัดสินใจทางธุรกิจ",
    materials: ["คอมพิวเตอร์", "โปรแกรมวิเคราะห์ข้อมูล", "ชุดข้อมูลตัวอย่าง"],
    targetAudience: "ผู้จัดการและผู้บริหาร",
    popularity: "ปานกลาง"
  },
  {
    id: "C005",
    name: "กฎหมายแรงงานที่หัวหน้างานควรรู้",
    type: "Required",
    upcoming: 0,
    capacity: 40,
    duration: "6 ชั่วโมง",
    teams: [{id: "T1", name: "ทีมฝ่ายบุคคล"}],
    description: "ความรู้เกี่ยวกับกฎหมายแรงงานที่สำคัญสำหรับหัวหน้างานและผู้บริหาร",
    materials: ["เอกสารกฎหมาย", "กรณีศึกษา"],
    targetAudience: "หัวหน้างานและผู้บริหาร",
    popularity: "ต่ำ"
  },
  {
    id: "C006",
    name: "ความปลอดภัยในการทำงาน",
    type: "Required",
    upcoming: 4,
    capacity: 30,
    duration: "3 ชั่วโมง",
    teams: [{id: "T6", name: "ทีมความปลอดภัย"}],
    description: "มาตรฐานความปลอดภัยในการทำงานและการป้องกันอุบัติเหตุ",
    materials: ["อุปกรณ์สาธิตความปลอดภัย", "เอกสารประกอบการอบรม"],
    targetAudience: "พนักงานทุกระดับ",
    popularity: "ปานกลาง"
  },
  {
    id: "C007",
    name: "หลักการออกแบบ UX/UI เบื้องต้น",
    type: "Design",
    upcoming: 2,
    capacity: 20,
    duration: "9 ชั่วโมง",
    teams: [{id: "T5", name: "ทีมนวัตกรรม"}],
    description: "พื้นฐานการออกแบบประสบการณ์ผู้ใช้และส่วนต่อประสานกับผู้ใช้",
    materials: ["คอมพิวเตอร์", "โปรแกรมออกแบบ", "เอกสารประกอบการอบรม"],
    targetAudience: "นักออกแบบและนักพัฒนา",
    popularity: "สูง"
  }
];

const TrainingCourseList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ทั้งหมด");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("active");
  const [selectedPopularity, setSelectedPopularity] = useState<string[]>([]);

  // กรองหลักสูตรตามคำค้นหาและประเภท
  const filteredCourses = MOCK_COURSES
    .filter(course => 
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === "ทั้งหมด" || course.type === selectedType) &&
      (selectedPopularity.length === 0 || selectedPopularity.includes(course.popularity)) &&
      (currentTab === "active" ? course.upcoming > 0 : course.upcoming === 0)
    );

  // เรียงลำดับผลลัพธ์
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!sortBy) return 0;
    
    let valueA, valueB;
    
    switch (sortBy) {
      case "name":
        valueA = a.name;
        valueB = b.name;
        break;
      case "type":
        valueA = a.type;
        valueB = b.type;
        break;
      case "upcoming":
        valueA = a.upcoming;
        valueB = b.upcoming;
        break;
      case "capacity":
        valueA = a.capacity;
        valueB = b.capacity;
        break;
      case "duration":
        valueA = parseInt(a.duration);
        valueB = parseInt(b.duration);
        break;
      case "teams":
        valueA = a.teams.length;
        valueB = b.teams.length;
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // สลับการเรียงลำดับ
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // สลับการเลือกทั้งหมด
  const toggleSelectAll = () => {
    if (selectedCourses.length === sortedCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(sortedCourses.map(course => course.id));
    }
  };

  // สลับการเลือกหลักสูตร
  const toggleSelectCourse = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // จัดการความนิยม
  const togglePopularity = (popularity: string) => {
    setSelectedPopularity(prev => 
      prev.includes(popularity)
        ? prev.filter(p => p !== popularity)
        : [...prev, popularity]
    );
  };

  // บันทึกการเปลี่ยนแปลง
  const handleSaveChanges = () => {
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลหลักสูตรได้รับการอัปเดตแล้ว",
    });
  };
  
  // ลบหลักสูตร
  const handleDeleteCourse = (courseId: string) => {
    // โค้ดสำหรับลบหลักสูตร (จำลอง)
    toast({
      title: "ลบหลักสูตรสำเร็จ",
      description: `หลักสูตร ${courseId} ถูกลบออกจากระบบแล้ว`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* แผงข้อมูลสรุป */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">หลักสูตรทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{MOCK_COURSES.length}</div>
            <p className="text-xs text-muted-foreground">หลักสูตร</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">รอบที่กำลังจะมา</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-blue-600">
              {MOCK_COURSES.reduce((sum, course) => sum + course.upcoming, 0)}
            </div>
            <p className="text-xs text-muted-foreground">รอบ</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">หลักสูตรที่ต้องการทีม</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-amber-600">
              {MOCK_COURSES.filter(course => course.teams.length === 0).length}
            </div>
            <p className="text-xs text-muted-foreground">หลักสูตร</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">ทีมที่เกี่ยวข้อง</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-green-600">
              {new Set(MOCK_COURSES.flatMap(course => course.teams.map(team => team.id))).size}
            </div>
            <p className="text-xs text-muted-foreground">ทีม</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full max-w-[400px]">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="active">หลักสูตรที่กำลังดำเนินการ</TabsTrigger>
            <TabsTrigger value="inactive">หลักสูตรที่ไม่มีรอบ</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 ml-auto">
          {selectedCourses.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setSelectedCourses([])}>
              ยกเลิกเลือก ({selectedCourses.length})
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>สร้างหลักสูตรใหม่</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>สร้างหลักสูตรใหม่</DialogTitle>
                <DialogDescription>
                  กรอกข้อมูลหลักสูตรที่ต้องการสร้าง เมื่อเสร็จแล้วกดบันทึก
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="courseId" className="text-sm font-medium">รหัสหลักสูตร</label>
                    <Input id="courseId" placeholder="C000" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseName" className="text-sm font-medium">ชื่อหลักสูตร</label>
                    <Input id="courseName" placeholder="ชื่อหลักสูตร" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseType" className="text-sm font-medium">ประเภทหลักสูตร</label>
                    <select id="courseType" className="w-full border rounded p-2">
                      {COURSE_TYPES.filter(type => type !== "ทั้งหมด").map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseDuration" className="text-sm font-medium">ระยะเวลา</label>
                    <div className="flex gap-2">
                      <Input id="courseDuration" type="number" placeholder="0" />
                      <select className="border rounded p-2 w-32">
                        <option>ชั่วโมง</option>
                        <option>วัน</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="courseCapacity" className="text-sm font-medium">ความจุ (คน)</label>
                    <Input id="courseCapacity" type="number" placeholder="0" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseTarget" className="text-sm font-medium">กลุ่มเป้าหมาย</label>
                    <Input id="courseTarget" placeholder="กลุ่มเป้าหมาย" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="courseDescription" className="text-sm font-medium">คำอธิบาย</label>
                    <Textarea id="courseDescription" placeholder="คำอธิบายหลักสูตร" rows={4} />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">ยกเลิก</Button>
                </DialogClose>
                <Button onClick={handleSaveChanges}>สร้างหลักสูตร</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-64">
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
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>กรอง</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled className="font-medium">ความนิยม</DropdownMenuItem>
              <DropdownMenuCheckboxItem 
                checked={selectedPopularity.includes("สูง")} 
                onCheckedChange={() => togglePopularity("สูง")}
              >
                สูง
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedPopularity.includes("ปานกลาง")} 
                onCheckedChange={() => togglePopularity("ปานกลาง")}
              >
                ปานกลาง
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedPopularity.includes("ต่ำ")} 
                onCheckedChange={() => togglePopularity("ต่ำ")}
              >
                ต่ำ
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowDownUp className="h-4 w-4" />
                <span>เรียงลำดับ</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => toggleSort("name")}>
                ตามชื่อ {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort("type")}>
                ตามประเภท {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort("upcoming")}>
                ตามรอบที่กำลังจะมา {sortBy === "upcoming" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort("capacity")}>
                ตามความจุ {sortBy === "capacity" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleSort("teams")}>
                ตามจำนวนทีม {sortBy === "teams" && (sortOrder === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>ส่งออก</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem>
                CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem>
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox 
                  checked={
                    sortedCourses.length > 0 && 
                    selectedCourses.length === sortedCourses.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="เลือกทั้งหมด"
                />
              </TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleSort("name")}>
                รหัส/ชื่อหลักสูตร {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleSort("type")}>
                ประเภท {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleSort("duration")}>
                ระยะเวลา {sortBy === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleSort("upcoming")}>
                รอบที่กำลังจะมา {sortBy === "upcoming" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="hover:bg-muted/50 cursor-pointer" onClick={() => toggleSort("teams")}>
                ทีมที่ดูแลหลักสูตร {sortBy === "teams" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCourses.length > 0 ? (
              sortedCourses.map((course) => (
                <TableRow 
                  key={course.id}
                  className={selectedCourses.includes(course.id) ? "bg-blue-50" : ""}
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => toggleSelectCourse(course.id)}
                      aria-label={`เลือก ${course.name}`}
                    />
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer" 
                    onClick={() => setShowDetails(showDetails === course.id ? null : course.id)}
                  >
                    <div>
                      <div className="font-medium">{course.name}</div>
                      <div className="text-xs text-gray-500">{course.id}</div>
                    </div>
                  </TableCell>
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>แก้ไขหลักสูตร</DialogTitle>
                            <DialogDescription>
                              แก้ไขข้อมูลหลักสูตร {course.id}: {course.name}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            {/* ฟอร์มแก้ไขหลักสูตร */}
                            <div className="grid grid-cols-1 gap-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">รหัสหลักสูตร</label>
                                <Input defaultValue={course.id} readOnly />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">ชื่อหลักสูตร</label>
                                <Input defaultValue={course.name} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">ประเภทหลักสูตร</label>
                                <select className="w-full border rounded p-2" defaultValue={course.type}>
                                  {COURSE_TYPES.filter(type => type !== "ทั้งหมด").map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">ระยะเวลา</label>
                                <Input defaultValue={course.duration} />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">ความจุ (คน)</label>
                                <Input defaultValue={course.capacity} type="number" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">กลุ่มเป้าหมาย</label>
                                <Input defaultValue={course.targetAudience} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">คำอธิบาย</label>
                                <Textarea defaultValue={course.description} rows={4} />
                              </div>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">ยกเลิก</Button>
                            </DialogClose>
                            <Button onClick={handleSaveChanges}>บันทึกการเปลี่ยนแปลง</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>ยืนยันการลบหลักสูตร</DialogTitle>
                            <DialogDescription>
                              คุณต้องการลบหลักสูตร "{course.name}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">ยกเลิก</Button>
                            </DialogClose>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              ลบหลักสูตร
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                        onClick={() => setShowDetails(showDetails === course.id ? null : course.id)}>
                        <Info className="h-4 w-4 text-blue-500" />
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
      
      {/* แสดงรายละเอียดหลักสูตร */}
      {showDetails && (
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{sortedCourses.find(c => c.id === showDetails)?.name}</CardTitle>
            <CardDescription>{sortedCourses.find(c => c.id === showDetails)?.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">รายละเอียด</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {sortedCourses.find(c => c.id === showDetails)?.description}
                </p>
                
                <h4 className="font-semibold mb-2">กลุ่มเป้าหมาย</h4>
                <p className="text-sm text-gray-600 mb-4">
                  {sortedCourses.find(c => c.id === showDetails)?.targetAudience}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">อุปกรณ์ที่ใช้</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                  {sortedCourses.find(c => c.id === showDetails)?.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
                
                <h4 className="font-semibold mb-2">ทีมที่ดูแล</h4>
                {sortedCourses.find(c => c.id === showDetails)?.teams.length ? (
                  <div className="flex flex-wrap gap-2">
                    {sortedCourses.find(c => c.id === showDetails)?.teams.map(team => (
                      <Badge key={team.id} variant="secondary">{team.name}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600">ยังไม่มีทีมที่ได้รับมอบหมาย</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          แสดงผล {sortedCourses.length} จาก {MOCK_COURSES.length} รายการ
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>ก่อนหน้า</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm" disabled>ถัดไป</Button>
        </div>
      </div>
    </div>
  );
};

export default TrainingCourseList;
