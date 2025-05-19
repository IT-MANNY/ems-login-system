
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, ClipboardList } from "lucide-react";
import TrainingCalendar from "@/components/training/TrainingCalendar";
import TrainingCourseList from "@/components/training/TrainingCourseList";
import TrainingTeamPlanner from "@/components/training/TrainingTeamPlanner";

const ManageTrainings = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <Layout title="จัดการแผนอบรม">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 mb-6">
            ใช้หน้านี้สำหรับการวางแผนจัดทีมงานเพื่อดูแลหลักสูตรอบรมต่างๆ คุณสามารถดูภาพรวมในมุมมองปฏิทิน จัดการรายละเอียดหลักสูตร และวางแผนจัดทีมงาน
          </p>
          
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
