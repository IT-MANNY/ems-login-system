
import { useState } from "react";
import { Calendar, Users, Search, Shield, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import useTeamAssignment from "@/hooks/useTeamAssignment";
import SimpleTeamPlannerTable from "./SimpleTeamPlannerTable";

const TrainingTeamPlanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("06");
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

  const canManageTeam = hasRole(['manager', 'admin']);

  if (!canManageTeam) {
    return (
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
    );
  }

  const filterBySearch = (item: any) => {
    if (!searchTerm.trim()) return true;
    return (
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.instructor && item.instructor.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  const filteredCourses = courses
    .filter(course => {
      const courseMonth = course.date.split("-")[1];
      return courseMonth === selectedMonth && filterBySearch(course);
    });

  // สถิติสำคัญ
  const totalCourses = filteredCourses.length;
  const assignedCourses = filteredCourses.filter(course => 
    assignments.some(a => a.courseId === course.id && a.date === course.date)
  ).length;
  const unassignedCourses = totalCourses - assignedCourses;

  return (
    <div className="space-y-6">
      {/* ส่วนหัวและการค้นหา */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <span>วางแผนทีมงาน</span>
              <Badge className="bg-green-100 text-green-800 text-xs">ผู้จัดการ+</Badge>
            </div>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-3 py-1 text-sm bg-white"
            >
              <option value="06">มิถุนายน 2568</option>
              <option value="07">กรกฎาคม 2568</option>
              <option value="08">สิงหาคม 2568</option>
            </select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="ค้นหาหลักสูตร วิทยากร หรือบริษัท..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* สถิติแบบง่าย */}
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">{totalCourses}</div>
                <div className="text-gray-500">ทั้งหมด</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{assignedCourses}</div>
                <div className="text-gray-500">จัดทีมแล้ว</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600">{unassignedCourses}</div>
                <div className="text-gray-500">ยังไม่จัดทีม</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* คำแนะนำการใช้งาน */}
      {unassignedCourses > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <Info className="h-4 w-4" />
              <p className="font-medium">
                มี {unassignedCourses} หลักสูตรที่ยังไม่ได้จัดทีมงาน
              </p>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              คลิกปุ่ม "เพิ่มทีมงาน" เพื่อเริ่มจัดเจ้าหน้าที่และรถสำหรับหลักสูตร
            </p>
          </CardContent>
        </Card>
      )}

      {/* ตารางจัดการทีมงาน */}
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
    </div>
  );
};

export default TrainingTeamPlanner;
