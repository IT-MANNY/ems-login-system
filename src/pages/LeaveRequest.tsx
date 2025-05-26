
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, FileText, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const leaveFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  startDate: z.date({ required_error: "กรุณาเลือกวันที่เริ่มลา" }),
  endDate: z.date({ required_error: "กรุณาเลือกวันสิ้นสุดการลา" }),
  reason: z.string().min(10, "กรุณาระบุเหตุผลอย่างน้อย 10 ตัวอักษร"),
  attachment: z.any().optional()
});

type LeaveFormData = z.infer<typeof leaveFormSchema>;

// ข้อมูลจำลองประวัติการลา
const MOCK_LEAVE_HISTORY = [
  {
    id: "LV-2025-001",
    type: "sick",
    startDate: "2025-04-15",
    endDate: "2025-04-16",
    days: 2,
    reason: "ไม่สบาย มีไข้",
    status: "approved",
    submittedAt: "2025-04-12T10:30:00",
    approvedBy: "สมศรี รักงาน"
  },
  {
    id: "LV-2025-002",
    type: "vacation",
    startDate: "2025-03-20",
    endDate: "2025-03-22",
    days: 3,
    reason: "พักผ่อนประจำปี",
    status: "approved",
    submittedAt: "2025-03-15T14:20:00",
    approvedBy: "สมศรี รักงาน"
  },
  {
    id: "LV-2025-003",
    type: "personal",
    startDate: "2025-05-30",
    endDate: "2025-05-30",
    days: 1,
    reason: "ธุระส่วนตัว",
    status: "pending",
    submittedAt: "2025-05-25T09:15:00"
  }
];

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<"request" | "history">("request");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
  });

  const calculateDays = (start: Date, end: Date): number => {
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const onSubmit = (data: LeaveFormData) => {
    const days = calculateDays(data.startDate, data.endDate);
    
    console.log("ส่งคำขอลางาน:", {
      ...data,
      days,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      endDate: format(data.endDate, "yyyy-MM-dd")
    });

    toast({
      title: "ส่งคำขอลางานสำเร็จ",
      description: `คำขอลา${getLeaveTypeText(data.type)} ${days} วัน ได้ถูกส่งไปยังผู้จัดการแล้ว`,
    });

    form.reset();
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getLeaveTypeText = (type: string): string => {
    const types: Record<string, string> = {
      sick: "ลาป่วย",
      vacation: "ลาพักร้อน",
      personal: "ลากิจ",
      maternity: "ลาคลอด"
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, text: "รอการอนุมัติ" },
      approved: { variant: "default" as const, text: "อนุมัติ" },
      rejected: { variant: "destructive" as const, text: "ไม่อนุมัติ" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Layout title="ขอลางาน">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("request")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "request"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            ขอลางาน
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "history"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            ประวัติการลา
          </button>
        </div>

        {activeTab === "request" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                แบบฟอร์มขอลางาน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>ประเภทการลา *</Label>
                    <Select onValueChange={(value) => form.setValue("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทการลา" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">ลาป่วย</SelectItem>
                        <SelectItem value="vacation">ลาพักร้อน</SelectItem>
                        <SelectItem value="personal">ลากิจ</SelectItem>
                        <SelectItem value="maternity">ลาคลอด</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.type && (
                      <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>วันที่เริ่มลา *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd/MM/yyyy") : "เลือกวันที่"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => {
                            setStartDate(date);
                            if (date) form.setValue("startDate", date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.startDate && (
                      <p className="text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>วันสุดท้ายที่ลา *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd/MM/yyyy") : "เลือกวันที่"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => {
                            setEndDate(date);
                            if (date) form.setValue("endDate", date);
                          }}
                          disabled={(date) => date < (startDate || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.endDate && (
                      <p className="text-sm text-red-600">{form.formState.errors.endDate.message}</p>
                    )}
                  </div>

                  {startDate && endDate && (
                    <div className="space-y-2">
                      <Label>จำนวนวันลา</Label>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-lg font-semibold text-blue-700">
                          {calculateDays(startDate, endDate)} วัน
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>เหตุผลการลา *</Label>
                  <Textarea
                    placeholder="กรุณาระบุเหตุผลการลาอย่างละเอียด"
                    {...form.register("reason")}
                    rows={4}
                  />
                  {form.formState.errors.reason && (
                    <p className="text-sm text-red-600">{form.formState.errors.reason.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>เอกสารแนบ (ถ้ามี)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">คลิกเพื่ออัพโหลดไฟล์ หรือลากไฟล์มาวางที่นี่</p>
                    <p className="text-xs text-gray-400 mt-1">รองรับไฟล์ PDF, JPG, PNG (ขนาดไม่เกิน 5MB)</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    ยกเลิก
                  </Button>
                  <Button type="submit">ส่งคำขอลางาน</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                ประวัติการลา
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>รหัสคำขอ</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วันที่ลา</TableHead>
                      <TableHead>จำนวนวัน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>ผู้อนุมัติ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_LEAVE_HISTORY.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.id}</TableCell>
                        <TableCell>{getLeaveTypeText(leave.type)}</TableCell>
                        <TableCell>
                          {formatThaiDate(leave.startDate)} - {formatThaiDate(leave.endDate)}
                        </TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell>{leave.approvedBy || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default LeaveRequest;
