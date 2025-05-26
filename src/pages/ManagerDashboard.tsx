
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Clock, 
  CalendarDays, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  FileText,
  BarChart3
} from "lucide-react";

// ข้อมูลจำลองสำหรับสถิติรวม
const TEAM_STATS = {
  totalMembers: 8,
  presentToday: 6,
  onLeave: 2,
  pendingRequests: 5,
  upcomingTrainings: 3,
  overdueReports: 1
};

// ข้อมูลจำลองสำหรับคำขอที่รอการอนุมัติ
const PENDING_REQUESTS = [
  {
    id: "OT-2025-001",
    employeeName: "สมชาย ดีดี",
    type: "OT",
    date: "2025-05-28",
    hours: 3,
    reason: "แก้ไขปัญหาระบบ",
    priority: "high",
    submittedAt: "2025-05-26T10:30:00"
  },
  {
    id: "LV-2025-001",
    employeeName: "สมหญิง สดใส",
    type: "Leave",
    date: "2025-06-01",
    days: 2,
    reason: "ลาป่วย",
    priority: "medium",
    submittedAt: "2025-05-25T14:20:00"
  },
  {
    id: "OT-2025-002",
    employeeName: "ประวิทย์ วงศ์ดี",
    type: "OT",
    date: "2025-05-30",
    hours: 2,
    reason: "ปิดงบประจำเดือน",
    priority: "medium",
    submittedAt: "2025-05-24T09:15:00"
  }
];

// ข้อมูลจำลองสำหรับสมาชิกในทีม
const TEAM_MEMBERS = [
  {
    name: "สมชาย ดีดี",
    position: "Developer",
    status: "present",
    todayHours: "08:30-17:30",
    thisMonthOT: 12,
    pendingRequests: 1
  },
  {
    name: "สมหญิง สดใส",
    position: "Marketing Coordinator",
    status: "on-leave",
    todayHours: "-",
    thisMonthOT: 8,
    pendingRequests: 1
  },
  {
    name: "ประวิทย์ วงศ์ดี",
    position: "Accountant",
    status: "present",
    todayHours: "08:45-17:30",
    thisMonthOT: 15,
    pendingRequests: 1
  },
  {
    name: "นิดา สร้างสรรค์",
    position: "Designer",
    status: "present",
    todayHours: "09:00-18:00",
    thisMonthOT: 6,
    pendingRequests: 0
  }
];

// ข้อมูลจำลองสำหรับการอบรมที่กำลังจะมา
const UPCOMING_TRAININGS = [
  {
    id: "TR-001",
    name: "Digital Marketing Workshop",
    date: "2025-06-02",
    attendees: ["สมหญิง สดใส", "นิดา สร้างสรรค์"],
    status: "confirmed"
  },
  {
    id: "TR-002",
    name: "React Development Training",
    date: "2025-06-05",
    attendees: ["สมชาย ดีดี"],
    status: "pending"
  }
];

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { icon: CheckCircle, color: "text-green-600 bg-green-100", text: "เข้างาน" },
      "on-leave": { icon: CalendarDays, color: "text-orange-600 bg-orange-100", text: "ลางาน" },
      absent: { icon: XCircle, color: "text-red-600 bg-red-100", text: "ขาดงาน" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('th-TH', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Layout title="แดชบอร์ดผู้จัดการ">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">สมาชิกทีม</p>
                  <p className="text-2xl font-bold text-blue-600">{TEAM_STATS.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">เข้างานวันนี้</p>
                  <p className="text-2xl font-bold text-green-600">{TEAM_STATS.presentToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ลางาน</p>
                  <p className="text-2xl font-bold text-orange-600">{TEAM_STATS.onLeave}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">รอการอนุมัติ</p>
                  <p className="text-2xl font-bold text-red-600">{TEAM_STATS.pendingRequests}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">อบรมที่กำลังมา</p>
                  <p className="text-2xl font-bold text-purple-600">{TEAM_STATS.upcomingTrainings}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">รายงานค้าง</p>
                  <p className="text-2xl font-bold text-gray-600">{TEAM_STATS.overdueReports}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              ภาพรวม
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              คำขอที่รอ ({PENDING_REQUESTS.length})
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              สมาชิกทีม
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>คำขอที่ต้องดำเนินการด่วน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PENDING_REQUESTS.filter(req => req.priority === "high").map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium">{request.employeeName}</p>
                          <p className="text-sm text-gray-600">{request.type === "OT" ? "OT" : "ลางาน"} - {formatDate(request.date)}</p>
                        </div>
                        <Button size="sm" variant="outline">ดูรายละเอียด</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>การอบรมที่กำลังจะมา</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {UPCOMING_TRAININGS.map((training) => (
                      <div key={training.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div>
                          <p className="font-medium">{training.name}</p>
                          <p className="text-sm text-gray-600">{formatDate(training.date)} - {training.attendees.length} คน</p>
                        </div>
                        <Badge variant={training.status === "confirmed" ? "default" : "secondary"}>
                          {training.status === "confirmed" ? "ยืนยัน" : "รอยืนยัน"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>คำขอที่รอการอนุมัติ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสคำขอ</TableHead>
                        <TableHead>พนักงาน</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead>รายละเอียด</TableHead>
                        <TableHead>ความสำคัญ</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PENDING_REQUESTS.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>{request.employeeName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {request.type === "OT" ? "OT" : "ลางาน"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(request.date)}</TableCell>
                          <TableCell>
                            {request.type === "OT" ? `${request.hours} ชม.` : `${request.days} วัน`}
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority === "high" ? "สูง" : request.priority === "medium" ? "กลาง" : "ต่ำ"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">ดู</Button>
                              <Button size="sm">อนุมัติ</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>สมาชิกในทีม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ชื่อ-นามสกุล</TableHead>
                        <TableHead>ตำแหน่ง</TableHead>
                        <TableHead>สถานะวันนี้</TableHead>
                        <TableHead>เวลาทำงาน</TableHead>
                        <TableHead>OT เดือนนี้</TableHead>
                        <TableHead>คำขอรอ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TEAM_MEMBERS.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{member.name}</TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell>{member.todayHours}</TableCell>
                          <TableCell>{member.thisMonthOT} ชม.</TableCell>
                          <TableCell>
                            {member.pendingRequests > 0 ? (
                              <Badge variant="secondary">{member.pendingRequests}</Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
