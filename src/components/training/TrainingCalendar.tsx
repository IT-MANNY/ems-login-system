import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ข้อมูลตัวอย่างสำหรับปฏิทินการอบรม
const MOCK_EVENTS = [
  {
    id: "TR001",
    title: "การพัฒนาทักษะการสื่อสารในองค์กร",
    date: "2025-06-15",
    teams: 2,
    status: "confirmed"
  },
  {
    id: "TR002",
    title: "การบริหารจัดการเวลาอย่างมีประสิทธิภาพ",
    date: "2025-06-18",
    teams: 1,
    status: "needsTeam"
  },
  {
    id: "TR003",
    title: "เทคโนโลยีสมัยใหม่กับการทำงาน",
    date: "2025-06-22",
    teams: 3,
    status: "confirmed"
  },
  {
    id: "TR004",
    title: "การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ",
    date: "2025-07-05",
    teams: 0,
    status: "needsTeam"
  }
];

// วันในสัปดาห์
const WEEKDAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

// ชื่อเดือนในภาษาไทย
const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const TrainingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
  
  // หากิจกรรมในวันนั้นๆ
  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return MOCK_EVENTS.filter(event => event.date === dateString);
  };
  
  // แสดงปีเป็นพุทธศักราช
  const getBuddhistYear = (date: Date) => {
    return date.getFullYear() + 543;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">
            {THAI_MONTHS[currentDate.getMonth()]} {getBuddhistYear(currentDate)}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>วันนี้</Button>
          <Button variant="outline" size="sm" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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
              <div className="text-right p-1">{day.getDate()}</div>
              <div className="space-y-1">
                {events.map(event => (
                  <Card key={event.id} className="p-1 cursor-pointer hover:bg-gray-50">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-2 mt-4">
        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
          ต้องการทีม
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
          มีทีมพร้อมแล้ว
        </Badge>
      </div>
    </div>
  );
};

export default TrainingCalendar;
