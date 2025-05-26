
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download, Filter, Search, Upload } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ข้อมูลตัวอย่างสำหรับการแสดงผล
const sampleAttendanceData = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "สมชาย ใจดี",
    department: "ไอที",
    date: "2023-05-18",
    timeIn: "08:45",
    timeOut: "17:30",
    totalHours: "8:45",
    status: "ปกติ"
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "สมหญิง รักเรียน",
    department: "การตลาด",
    date: "2023-05-18",
    timeIn: "08:30",
    timeOut: "17:00",
    totalHours: "8:30",
    status: "ปกติ"
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "มานะ อดทน",
    department: "บัญชี",
    date: "2023-05-18",
    timeIn: "09:15",
    timeOut: "18:00",
    totalHours: "8:45",
    status: "มาสาย"
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "วิชัย พากเพียร",
    department: "ทรัพยากรบุคคล",
    date: "2023-05-18",
    timeIn: "08:00",
    timeOut: "16:45",
    totalHours: "8:45",
    status: "ปกติ"
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "ศิริพร มีสุข",
    department: "ฝ่ายขาย",
    date: "2023-05-18",
    timeIn: "08:50",
    timeOut: "17:30",
    totalHours: "8:40",
    status: "มาสาย"
  },
  {
    id: "6",
    employeeId: "EMP006",
    employeeName: "จิรา มีมานะ",
    department: "จัดซื้อ",
    date: "2023-05-18",
    timeIn: "-",
    timeOut: "-",
    totalHours: "0:00",
    status: "ขาดงาน"
  },
  {
    id: "7",
    employeeId: "EMP007",
    employeeName: "ยุทธนา สุขสมบูรณ์",
    department: "วิศวกรรม",
    date: "2023-05-18",
    timeIn: "-",
    timeOut: "-",
    totalHours: "0:00",
    status: "ลาป่วย"
  }
];

const ManageAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [attendanceData, setAttendanceData] = useState(sampleAttendanceData);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // กรองข้อมูลตามเงื่อนไขการค้นหา
  const filteredData = attendanceData.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment ? item.department === filterDepartment : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });
  
  // รายชื่อแผนกทั้งหมดที่มีอยู่ในข้อมูล
  const departments = [...new Set(attendanceData.map(item => item.department))];
  
  // รายการสถานะทั้งหมดที่มีอยู่ในข้อมูล
  const statuses = [...new Set(attendanceData.map(item => item.status))];

  // จัดการการอัพโหลดไฟล์จากเครื่องแสกนนิ้ว
  const handleFileUpload = (data) => {
    console.log("กำลังประมวลผลไฟล์จากเครื่องแสกนนิ้ว:", data.file[0].name);
    
    // จำลองการประมวลผลไฟล์จากเครื่องแสกนนิ้ว
    setTimeout(() => {
      toast({
        title: "นำเข้าข้อมูลจากเครื่องแสกนนิ้วสำเร็จ",
        description: `ประมวลผลไฟล์ ${data.file[0].name} เรียบร้อยแล้ว พบข้อมูลการเข้างาน ${filteredData.length} รายการ`,
      });
      setShowUploadForm(false);
      reset();
    }, 2000);
  };

  // จำลองการดาวน์โหลดข้อมูล
  const handleDownload = () => {
    toast({
      title: "ดาวน์โหลดข้อมูลสำเร็จ",
      description: "กำลังดาวน์โหลดข้อมูลเวลาเข้า-ออกในรูปแบบ Excel",
    });
  };

  return (
    <Layout title="จัดการข้อมูลเวลาเข้างาน">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">
          จัดการข้อมูลเวลาเข้า-ออกงานของพนักงาน โดยนำเข้าข้อมูลจากเครื่องแสกนนิ้วมือ 
          ระบบจะรองรับไฟล์ในรูปแบบ Excel และ CSV ที่ส่งออกจากเครื่องแสกนนิ้วมือ
        </p>
        
        {/* ส่วนควบคุมด้านบน */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* ตัวเลือกวันที่ */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>เลือกวันที่</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {/* ค้นหา */}
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="ค้นหาตามชื่อหรือรหัสพนักงาน"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* ปุ่มนำเข้า/ส่งออกข้อมูล */}
            <Button 
              variant="outline" 
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex items-center gap-1"
            >
              <Upload className="h-4 w-4 mr-1" />
              นำเข้าข้อมูลจากเครื่องแสกน
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownload}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4 mr-1" />
              ส่งออกข้อมูล
            </Button>
          </div>
        </div>

        {/* ฟอร์มอัพโหลดไฟล์จากเครื่องแสกนนิ้ว */}
        {showUploadForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-3">นำเข้าข้อมูลจากเครื่องแสกนนิ้วมือ</h3>
            <p className="text-sm text-gray-600 mb-4">
              อัพโหลดไฟล์ข้อมูลการเข้างานที่ส่งออกจากเครื่องแสกนนิ้วมือ 
              ระบบจะประมวลผลและจัดการข้อมูลให้อัตโนมัติ
            </p>
            
            <form onSubmit={handleSubmit(handleFileUpload)} className="space-y-4">
              <div>
                <Label htmlFor="file">เลือกไฟล์จากเครื่องแสกนนิ้วมือ</Label>
                <Input 
                  id="file" 
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  {...register("file", { required: true })} 
                />
                <p className="text-xs text-gray-500 mt-1">
                  รองรับไฟล์นามสกุล .xlsx, .xls และ .csv จากเครื่องแสกนนิ้วมือเท่านั้น
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 mb-2">คำแนะนำการใช้งาน:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• ส่งออกข้อมูลจากเครื่องแสกนนิ้วมือในรูปแบบ Excel หรือ CSV</li>
                  <li>• ตรวจสอบให้แน่ใจว่าไฟล์มีข้อมูลรหัสพนักงาน, วันที่, เวลาเข้า-ออก</li>
                  <li>• ระบบจะประมวลผลและแสดงผลข้อมูลให้อัตโนมัติ</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  อัพโหลดและประมวลผล
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadForm(false)}
                >
                  ยกเลิก
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ตัวกรองข้อมูล */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">ตัวกรอง:</span>
          </div>
          
          {/* กรองตามแผนก */}
          <select
            className="text-sm px-3 py-1 border rounded-md"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">ทุกแผนก</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          {/* กรองตามสถานะ */}
          <select
            className="text-sm px-3 py-1 border rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">ทุกสถานะ</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableCaption>
              ข้อมูลการลงเวลาจากเครื่องแสกนนิ้วมือประจำวันที่ {date ? format(date, "dd/MM/yyyy") : "ปัจจุบัน"}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">รหัสพนักงาน</TableHead>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>แผนก</TableHead>
                <TableHead>เวลาเข้า</TableHead>
                <TableHead>เวลาออก</TableHead>
                <TableHead>ชั่วโมงรวม</TableHead>
                <TableHead>สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.employeeId}</TableCell>
                    <TableCell>{item.employeeName}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.timeIn}</TableCell>
                    <TableCell>{item.timeOut}</TableCell>
                    <TableCell>{item.totalHours}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.status === "ปกติ"
                            ? "bg-green-100 text-green-800"
                            : item.status === "มาสาย"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "ขาดงาน"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    ไม่พบข้อมูลการลงเวลาที่ตรงตามเงื่อนไข
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* สรุปสถิติ */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <h4 className="font-medium text-green-700 mb-1">ปกติ</h4>
            <p className="text-2xl font-bold text-green-800">
              {attendanceData.filter(item => item.status === "ปกติ").length} คน
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <h4 className="font-medium text-yellow-700 mb-1">มาสาย</h4>
            <p className="text-2xl font-bold text-yellow-800">
              {attendanceData.filter(item => item.status === "มาสาย").length} คน
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-1">ลางาน</h4>
            <p className="text-2xl font-bold text-blue-800">
              {attendanceData.filter(item => ["ลาป่วย", "ลากิจ", "ลาพักร้อน"].includes(item.status)).length} คน
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <h4 className="font-medium text-red-700 mb-1">ขาดงาน</h4>
            <p className="text-2xl font-bold text-red-800">
              {attendanceData.filter(item => item.status === "ขาดงาน").length} คน
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAttendance;
