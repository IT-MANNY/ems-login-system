
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { OTRequest as OTRequestType } from "@/types/user";

// Mock data for demonstration
const MOCK_OT_REQUESTS: OTRequestType[] = [
  {
    id: "ot-001",
    username: "user1",
    date: "2025-05-15",
    startTime: "17:30",
    endTime: "19:30",
    reason: "ทำรายงานสรุปยอดขายประจำเดือน",
    status: "approved",
    approverUsername: "manager1",
    createdAt: "2025-05-12T10:30:00Z",
    updatedAt: "2025-05-13T08:15:00Z"
  },
  {
    id: "ot-002",
    username: "user1",
    date: "2025-05-18",
    startTime: "17:30",
    endTime: "20:00",
    reason: "จัดเตรียมเอกสารสำหรับการประชุมวันพรุ่งนี้",
    status: "pending",
    approverUsername: "manager1",
    createdAt: "2025-05-16T14:20:00Z",
    updatedAt: "2025-05-16T14:20:00Z"
  }
];

const OTRequest = () => {
  const { currentUser } = useUser();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!date) {
      toast({
        title: "กรุณาเลือกวันที่",
        variant: "destructive",
      });
      return;
    }
    
    if (!startTime || !endTime) {
      toast({
        title: "กรุณาระบุเวลาเริ่มต้นและสิ้นสุด",
        variant: "destructive",
      });
      return;
    }
    
    if (!reason.trim()) {
      toast({
        title: "กรุณาระบุเหตุผล/รายละเอียดงาน",
        variant: "destructive",
      });
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast({
        title: "ส่งคำขออนุมัติ OT สำเร็จ",
        description: "คำขอของคุณถูกส่งไปยังผู้อนุมัติแล้ว",
      });
      
      // Reset form
      setDate(undefined);
      setStartTime("");
      setEndTime("");
      setReason("");
      setIsSubmitting(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">รอดำเนินการ</span>;
      case "approved":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">อนุมัติแล้ว</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">ไม่อนุมัติ</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };
  
  return (
    <Layout title="ขออนุมัติทำงานล่วงเวลา (OT)">
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="request">ยื่นคำขอ OT</TabsTrigger>
          <TabsTrigger value="history">ประวัติคำขอ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="request">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>วันที่ต้องการทำ OT</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: th }) : "เลือกวันที่"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">เวลาเริ่มต้น</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">เหตุผล/รายละเอียดงาน</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="อธิบายเหตุผลความจำเป็นและลักษณะงานที่ทำ OT ให้ชัดเจน"
                    className="min-h-[120px]"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "กำลังส่งคำขอ..." : "ส่งคำขอ"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">ประวัติการขออนุมัติ OT</h3>
              
              {MOCK_OT_REQUESTS.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>เวลา</TableHead>
                        <TableHead>เหตุผล</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_OT_REQUESTS.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            {format(new Date(request.date), "d MMM yyyy", { locale: th })}
                          </TableCell>
                          <TableCell>
                            {request.startTime} - {request.endTime}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.reason}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>ไม่พบข้อมูลประวัติการขออนุมัติ OT</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default OTRequest;
