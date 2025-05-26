
import { useState } from "react";
import { Users, Search, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
          <p className="text-red-700">
            การวางแผนทีมงานเฉพาะผู้จัดการขึ้นไปเท่านั้น
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

  return (
    <div className="space-y-6">
      {/* Simple Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-blue-600" />
              <span>จัดทีมงาน</span>
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
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ค้นหาหลักสูตร วิทยากร หรือบริษัท..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Planning Table */}
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
