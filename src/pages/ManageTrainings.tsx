
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, ClipboardList, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TrainingCalendar from "@/components/training/TrainingCalendar";
import TrainingCourseList from "@/components/training/TrainingCourseList";
import TrainingTeamPlanner from "@/components/training/TrainingTeamPlanner";

const ManageTrainings = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const { hasRole } = useUser();

  // เฉพาะผู้จัดการขึ้นไปเท่านั้นที่สามารถจัดการได้
  const canManage = hasRole(['manager', 'admin']);

  if (!canManage) {
    return (
      <Layout title="จัดการแผนอบรม">
        <div className="space-y-6">
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
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="จัดการแผนอบรม">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-gray-500">
              ใช้หน้านี้สำหรับการวางแผนจัดทีมงานเพื่อดูแลหลักสูตรอบรมต่างๆ คุณสามารถดูภาพรวมในมุมมองปฏิทิน จัดการรายละเอียดหลักสูตร และวางแผนจัดทีมงาน
            </p>
            <Badge className="bg-green-100 text-green-800 text-xs ml-auto">ผู้จัดการ+</Badge>
          </div>
          
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>ปฏิทินการอบรม</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span>รายการหลักสูตร</span>
              </TabsTrigger>
              <TabsTrigger value="team-planning" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>วางแผนทีมงาน</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="mt-0">
              <TrainingCalendar />
            </TabsContent>
            
            <TabsContent value="courses" className="mt-0">
              <TrainingCourseList />
            </TabsContent>
            
            <TabsContent value="team-planning" className="mt-0">
              <TrainingTeamPlanner />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ManageTrainings;
