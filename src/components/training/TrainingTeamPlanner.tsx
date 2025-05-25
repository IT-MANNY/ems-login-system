
import { useState } from "react";
import { Calendar, Users, Car, FileText, Search, BarChart3, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import useTeamAssignment from "@/hooks/useTeamAssignment";
import TeamWorkloadOverview from "./TeamWorkloadOverview";
import SimpleTeamPlannerTable from "./SimpleTeamPlannerTable";

const TrainingTeamPlanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("06"); // June
  const [activeView, setActiveView] = useState("overview");
  const { hasRole } = useUser();
  
  const { 
    courses, 
    assignments,
    teamMembers,
    vehicles,
    createAssignment,
    assignMember,
    removeMember,
    assignVehicle,
    addNotes
  } = useTeamAssignment();

  // เฉพาะผู้จัดการขึ้นไปเท่านั้นที่สามารถจัดทีมได้
  const canManageTeam = hasRole(['manager', 'admin']);

  if (!canManageTeam) {
    return (
      <div className="space-y-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-red-800 mb-2">
              ไม่มีสิทธิ์เข้าถึง
            </h2>
            <p className="text-red-700 mb-4">
              การวางแผนทีมงานเฉพาะผู้จัดการขึ้นไปเท่านั้น
            </p>
            <p className="text-sm text-red-600">
              กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การเข้าถึง
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filterBySearch = (item: any) => {
    if (!searchTerm.trim()) return true;
    return (
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.id && item.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.date && item.date.includes(searchTerm)) ||
      (item.type && item.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.instructor && item.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  // กรองรายการหลักสูตรที่จะจัดในเดือนที่เลือก และตามคำค้นหา
  const filteredCourses = courses
    .filter(course => {
      const courseMonth = course.date.split("-")[1];
      return courseMonth === selectedMonth && filterBySearch(course);
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-medium">วางแผนเจ้าหน้าที่ประจำเดือน</h2>
          <Badge className="bg-green-100 text-green-800 text-xs">ผู้จัดการ+</Badge>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 border rounded px-3 py-1 text-sm"
          >
            <option value="06">มิถุนายน 2568</option>
            <option value="07">กรกฎาคม 2568</option>
            <option value="08">สิงหาคม 2568</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="ค้นหาหลักสูตร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60"
          />
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            ภาพรวมทีมงาน
          </TabsTrigger>
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            จัดการรายละเอียด
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <TeamWorkloadOverview
            teamMembers={teamMembers}
            courses={courses}
            assignments={assignments}
            onAssignMember={(courseId, date, memberId) => {
              const assignmentId = createAssignment(courseId, date);
              assignMember(assignmentId, memberId);
            }}
          />
        </TabsContent>

        <TabsContent value="detailed" className="mt-6">
          <SimpleTeamPlannerTable
            courses={filteredCourses}
            assignments={assignments}
            teamMembers={teamMembers}
            vehicles={vehicles}
            onCreateAssignment={createAssignment}
            onAssignMember={assignMember}
            onRemoveMember={removeMember}
            onAssignVehicle={assignVehicle}
            onAddNotes={addNotes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingTeamPlanner;
