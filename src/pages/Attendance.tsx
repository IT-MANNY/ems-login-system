
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
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

// ข้อมูลจำลองสำหรับประวัติการเข้างาน
const MOCK_ATTENDANCE_DATA = [
  {
    date: "2025-05-01",
    timeIn: "08:55:23",
    timeOut: "17:30:45",
    hoursWorked: 8.5,
    status: "ปกติ"
  },
  {
    date: "2025-05-02",
    timeIn: "08:30:11",
    timeOut: "17:35:22",
    hoursWorked: 9,
    status: "ปกติ"
  },
  {
    date: "2025-05-03",
    timeIn: "08:45:33",
    timeOut: "17:15:10",
    hoursWorked: 8.5,
    status: "ปกติ"
  },
  {
    date: "2025-05-06",
    timeIn: "09:15:42",
    timeOut: "17:45:05",
    hoursWorked: 8.5,
    status: "เข้างานสาย"
  },
  {
    date: "2025-05-07",
    timeIn: "08:55:27",
    timeOut: "17:30:18",
    hoursWorked: 8.5,
    status: "ปกติ"
  },
  {
    date: "2025-05-08",
    timeIn: "08:50:36",
    timeOut: "17:25:51",
    hoursWorked: 8.5,
    status: "ปกติ"
  },
  {
    date: "2025-05-09",
    timeIn: "08:30:14",
    timeOut: "17:45:30",
    hoursWorked: 9.25,
    status: "ปกติ"
  },
  {
    date: "2025-05-10",
    timeIn: "08:27:55",
    timeOut: "18:15:02",
    hoursWorked: 9.75,
    status: "OT"
  }
];

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(5); // May
  const [currentYear, setCurrentYear] = useState<number>(2025);
  
  // ฟังก์ชันสำหรับการเปลี่ยนเดือน
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // กรองข้อมูลตามเดือนและปีปัจจุบัน
  const filteredData = MOCK_ATTENDANCE_DATA.filter(record => {
    const date = new Date(record.date);
    return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
  });
  
  // ฟอแมตเดือนเป็นภาษาไทย
  const formatThaiMonth = (month: number): string => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return thaiMonths[month - 1];
  };
  
  // ฟอแมตวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${formatThaiMonth(date.getMonth() + 1)} ${date.getFullYear() + 543}`;
  };

  return (
    <Layout title="ประวัติการเข้างาน">
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">สรุปการเข้างานประจำเดือน</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={goToPrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 font-medium">
                {formatThaiMonth(currentMonth)} {currentYear + 543}
              </span>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-600">จำนวนวันทำงาน</p>
              <p className="text-2xl font-semibold text-blue-800">{filteredData.length} วัน</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-green-600">เข้างานตรงเวลา</p>
              <p className="text-2xl font-semibold text-green-800">
                {filteredData.filter(d => d.status === "ปกติ").length} วัน
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <p className="text-sm text-amber-600">เข้างานสาย</p>
              <p className="text-2xl font-semibold text-amber-800">
                {filteredData.filter(d => d.status === "เข้างานสาย").length} วัน
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <p className="text-sm text-purple-600">วันที่มี OT</p>
              <p className="text-2xl font-semibold text-purple-800">
                {filteredData.filter(d => d.status === "OT").length} วัน
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>เวลาเข้างาน</TableHead>
                  <TableHead>เวลาออกงาน</TableHead>
                  <TableHead>ชั่วโมงทำงาน</TableHead>
                  <TableHead>สถานะ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatThaiDate(record.date)}</TableCell>
                      <TableCell>{record.timeIn}</TableCell>
                      <TableCell>{record.timeOut}</TableCell>
                      <TableCell>{record.hoursWorked} ชั่วโมง</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.status === "ปกติ" ? "bg-green-100 text-green-800" :
                          record.status === "เข้างานสาย" ? "bg-amber-100 text-amber-800" :
                          record.status === "OT" ? "bg-purple-100 text-purple-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 italic">
                      ไม่พบข้อมูลการเข้างานในเดือนนี้
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">คำแนะนำ</h2>
          <p className="text-gray-600 mb-4">
            - ข้อมูลการเข้า-ออกงานของท่านจะถูกบันทึกโดยอัตโนมัติผ่านระบบสแกนลายนิ้วมือ
          </p>
          <p className="text-gray-600 mb-4">
            - หากพบข้อมูลไม่ถูกต้อง โปรดแจ้งฝ่ายทรัพยากรบุคคลภายใน 7 วันหลังจากวันที่มีปัญหา
          </p>
          <p className="text-gray-600">
            - เวลาเข้างานมาตรฐาน: 08:30 น. - 17:30 น.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
