
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, ClipboardList, Shield, Info } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TrainingCalendar from "@/components/training/TrainingCalendar";
import TrainingCourseList from "@/components/training/TrainingCourseList";
import TrainingTeamPlanner from "@/components/training/TrainingTeamPlanner";

const ManageTrainings = () => {
  const [activeTab, setActiveTab] = useState("planner");
  const { hasRole } = useUser();

  const canManage = hasRole(['manager', 'admin']);

  if (!canManage) {
    return (
      <Layout title="จัดการแผนอบรม">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-red-700 mb-4">
              การจัดการแผนอบรมเฉพาะผู้จัดการขึ้นไปเท่านั้น
            </p>
            <p className="text-sm text-red-600">
              กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การเข้าถึง
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="จัดการแผนอบรม">
      <div className="space-y-6">
        {/* คำแนะนำการใช้งาน */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
              <Info className="h-5 w-5" />
              วิธีการใช้งาน
              <Badge className="bg-green-100 text-green-800 text-xs ml-auto">ผู้จัดการ+</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">วางแผนทีมงาน</p>
                  <p className="text-blue-700">จัดเจ้าหน้าที่และรถสำหรับแต่ละหลักสูตร</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">ดูปฏิทิน</p>
                  <p className="text-blue-700">ตรวจสอบภาพรวมการอบรมทั้งเดือน</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">จัดการหลักสูตร</p>
                  <p className="text-blue-700">ดูรายละเอียดและสถานะหลักสูตร</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* เมนูหลัก */}
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">วางแผนทีมงาน</span>
              <span className="sm:hidden">ทีมงาน</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">ปฏิทินการอบรม</span>
              <span className="sm:hidden">ปฏิทิน</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">รายการหลักสูตร</span>
              <span className="sm:hidden">หลักสูตร</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="mt-0">
            <TrainingTeamPlanner />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <TrainingCalendar />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-0">
            <TrainingCourseList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManageTrainings;
