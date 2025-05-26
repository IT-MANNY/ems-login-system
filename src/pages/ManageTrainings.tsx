
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ClipboardList, Shield, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TrainingCalendar from "@/components/training/TrainingCalendar";
import TrainingCourseList from "@/components/training/TrainingCourseList";
import TrainingTeamPlanner from "@/components/training/TrainingTeamPlanner";
import CreateCourseForm from "@/components/training/CreateCourseForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const ManageTrainings = () => {
  const [activeTab, setActiveTab] = useState("planner");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const { hasRole } = useUser();

  const canManage = hasRole(['manager', 'admin']);

  const handleCreateCourse = (courseData: any) => {
    console.log("สร้างหลักสูตรใหม่:", courseData);
    setIsCreateFormOpen(false);
  };

  if (!canManage) {
    return (
      <Layout title="จัดการแผนอบรม">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-red-700">
              การจัดการแผนอบรมเฉพาะผู้จัดการขึ้นไปเท่านั้น
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout title="จัดการแผนอบรม">
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">จัดการแผนการอบรม</h1>
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                สร้างหลักสูตรใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CreateCourseForm
                onSubmit={handleCreateCourse}
                onCancel={() => setIsCreateFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Tabs */}
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              จัดทีมงาน
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              ปฏิทิน
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              หลักสูตร
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="planner" className="mt-6">
            <TrainingTeamPlanner />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <TrainingCalendar />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <TrainingCourseList />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManageTrainings;
