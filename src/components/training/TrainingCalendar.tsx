
import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Search, Filter, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// ข้อมูลตัวอย่างสำหรับปฏิทินการอบรม
const MOCK_EVENTS = [
  {
    id: "TR001",
    title: "การพัฒนาทักษะการสื่อสารในองค์กร",
    date: "2025-06-15",
    teams: 2,
    status: "confirmed",
    type: "Soft Skills",
    capacity: 30,
    registered: 25
  },
  {
    id: "TR002",
    title: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    date: "2025-06-18",
    teams: 1,
    status: "needsTeam",
    type: "Productivity",
    capacity: 25,
    registered: 10
  },
  {
    id: "TR003",
    title: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    date: "2025-06-22",
    teams: 3,
    status: "confirmed",
    type: "Technical",
    capacity: 20,
    registered: 18
  },
  {
    id: "TR004",
    title: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    date: "2025-07-05",
    teams: 0,
    status: "needsTeam",
    type: "Technical",
    capacity: 15,
    registered: 5
  },
  {
    id: "TR005",
    title: "หลักการออกแบบ UX/UI เบื้องต้น",
    date: "2025-06-10",
    teams: 2,
    status: "confirmed",
    type: "Design",
    capacity: 20,
    registered: 20
  },
  {
    id: "TR006",
    title: "การทำงานเป็นทีมอย่างมีประสิทธิภาพ",
    date: "2025-06-28",
    teams: 1,
    status: "confirmed",
    type: "Soft Skills",
    capacity: 30,
    registered: 28
  },
  {
    id: "TR007",
    title: "การเขียนโปรแกรม Python เบื้องต้น",
    date: "2025-07-10",
    teams: 0,
    status: "needsTeam",
    type: "Technical",
    capacity: 15,
    registered: 12
  }
];

// วันในสัปดาห์
const WEEKDAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

// ชื่อเดือนในภาษาไทย
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// ประเภทหลักสูตรทั้งหมด
const COURSE_TYPES = ["Soft Skills", "Technical", "Productivity", "Design"];

const TrainingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);
  
  // สร้างวันแรกของเดือน
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // หาวันแรกที่จะแสดงในปฏิทิน (อาจจะเป็นเดือนก่อนหน้า)
  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(startDay.getDate() - startDay.getDay());
  
  // สร้าง array สำหรับวันที่จะแสดงในปฏิทิน (6 สัปดาห์)
  const calendarDays = Array(42).fill(null).map((_, i) => {
    const day = new Date(startDay);
    day.setDate(startDay.getDate() + i);
    return day;
  });
  
  // เปลี่ยนเดือน
  const changeMonth = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + amount);
    setCurrentDate(newDate);
  };

  // กรองและค้นหากิจกรรม
  const filterEvents = () => {
    let filteredEvents = [...MOCK_EVENTS];
    
    // กรองตามคำค้นหา
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // กรองตามสถานะ
    if (selectedStatus.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedStatus.includes(event.status)
      );
    }
    
    // กรองตามประเภท
    if (selectedTypes.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedTypes.includes(event.type)
      );
    }
    
    // กรองตามวันที่
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      filteredEvents = filteredEvents.filter(event => event.date === dateString);
    }
    
    // เรียงลำดับ
    if (sortBy === "date") {
      filteredEvents.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sortBy === "title") {
      filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "registration") {
      filteredEvents.sort((a, b) => (b.registered / b.capacity) - (a.registered / a.capacity));
    }
    
    return filteredEvents;
  };
  
  const filteredEvents = filterEvents();
  
  // หากิจกรรมในวันนั้นๆ
  const getEventsForDay = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return filteredEvents.filter(event => event.date === dateString);
  };
  
  // แสดงปีเป็นพุทธศักราช
  const getBuddhistYear = (date: Date) => {
    return date.getFullYear() + 543;
  };

  // สลับสถานะการเลือก
  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // สลับประเภทการเลือก
  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // รีเซ็ตตัวกรอง
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus([]);
    setSelectedTypes([]);
    setSelectedDate(undefined);
    setSortBy(null);
  };
  
  // แสดงรายละเอียดกิจกรรม
  const toggleEventDetails = (eventId: string) => {
    setShowDetailsId(prev => prev === eventId ? null : eventId);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {THAI_MONTHS[currentDate.getMonth()]} {getBuddhistYear(currentDate)}
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="ค้นหาหลักสูตร..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          {/* ตัวกรองสถานะ */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>สถานะ</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem 
                checked={selectedStatus.includes("confirmed")} 
                onCheckedChange={() => toggleStatus("confirmed")}
              >
                มีทีมพร้อมแล้ว
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={selectedStatus.includes("needsTeam")} 
                onCheckedChange={() => toggleStatus("needsTeam")}
              >
                ต้องการทีม
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* ตัวกรองประเภท */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>ประเภท</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {COURSE_TYPES.map((type) => (
                <DropdownMenuCheckboxItem 
                  key={type}
                  checked={selectedTypes.includes(type)} 
                  onCheckedChange={() => toggleType(type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* ตัวเลือกวันที่ */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "เลือกวันที่"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {/* ตัวเลือกการเรียงลำดับ */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowDownUp className="h-4 w-4" />
                <span>เรียงลำดับ</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem 
                checked={sortBy === "date"} 
                onCheckedChange={() => setSortBy(sortBy === "date" ? null : "date")}
              >
                ตามวันที่
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sortBy === "title"} 
                onCheckedChange={() => setSortBy(sortBy === "title" ? null : "title")}
              >
                ตามชื่อหลักสูตร
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem 
                checked={sortBy === "registration"} 
                onCheckedChange={() => setSortBy(sortBy === "registration" ? null : "registration")}
              >
                ตามอัตราการลงทะเบียน
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* ปุ่มรีเซ็ตตัวกรอง */}
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            รีเซ็ต
          </Button>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>วันนี้</Button>
          <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* แสดงผลสรุป */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">การอบรมในเดือนนี้</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">
              {filteredEvents.filter(event => event.date.startsWith(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)
              ).length} หลักสูตร
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">ต้องการทีมงานเพิ่ม</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold text-amber-600">
              {filteredEvents.filter(event => event.status === "needsTeam").length} หลักสูตร
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">จำนวนที่นั่งรวม</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">
              {filteredEvents.reduce((sum, event) => sum + event.capacity, 0)} ที่นั่ง
            </div>
            <div className="text-sm text-muted-foreground">
              จองแล้ว {Math.round(filteredEvents.reduce((sum, event) => sum + event.registered, 0) / filteredEvents.reduce((sum, event) => sum + event.capacity, 0) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day, index) => (
          <div key={day} className={`text-center py-2 font-semibold text-sm ${index === 0 ? 'text-red-500' : ''}`}>
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const events = getEventsForDay(day);
          const isSunday = day.getDay() === 0;
          
          return (
            <div 
              key={index}
              className={`min-h-28 p-1 border ${isCurrentMonth ? '' : 'bg-gray-50'} 
                ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'} 
                ${isSunday ? 'text-red-500' : ''} relative`}
            >
              <div className="text-right p-1">
                <span className={`inline-flex items-center justify-center ${isToday ? 'bg-blue-100 text-blue-700 w-6 h-6 rounded-full' : ''}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1">
                {events.map(event => (
                  <Card 
                    key={event.id} 
                    className={`p-1 cursor-pointer hover:bg-gray-50 ${showDetailsId === event.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => toggleEventDetails(event.id)}
                  >
                    <CardContent className="p-2">
                      <div className="text-xs font-medium truncate">{event.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="text-xs text-gray-600">{event.teams}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            event.status === 'confirmed' 
                              ? 'bg-green-50 text-green-800 border-green-200' 
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {event.status === 'confirmed' ? 'พร้อม' : 'ต้องการทีม'}
                        </Badge>
                      </div>
                      
                      {/* รายละเอียดเพิ่มเติมเมื่อคลิก */}
                      {showDetailsId === event.id && (
                        <div className="mt-2 pt-2 border-t text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>ประเภท:</span>
                            <span>{event.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>จำนวน:</span>
                            <span>{event.registered}/{event.capacity}</span>
                          </div>
                          <Button size="sm" className="w-full mt-1 h-6 text-xs" variant="outline">
                            จัดการทีม
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-2 mt-4 flex-wrap">
        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
          ต้องการทีม
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
          มีทีมพร้อมแล้ว
        </Badge>
        <div className="ml-auto text-sm text-gray-500">
          แสดงผล {filteredEvents.length} รายการ
        </div>
      </div>
    </div>
  );
};

export default TrainingCalendar;
