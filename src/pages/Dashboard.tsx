
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  CalendarDays, 
  FileText, 
  AlertCircle, 
  Bell,
  Megaphone,
  CheckCircle2,
  XCircle,
  Award
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data for demonstration
const MOCK_PENDING_REQUESTS = {
  ot: 2,
  leave: 1
};

const MOCK_LEAVE_BALANCE = {
  vacation: 10,
  sick: 30,
  personal: 5
};

// Mock data for upcoming events
const MOCK_UPCOMING_EVENTS = [
  {
    id: 1,
    title: "ประชุมประจำเดือน",
    date: "2025-05-25",
    time: "09:00 - 11:00",
    location: "ห้องประชุมใหญ่",
    type: "meeting"
  },
  {
    id: 2,
    title: "อบรม Design Thinking",
    date: "2025-05-30",
    time: "13:00 - 16:00",
    location: "ห้องอบรม 2",
    type: "training"
  }
];

// Mock data for recent activities
const MOCK_RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "leave_approved",
    message: "คำขอลาพักร้อนของคุณได้รับการอนุมัติแล้ว",
    date: "2025-05-18T14:30:00"
  },
  {
    id: 2,
    type: "training_enrolled",
    message: "คุณได้ลงทะเบียนเข้าร่วมการอบรม Design Thinking เรียบร้อยแล้ว",
    date: "2025-05-17T09:45:00"
  },
  {
    id: 3,
    type: "ot_submitted",
    message: "คุณได้ส่งคำขอทำงานล่วงเวลาสำหรับวันที่ 20 พ.ค. 2568",
    date: "2025-05-16T17:20:00"
  }
];

// Mock data for announcements
const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "นโยบายการทำงานจากบ้าน",
    message: "บริษัทได้ประกาศนโยบายการทำงานจากบ้าน 2 วันต่อสัปดาห์ เริ่มใช้ 1 มิ.ย. 2568",
    date: "2025-05-15",
    priority: "high"
  },
  {
    id: 2,
    title: "กิจกรรมกีฬาสัมพันธ์ประจำปี",
    message: "ขอเชิญชวนพนักงานทุกท่านเข้าร่วมกิจกรรมกีฬาสัมพันธ์ประจำปี วันที่ 15 มิ.ย. 2568",
    date: "2025-05-10",
    priority: "normal"
  }
];

// Mock data for team performance
const MOCK_TEAM_PERFORMANCE = [
  {
    month: "Jan",
    completion: 78,
  },
  {
    month: "Feb",
    completion: 82,
  },
  {
    month: "Mar",
    completion: 85,
  },
  {
    month: "Apr",
    completion: 92,
  },
  {
    month: "May",
    completion: 88,
  }
];

// Quick attendance check-in function
const MOCK_ATTENDANCE_STATUS = {
  lastCheckIn: "2025-05-19T08:45:00",
  lastCheckOut: null,
  status: "checked-in"
};

const Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [attendanceStatus, setAttendanceStatus] = useState(MOCK_ATTENDANCE_STATUS);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  
  useEffect(() => {
    // Display welcome message once
    if (showWelcomeMessage) {
      toast("ยินดีต้อนรับกลับ!", {
        description: `สวัสดีคุณ ${currentUser?.firstName} ${currentUser?.lastName}`,
        duration: 3000,
      });
      setShowWelcomeMessage(false);
    }
  }, [currentUser, showWelcomeMessage]);

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "ไม่มีข้อมูล";
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Intl.DateTimeFormat('th-TH', options).format(date);
  };

  // Format short date
  const formatShortDate = (dateString) => {
    if (!dateString) return "ไม่มีข้อมูล";
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('th-TH', options).format(date);
  };

  // Relative time display
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ชั่วโมงที่แล้ว`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} วันที่แล้ว`;
    }
  };

  // Handle attendance check-in/check-out
  const handleAttendanceAction = () => {
    if (attendanceStatus.status === "checked-in") {
      const newStatus = {
        ...attendanceStatus,
        lastCheckOut: new Date().toISOString(),
        status: "checked-out"
      };
      setAttendanceStatus(newStatus);
      toast.success("บันทึกเวลาออกงานเรียบร้อย", {
        description: formatDate(newStatus.lastCheckOut),
      });
    } else {
      const newStatus = {
        ...attendanceStatus,
        lastCheckIn: new Date().toISOString(),
        lastCheckOut: null,
        status: "checked-in"
      };
      setAttendanceStatus(newStatus);
      toast.success("บันทึกเวลาเข้างานเรียบร้อย", {
        description: formatDate(newStatus.lastCheckIn),
      });
    }
  };
  
  return (
    <Layout title="หน้าหลัก">
      <div className="space-y-6">
        {/* Top Section with Welcome Card and Quick Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="md:col-span-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold">
                สวัสดี, คุณ{currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="mt-2 opacity-90">
                ยินดีต้อนรับสู่ระบบจัดการข้อมูลพนักงาน (EMS)
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-md">
                  <p className="text-sm opacity-90">แผนก</p>
                  <p className="font-medium">{currentUser?.department}</p>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-md">
                  <p className="text-sm opacity-90">ตำแหน่ง</p>
                  <p className="font-medium">{currentUser?.position}</p>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-md">
                  <p className="text-sm opacity-90">รหัสพนักงาน</p>
                  <p className="font-medium">{currentUser?.employeeId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Attendance Check-in Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">บันทึกเวลาทำงาน</CardTitle>
              <CardDescription>ลงเวลาเข้า-ออกงานวันนี้</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">เวลาเข้างาน</p>
                    <p className="font-medium">{formatDate(attendanceStatus.lastCheckIn)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">เวลาออกงาน</p>
                    <p className="font-medium">{attendanceStatus.lastCheckOut ? formatDate(attendanceStatus.lastCheckOut) : '-'}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleAttendanceAction}
                  variant={attendanceStatus.status === "checked-in" ? "destructive" : "default"}
                >
                  {attendanceStatus.status === "checked-in" ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" /> บันทึกเวลาออกงาน
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" /> บันทึกเวลาเข้างาน
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">การดำเนินการด่วน</CardTitle>
              <CardDescription>จัดการงานสำคัญอย่างรวดเร็ว</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 h-auto py-4"
                  onClick={() => navigate('/ot-request')}
                >
                  <Clock size={18} />
                  <div className="text-left">
                    <div className="font-medium">ขออนุมัติ OT</div>
                    <div className="text-sm text-muted-foreground">ยื่นคำขอทำงานล่วงเวลา</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 h-auto py-4"
                  onClick={() => navigate('/leave-request')}
                >
                  <CalendarDays size={18} />
                  <div className="text-left">
                    <div className="font-medium">ขอลางาน</div>
                    <div className="text-sm text-muted-foreground">ยื่นคำขอลางานประเภทต่างๆ</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 h-auto py-4"
                  onClick={() => navigate('/attendance')}
                >
                  <FileText size={18} />
                  <div className="text-left">
                    <div className="font-medium">ประวัติการเข้างาน</div>
                    <div className="text-sm text-muted-foreground">ตรวจสอบเวลาเข้า-ออกงาน</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start gap-2 h-auto py-4"
                  onClick={() => navigate('/profile')}
                >
                  <AlertCircle size={18} />
                  <div className="text-left">
                    <div className="font-medium">ข้อมูลส่วนตัว</div>
                    <div className="text-sm text-muted-foreground">แก้ไขข้อมูลส่วนบุคคล</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">สรุปสถานะ</CardTitle>
              <CardDescription>วันลาและคำขอของคุณ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pending Requests */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">คำขอที่รอดำเนินการ</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-blue-50 border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-600">OT รอการอนุมัติ</p>
                          <p className="text-xl font-semibold text-blue-800">{MOCK_PENDING_REQUESTS.ot}</p>
                        </div>
                        <Clock className="h-8 w-8 text-blue-400" />
                      </div>
                    </Card>
                    <Card className="p-3 bg-purple-50 border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-purple-600">ลางานรอการอนุมัติ</p>
                          <p className="text-xl font-semibold text-purple-800">{MOCK_PENDING_REQUESTS.leave}</p>
                        </div>
                        <CalendarDays className="h-8 w-8 text-purple-400" />
                      </div>
                    </Card>
                  </div>
                </div>
                
                {/* Leave Balance */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">วันลาคงเหลือ</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ลาพักร้อน</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: `${(MOCK_LEAVE_BALANCE.vacation / 10) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{MOCK_LEAVE_BALANCE.vacation} วัน</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ลาป่วย</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${(MOCK_LEAVE_BALANCE.sick / 30) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{MOCK_LEAVE_BALANCE.sick} วัน</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ลากิจ</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: `${(MOCK_LEAVE_BALANCE.personal / 5) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{MOCK_LEAVE_BALANCE.personal} วัน</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Activity Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Announcements */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Megaphone className="h-5 w-5 text-blue-500 mr-2" />
                  <CardTitle className="text-lg">ประกาศบริษัท</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/announcements')}>
                  ดูทั้งหมด
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Badge variant={announcement.priority === "high" ? "destructive" : "secondary"}>
                        {announcement.priority === "high" ? "สำคัญ" : "ทั่วไป"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                    <p className="text-xs text-gray-500">{formatShortDate(announcement.date)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                <CardTitle className="text-lg">กิจกรรมที่กำลังจะมาถึง</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_UPCOMING_EVENTS.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge variant={event.type === "training" ? "outline" : "secondary"}>
                        {event.type === "training" ? "อบรม" : "ประชุม"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
                      <div>
                        <CalendarDays className="h-3 w-3 inline mr-1" />
                        <span>{formatShortDate(event.date)}</span>
                      </div>
                      <div>
                        <Clock className="h-3 w-3 inline mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">สถานที่: {event.location}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities Section */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-500 mr-2" />
                <CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activities">
              <TabsList className="grid grid-cols-2 w-[400px] mb-4">
                <TabsTrigger value="activities">กิจกรรมของฉัน</TabsTrigger>
                <TabsTrigger value="team">กิจกรรมของทีม</TabsTrigger>
              </TabsList>
              <TabsContent value="activities">
                <div className="space-y-4">
                  {MOCK_RECENT_ACTIVITIES.length > 0 ? MOCK_RECENT_ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        {activity.type === 'leave_approved' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {activity.type === 'ot_submitted' && <Clock className="h-5 w-5 text-blue-600" />}
                        {activity.type === 'training_enrolled' && <Award className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-gray-500">{getRelativeTime(activity.date)}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500 italic">
                      ไม่มีกิจกรรมล่าสุด
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="team">
                <div className="text-center py-8 text-gray-500">
                  <p className="italic mb-2">ข้อมูลกิจกรรมทีมจะปรากฏที่นี่</p>
                  <p className="text-xs">คุณจะเห็นข้อมูลนี้หากคุณเป็นผู้จัดการหรือหัวหน้าทีม</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
