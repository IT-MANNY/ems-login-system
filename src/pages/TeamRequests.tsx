
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Clock, Calendar, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// ข้อมูลจำลองสำหรับคำขอ OT ของทีม
const MOCK_OT_REQUESTS = [
  {
    id: "OT-2025-001",
    username: "somchai_d",
    employeeId: "EMP001",
    employeeName: "สมชาย ดีดี",
    department: "IT",
    position: "Developer",
    date: "2025-05-18",
    startTime: "17:30",
    endTime: "20:30",
    hours: 3,
    reason: "แก้ไขปัญหาระบบก่อนเริ่มใช้งานจริง",
    status: "pending",
    submittedAt: "2025-05-15T10:30:00"
  },
  {
    id: "OT-2025-002",
    username: "somying_s",
    employeeId: "EMP002",
    employeeName: "สมหญิง สดใส",
    department: "Marketing",
    position: "Marketing Coordinator",
    date: "2025-05-20",
    startTime: "18:00",
    endTime: "21:00",
    hours: 3,
    reason: "เตรียมงานนำเสนอลูกค้าสำหรับวันพรุ่งนี้",
    status: "pending",
    submittedAt: "2025-05-16T14:22:00"
  },
  {
    id: "OT-2025-003",
    username: "prawit_w",
    employeeId: "EMP003",
    employeeName: "ประวิทย์ วงศ์ดี",
    department: "Finance",
    position: "Accountant",
    date: "2025-05-25",
    startTime: "17:30",
    endTime: "19:30",
    hours: 2,
    reason: "ปิดงบประจำเดือน",
    status: "pending",
    submittedAt: "2025-05-17T09:15:00"
  }
];

// ข้อมูลจำลองสำหรับคำขอลางานของทีม
const MOCK_LEAVE_REQUESTS = [
  {
    id: "LV-2025-001",
    username: "somchai_d",
    employeeId: "EMP001",
    employeeName: "สมชาย ดีดี",
    department: "IT",
    position: "Developer",
    type: "sick",
    startDate: "2025-05-22",
    endDate: "2025-05-23",
    days: 2,
    reason: "ไม่สบาย มีไข้",
    attachment: true,
    status: "pending",
    submittedAt: "2025-05-17T11:45:00"
  },
  {
    id: "LV-2025-002",
    username: "somying_s",
    employeeId: "EMP002",
    employeeName: "สมหญิง สดใส",
    department: "Marketing",
    position: "Marketing Coordinator",
    type: "vacation",
    startDate: "2025-06-01",
    endDate: "2025-06-03",
    days: 3,
    reason: "พักผ่อนประจำปี",
    attachment: false,
    status: "pending",
    submittedAt: "2025-05-15T13:20:00"
  },
  {
    id: "LV-2025-003",
    username: "prawit_w",
    employeeId: "EMP003",
    employeeName: "ประวิทย์ วงศ์ดี",
    department: "Finance",
    position: "Accountant",
    type: "personal",
    startDate: "2025-05-29",
    endDate: "2025-05-29",
    days: 1,
    reason: "ธุระส่วนตัว",
    attachment: false,
    status: "pending",
    submittedAt: "2025-05-16T10:15:00"
  }
];

interface RequestDetailProps {
  id: string;
  isOT: boolean;
  onAction: (id: string, action: "approve" | "reject", reason?: string) => void;
}

// คอมโพเนนต์สำหรับแสดงรายละเอียดคำขอและฟอร์มการอนุมัติ/ปฏิเสธ
const RequestDetail = ({ id, isOT, onAction }: RequestDetailProps) => {
  const [reason, setReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  
  // ค้นหาข้อมูลคำขอ
  const request = isOT 
    ? MOCK_OT_REQUESTS.find(r => r.id === id)
    : MOCK_LEAVE_REQUESTS.find(r => r.id === id);
    
  if (!request) return <p>ไม่พบข้อมูลคำขอ</p>;

  // ฟอแมตวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };
  
  // แสดงข้อความประเภทการลา
  const getLeaveTypeText = (type: string): string => {
    const types: Record<string, string> = {
      sick: "ลาป่วย",
      vacation: "ลาพักร้อน",
      personal: "ลากิจ",
      maternity: "ลาคลอด"
    };
    return types[type] || type;
  };

  // ฟอแมตเวลายื่นคำขอ
  const formatSubmitTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleReject = () => {
    if (!reason.trim()) {
      toast({
        title: "กรุณาระบุเหตุผล",
        description: "โปรดระบุเหตุผลในการปฏิเสธคำขอ",
        variant: "destructive"
      });
      return;
    }
    
    onAction(id, "reject", reason);
    setIsRejectDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isOT ? "รายละเอียดคำขอ OT" : "รายละเอียดคำขอลางาน"} - {request.id}
        </h3>
        <Badge className="bg-amber-100 text-amber-800">รอการอนุมัติ</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
        <div>
          <p className="text-sm text-gray-500">ชื่อพนักงาน</p>
          <p className="font-medium">{request.employeeName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">รหัสพนักงาน</p>
          <p className="font-medium">{request.employeeId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">แผนก</p>
          <p className="font-medium">{request.department}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ตำแหน่ง</p>
          <p className="font-medium">{request.position}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">ยื่นคำขอเมื่อ</p>
          <p className="font-medium">{formatSubmitTime(request.submittedAt)}</p>
        </div>
      </div>
      
      <div className="space-y-4 bg-blue-50 p-4 rounded-md">
        {isOT ? (
          <>
            <div>
              <p className="text-sm text-blue-700">วันที่ขอทำงานล่วงเวลา</p>
              <p className="font-medium">{formatThaiDate(request.date)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">เวลาเริ่มต้น</p>
                <p className="font-medium">{(request as typeof MOCK_OT_REQUESTS[0]).startTime} น.</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">เวลาสิ้นสุด</p>
                <p className="font-medium">{(request as typeof MOCK_OT_REQUESTS[0]).endTime} น.</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-700">จำนวนชั่วโมง</p>
              <p className="font-medium">{(request as typeof MOCK_OT_REQUESTS[0]).hours} ชั่วโมง</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-blue-700">ประเภทการลา</p>
              <p className="font-medium">
                {getLeaveTypeText((request as typeof MOCK_LEAVE_REQUESTS[0]).type)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">วันที่เริ่มลา</p>
                <p className="font-medium">{formatThaiDate((request as typeof MOCK_LEAVE_REQUESTS[0]).startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">วันสุดท้ายที่ลา</p>
                <p className="font-medium">{formatThaiDate((request as typeof MOCK_LEAVE_REQUESTS[0]).endDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-700">จำนวนวันลา</p>
              <p className="font-medium">{(request as typeof MOCK_LEAVE_REQUESTS[0]).days} วัน</p>
            </div>
            {(request as typeof MOCK_LEAVE_REQUESTS[0]).attachment && (
              <div>
                <p className="text-sm text-blue-700">เอกสารแนบ</p>
                <Button variant="outline" size="sm" className="mt-1">
                  ดูเอกสาร
                </Button>
              </div>
            )}
          </>
        )}
        <div>
          <p className="text-sm text-blue-700">เหตุผล</p>
          <p className="font-medium">{request.reason}</p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">ปฏิเสธคำขอ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ปฏิเสธคำขอ</DialogTitle>
              <DialogDescription>
                กรุณาระบุเหตุผลในการปฏิเสธคำขอนี้
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="reject-reason">เหตุผลการปฏิเสธ</Label>
              <Input
                id="reject-reason"
                className="mt-2"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="ระบุเหตุผลการปฏิเสธ"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                ยกเลิก
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                ยืนยันการปฏิเสธ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button onClick={() => onAction(id, "approve")}>อนุมัติคำขอ</Button>
      </div>
    </div>
  );
};

const TeamRequests = () => {
  const [selectedTab, setSelectedTab] = useState("ot");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  // ฟังก์ชันจัดการการอนุมัติหรือปฏิเสธคำขอ
  const handleRequestAction = (id: string, action: "approve" | "reject", reason?: string) => {
    const actionText = action === "approve" ? "อนุมัติ" : "ปฏิเสธ";
    const requestType = selectedTab === "ot" ? "OT" : "ลางาน";
    
    // แสดง toast แจ้งเตือน
    toast({
      title: `${actionText}คำขอสำเร็จ`,
      description: `คุณได้${actionText}คำขอ${requestType} ${id} ${reason ? `ด้วยเหตุผล: ${reason}` : ""}`,
    });
    
    // รีเซ็ตสถานะการเลือก
    setSelectedRequestId(null);
  };
  
  // ฟอแมตวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", 
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };
  
  // แสดงข้อความประเภทการลา
  const getLeaveTypeText = (type: string): string => {
    const types: Record<string, string> = {
      sick: "ลาป่วย",
      vacation: "ลาพักร้อน",
      personal: "ลากิจ",
      maternity: "ลาคลอด"
    };
    return types[type] || type;
  };
  
  return (
    <Layout title="คำขอของทีม">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <ClipboardList className="h-8 w-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-medium">คำขอที่รอการอนุมัติ</h2>
              <p className="text-gray-500">จัดการคำขอ OT และคำขอลางานของสมาชิกในทีมของคุณ</p>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="ot">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>คำขอ OT ({MOCK_OT_REQUESTS.length})</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="leave">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>คำขอลางาน ({MOCK_LEAVE_REQUESTS.length})</span>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ot" className="mt-6">
              {selectedRequestId ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedRequestId(null)}>
                    &larr; กลับไปยังรายการคำขอ
                  </Button>
                  <RequestDetail 
                    id={selectedRequestId} 
                    isOT={true}
                    onAction={handleRequestAction}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสคำขอ</TableHead>
                        <TableHead>ชื่อพนักงาน</TableHead>
                        <TableHead>แผนก</TableHead>
                        <TableHead>วันที่ทำ OT</TableHead>
                        <TableHead>เวลา</TableHead>
                        <TableHead>ชั่วโมง</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_OT_REQUESTS.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{formatThaiDate(request.date)}</TableCell>
                          <TableCell>{request.startTime} - {request.endTime}</TableCell>
                          <TableCell>{request.hours}</TableCell>
                          <TableCell>
                            <Button 
                              variant="link" 
                              onClick={() => setSelectedRequestId(request.id)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            <TabsContent value="leave" className="mt-6">
              {selectedRequestId ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedRequestId(null)}>
                    &larr; กลับไปยังรายการคำขอ
                  </Button>
                  <RequestDetail 
                    id={selectedRequestId} 
                    isOT={false}
                    onAction={handleRequestAction}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสคำขอ</TableHead>
                        <TableHead>ชื่อพนักงาน</TableHead>
                        <TableHead>แผนก</TableHead>
                        <TableHead>ประเภทการลา</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead>จำนวนวัน</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_LEAVE_REQUESTS.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{getLeaveTypeText(request.type)}</TableCell>
                          <TableCell>{formatThaiDate(request.startDate)}</TableCell>
                          <TableCell>{request.days}</TableCell>
                          <TableCell>
                            <Button 
                              variant="link" 
                              onClick={() => setSelectedRequestId(request.id)}
                            >
                              ดูรายละเอียด
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-lg font-medium">คำแนะนำสำหรับการอนุมัติ</h3>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
            <li>ตรวจสอบข้อมูลคำขอให้ละเอียดก่อนดำเนินการอนุมัติหรือปฏิเสธ</li>
            <li>หากปฏิเสธคำขอ ควรระบุเหตุผลให้ชัดเจนเพื่อให้พนักงานเข้าใจและสามารถปรับปรุงในครั้งถัดไป</li>
            <li>คำขอที่อนุมัติแล้วจะถูกส่งไปยังผู้ดูแลระบบโดยอัตโนมัติสำหรับการดำเนินการต่อไป</li>
            <li>หากมีข้อสงสัย สามารถติดต่อฝ่ายทรัพยากรบุคคลได้ที่ <span className="text-blue-500">hr@company.com</span></li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default TeamRequests;
