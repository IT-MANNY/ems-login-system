
import { useState } from "react";
import { Calendar, Users, Car } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrainingTeamCard from "@/components/training/TrainingTeamCard";
import useTeamAssignment from "@/hooks/useTeamAssignment";
import MemberSelector from "./MemberSelector";
import VehicleSelector from "./VehicleSelector";

const TrainingTeamPlanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("06"); // June
  const { 
    teams, 
    courses, 
    assignments, 
    teamMembers,
    vehicles,
    assignTeam, 
    removeAssignment,
    assignMember,
    removeMember,
    assignVehicle
  } = useTeamAssignment();

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

  // รายการทีมที่ผ่านการกรอง
  const filteredTeams = teams.filter(filterBySearch);
  
  // กรองรายการหลักสูตรที่จะจัดในเดือนที่เลือก และตามคำค้นหา
  const filteredCourses = courses
    .filter(course => {
      const courseMonth = course.date.split("-")[1];
      return courseMonth === selectedMonth && filterBySearch(course);
    });

  // ฟังก์ชันสำหรับการจัดการสมาชิกทีมในการมอบหมายงาน
  const handleAddMember = (assignmentId: string, memberId: string) => {
    assignMember(assignmentId, memberId);
  };

  const handleRemoveMember = (assignmentId: string, memberId: string) => {
    removeMember(assignmentId, memberId);
  };

  // ฟังก์ชันสำหรับการจัดการรถ
  const handleAssignVehicle = (assignmentId: string, vehicleId: string | null) => {
    assignVehicle(assignmentId, vehicleId);
  };

  return (
    <div className="space-y-6">
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px] border rounded-lg">
        {/* ส่วนแสดงทีมทั้งหมด */}
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full p-4 flex flex-col">
            <div className="mb-4">
              <Input
                placeholder="ค้นหาทีม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex-1 overflow-auto space-y-3">
              <h3 className="font-medium text-sm text-gray-500 mb-2">ทีมงานทั้งหมด</h3>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <TrainingTeamCard 
                    key={team.id} 
                    team={team} 
                    assignments={assignments.filter(a => a.teamId === team.id)}
                  />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  ไม่พบข้อมูลทีมที่ค้นหา
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* ส่วนแสดงตารางการวางแผน */}
        <ResizablePanel defaultSize={75}>
          <div className="h-full p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-medium">วางแผนทีมประจำเดือน</h2>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
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
                  className="w-48"
                />
                <Button size="sm">สร้างทีมใหม่</Button>
              </div>
            </div>
            
            <Card className="flex-1">
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">
                  หลักสูตรที่กำลังจะมาในเดือนนี้ ({filteredCourses.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>หลักสูตร</TableHead>
                        <TableHead>ประเภท</TableHead>
                        <TableHead>วิทยากร</TableHead>
                        <TableHead>บริษัท</TableHead>
                        <TableHead>สถานที่</TableHead>
                        <TableHead>จำนวน</TableHead>
                        <TableHead>ทีมที่ดูแล</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                          // หาทีมที่ถูกกำหนดให้กับหลักสูตรนี้
                          const courseAssignments = assignments.filter(
                            a => a.courseId === course.id && a.date === course.date
                          );
                          
                          return (
                            <TableRow key={`${course.id}-${course.date}`}>
                              <TableCell className="whitespace-nowrap">
                                {formatThaiDate(course.date)}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{course.name}</div>
                                  <div className="text-xs text-gray-500">{course.id}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{course.type}</Badge>
                              </TableCell>
                              <TableCell>
                                {course.instructor || "-"}
                              </TableCell>
                              <TableCell>
                                {course.company || "-"}
                              </TableCell>
                              <TableCell>
                                {course.location || "-"}
                              </TableCell>
                              <TableCell>
                                {course.registered}/{course.capacity}
                              </TableCell>
                              <TableCell>
                                {courseAssignments.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {courseAssignments.map((assignment) => {
                                      const team = teams.find(t => t.id === assignment.teamId);
                                      const assignedMembers = assignment.members || [];
                                      const hasVehicle = assignment.vehicle;
                                      
                                      return team ? (
                                        <div 
                                          key={assignment.id} 
                                          className="flex items-center justify-between gap-2 bg-blue-50 px-2 py-1 rounded-md text-sm"
                                        >
                                          <div className="flex items-center gap-1">
                                            <span className="truncate font-medium">{team.name}</span>
                                            
                                            {/* แสดงจำนวนสมาชิก */}
                                            <Badge variant="outline" className="ml-1 text-xs">
                                              <Users className="h-3 w-3 mr-0.5" />
                                              {assignedMembers.length}
                                            </Badge>
                                            
                                            {/* แสดงไอคอนรถถ้ามีการใช้รถ */}
                                            {hasVehicle && (
                                              <Badge variant="outline" className="bg-green-50 ml-1 text-xs border-green-200 text-green-700">
                                                <Car className="h-3 w-3 mr-0.5" />
                                              </Badge>
                                            )}
                                          </div>
                                          
                                          <div className="flex gap-1">
                                            {/* ปุ่ม popover สำหรับจัดการสมาชิกและรถ */}
                                            <Popover>
                                              <PopoverTrigger asChild>
                                                <Button 
                                                  variant="ghost" 
                                                  size="sm" 
                                                  className="h-6 px-1.5 text-gray-500"
                                                >
                                                  <Users className="h-3.5 w-3.5" />
                                                </Button>
                                              </PopoverTrigger>
                                              <PopoverContent 
                                                className="w-80" 
                                                align="start"
                                                side="right"
                                              >
                                                <div className="space-y-4">
                                                  <div>
                                                    <h4 className="font-medium mb-2">จัดการสมาชิกทีม {team.name}</h4>
                                                    <MemberSelector
                                                      selectedMemberIds={assignedMembers}
                                                      availableMembers={teamMembers}
                                                      onAddMember={(memberId) => handleAddMember(assignment.id, memberId)}
                                                      onRemoveMember={(memberId) => handleRemoveMember(assignment.id, memberId)}
                                                    />
                                                  </div>
                                                  
                                                  <div>
                                                    <VehicleSelector
                                                      selectedVehicleId={assignment.vehicle}
                                                      availableVehicles={vehicles}
                                                      onSelectVehicle={(vehicleId) => handleAssignVehicle(assignment.id, vehicleId)}
                                                    />
                                                  </div>
                                                </div>
                                              </PopoverContent>
                                            </Popover>
                                            
                                            <button 
                                              className="text-gray-500 hover:text-red-500 p-1"
                                              onClick={() => removeAssignment(assignment.id)}
                                            >
                                              &times;
                                            </button>
                                          </div>
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                    ไม่มีทีมดูแล
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <select 
                                  className="border rounded p-1 text-sm w-full"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      assignTeam(e.target.value, course.id, course.date);
                                      e.target.value = "";
                                    }
                                  }}
                                  defaultValue=""
                                >
                                  <option value="">+ เพิ่มทีม</option>
                                  {teams
                                    .filter(team => {
                                      // กรองทีมที่ยังไม่ได้ถูกกำหนดให้กับหลักสูตรนี้
                                      const isAssigned = courseAssignments.some(
                                        a => a.teamId === team.id
                                      );
                                      return !isAssigned;
                                    })
                                    .map(team => (
                                      <option key={team.id} value={team.id}>
                                        {team.name}
                                      </option>
                                    ))
                                  }
                                </select>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-10 text-gray-500">
                            ไม่พบข้อมูลหลักสูตรในเดือนนี้
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

// ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
const formatThaiDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const thaiMonth = thaiMonths[parseInt(month) - 1];
  const thaiYear = parseInt(year) + 543;
  
  return `${parseInt(day)} ${thaiMonth} ${thaiYear}`;
};

export default TrainingTeamPlanner;
