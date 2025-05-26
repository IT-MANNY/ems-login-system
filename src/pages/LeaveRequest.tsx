
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload, FileText, Clock, Timer, Sun, Sunset } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const leaveFormSchema = z.object({
  type: z.string().min(1, "กรุณาเลือกประเภทการลา"),
  leaveMode: z.enum(["full-day", "half-day", "hourly"], { required_error: "กรุณาเลือกรูปแบบการลา" }),
  date: z.date({ required_error: "กรุณาเลือกวันที่ลา" }),
  endDate: z.date().optional(),
  halfDayPeriod: z.enum(["morning", "afternoon"]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().min(10, "กรุณาระบุเหตุผลอย่างน้อย 10 ตัวอักษร"),
  attachment: z.any().optional()
});

type LeaveFormData = z.infer<typeof leaveFormSchema>;

// ข้อมูลจำลองประวัติการลา
const MOCK_LEAVE_HISTORY = [
  {
    id: "LV-2025-001",
    type: "sick",
    mode: "half-day",
    date: "2025-04-15",
    period: "morning",
    reason: "ไม่สบาย มีไข้",
    status: "approved",
    submittedAt: "2025-04-12T10:30:00",
    approvedBy: "สมศรี รักงาน"
  },
  {
    id: "LV-2025-002",
    type: "vacation",
    mode: "full-day",
    date: "2025-03-20",
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
    mode: "hourly",
    date: "2025-05-30",
    startTime: "14:00",
    endTime: "16:00",
    reason: "ธุระส่วนตัว",
    status: "pending",
    submittedAt: "2025-05-25T09:15:00"
  }
];

const LeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<"request" | "history">("request");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveMode: "full-day"
    }
  });

  const leaveMode = form.watch("leaveMode");

  const calculateLeaveDuration = (mode: string, startDate: Date, endDate?: Date, startTime?: string, endTime?: string): string => {
    if (mode === "hourly" && startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return `${hours} ชั่วโมง`;
    }
    
    if (mode === "half-day") {
      return "0.5 วัน";
    }
    
    if (mode === "full-day" && endDate) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return `${days} วัน`;
    }
    
    return "1 วัน";
  };

  const onSubmit = (data: LeaveFormData) => {
    const duration = calculateLeaveDuration(
      data.leaveMode, 
      data.date, 
      data.endDate, 
      data.startTime, 
      data.endTime
    );
    
    console.log("ส่งคำขอลางาน:", {
      ...data,
      duration,
      date: format(data.date, "yyyy-MM-dd"),
      endDate: data.endDate ? format(data.endDate, "yyyy-MM-dd") : undefined
    });

    const modeText = data.leaveMode === "hourly" ? "ลาเป็นชั่วโมง" : 
                     data.leaveMode === "half-day" ? "ลาครึ่งวัน" : "ลาเต็มวัน";

    toast({
      title: "ส่งคำขอลางานสำเร็จ",
      description: `คำขอ${getLeaveTypeText(data.type)} ${modeText} (${duration}) ได้ถูกส่งไปยังผู้จัดการแล้ว`,
    });

    form.reset();
    setSelectedDate(undefined);
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

  const formatLeaveDisplay = (leave: any): string => {
    if (leave.mode === "hourly") {
      return `${leave.startTime} - ${leave.endTime}`;
    }
    if (leave.mode === "half-day") {
      return leave.period === "morning" ? "เช้า (08:00-12:00)" : "บ่าย (13:00-17:00)";
    }
    if (leave.endDate) {
      return `${formatThaiDate(leave.date)} - ${formatThaiDate(leave.endDate)}`;
    }
    return formatThaiDate(leave.date);
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
                {/* ประเภทการลา */}
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

                {/* รูปแบบการลา */}
                <div className="space-y-3">
                  <Label>รูปแบบการลา *</Label>
                  <RadioGroup 
                    value={leaveMode} 
                    onValueChange={(value) => form.setValue("leaveMode", value as any)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="full-day" id="full-day" />
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-blue-600" />
                        <Label htmlFor="full-day" className="cursor-pointer">ลาเต็มวัน</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="half-day" id="half-day" />
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-orange-600" />
                        <Label htmlFor="half-day" className="cursor-pointer">ลาครึ่งวัน</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="hourly" id="hourly" />
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-green-600" />
                        <Label htmlFor="hourly" className="cursor-pointer">ลาเป็นชั่วโมง</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* วันที่ลา */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>{leaveMode === "full-day" ? "วันที่เริ่มลา" : "วันที่ลา"} *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "เลือกวันที่"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) form.setValue("date", date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {leaveMode === "full-day" && (
                    <div className="space-y-2">
                      <Label>วันสุดท้ายที่ลา</Label>
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
                            {endDate ? format(endDate, "dd/MM/yyyy") : "เลือกวันที่ (ถ้าลาหลายวัน)"}
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
                            disabled={(date) => date < (selectedDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                {/* ช่วงเวลาสำหรับลาครึ่งวัน */}
                {leaveMode === "half-day" && (
                  <div className="space-y-3">
                    <Label>ช่วงเวลา *</Label>
                    <RadioGroup 
                      onValueChange={(value) => form.setValue("halfDayPeriod", value as any)}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="morning" id="morning" />
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <Label htmlFor="morning" className="cursor-pointer">
                            <div>
                              <div className="font-medium">เช้า</div>
                              <div className="text-sm text-gray-500">08:00 - 12:00</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <div className="flex items-center gap-2">
                          <Sunset className="h-4 w-4 text-orange-500" />
                          <Label htmlFor="afternoon" className="cursor-pointer">
                            <div>
                              <div className="font-medium">บ่าย</div>
                              <div className="text-sm text-gray-500">13:00 - 17:00</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* เวลาสำหรับลาเป็นชั่วโมง */}
                {leaveMode === "hourly" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>เวลาเริ่ม *</Label>
                      <Input
                        type="time"
                        {...form.register("startTime")}
                        min="08:00"
                        max="17:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>เวลาสิ้นสุด *</Label>
                      <Input
                        type="time"
                        {...form.register("endTime")}
                        min="08:00"
                        max="17:00"
                      />
                    </div>
                  </div>
                )}

                {/* แสดงระยะเวลาการลา */}
                {selectedDate && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <Label className="text-blue-700 font-medium">ระยะเวลาการลา</Label>
                    </div>
                    <p className="text-lg font-semibold text-blue-700">
                      {calculateLeaveDuration(
                        leaveMode, 
                        selectedDate, 
                        endDate, 
                        form.watch("startTime"), 
                        form.watch("endTime")
                      )}
                    </p>
                  </div>
                )}

                {/* เหตุผลการลา */}
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

                {/* เอกสารแนบ */}
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
                      <TableHead>รูปแบบ</TableHead>
                      <TableHead>วันที่/เวลา</TableHead>
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
                          <Badge variant="outline">
                            {leave.mode === "hourly" ? "ชั่วโมง" : 
                             leave.mode === "half-day" ? "ครึ่งวัน" : "เต็มวัน"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatLeaveDisplay(leave)}</TableCell>
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
