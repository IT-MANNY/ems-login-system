
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CalendarDays, FileText, AlertCircle } from "lucide-react";

// Mock data for demonstration
const MOCK_PENDING_REQUESTS = {
  ot: 0,
  leave: 0
};

const MOCK_LEAVE_BALANCE = {
  vacation: 10,
  sick: 30,
  personal: 5
};

const Dashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  return (
    <Layout title="หน้าหลัก">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
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
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">การดำเนินการด่วน</h3>
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
          </Card>

          {/* Status Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">สรุปสถานะ</h3>
            
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
          </Card>
        </div>

        {/* Recent Activities - Just showing placeholder for now */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">กิจกรรมล่าสุด</h3>
          <p className="text-sm text-muted-foreground mb-4">ประวัติการทำรายการล่าสุดของคุณ</p>
          
          <div className="text-center py-8 text-gray-500 italic">
            ไม่มีกิจกรรมล่าสุด
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
