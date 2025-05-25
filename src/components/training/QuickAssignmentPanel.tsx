
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, AlertTriangle, CheckCircle, Plus, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import useTeamAssignment from "@/hooks/useTeamAssignment";
import MemberSelector from "./MemberSelector";
import VehicleSelector from "./VehicleSelector";

const QuickAssignmentPanel = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [quickAssignOpen, setQuickAssignOpen] = useState(false);
  const { hasRole } = useUser();
  
  const { 
    courses, 
    assignments, 
    teamMembers, 
    vehicles,
    createAssignment,
    assignMember,
    assignVehicle 
  } = useTeamAssignment();

  // เฉพาะผู้จัดการขึ้นไปเท่านั้นที่สามารถจัดทีมได้
  const canManageTeam = hasRole(['manager', 'admin']);

  if (!canManageTeam) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-medium text-gray-700 mb-2">การจัดทีมงานเฉพาะผู้จัดการ</h3>
          <p className="text-sm text-gray-500">
            คุณต้องมีสิทธิ์ผู้จัดการขึ้นไปเพื่อใช้ฟีเจอร์นี้
          </p>
        </CardContent>
      </Card>
    );
  }

  // หาหลักสูตรที่ยังไม่มีการมอบหมายงาน
  const unassignedCourses = courses.filter(course => 
    !assignments.some(assignment => 
      assignment.courseId === course.id && assignment.date === course.date
    )
  );

  // หาหลักสูตรที่ขาดทีมงาน
  const understaffedCourses = courses.filter(course => {
    const assignment = assignments.find(a => 
      a.courseId === course.id && a.date === course.date
    );
    return assignment && assignment.members.length < 2;
  });

  // หาหลักสูตรที่กำลังจะมาใน 7 วันข้างหน้า
  const upcomingCourses = courses.filter(course => {
    const courseDate = new Date(course.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return courseDate >= today && courseDate <= nextWeek;
  });

  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]}`;
  };

  const handleQuickAssign = (courseId: string, date: string) => {
    const assignmentId = createAssignment(courseId, date);
    setSelectedCourseId(assignmentId);
    setQuickAssignOpen(true);
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Users className="h-5 w-5" />
          จัดการทีมงานด่วน
          <Badge className="bg-green-100 text-green-800 text-xs">ผู้จัดการ+</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unassigned" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unassigned" className="flex items-center gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              ยังไม่มีทีม ({unassignedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="understaffed" className="flex items-center gap-1 text-xs">
              <Users className="h-3 w-3" />
              ขาดทีมงาน ({understaffedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              7 วันข้างหน้า ({upcomingCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned" className="mt-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {unassignedCourses.map(course => (
                <div key={`${course.id}-${course.date}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{course.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {formatThaiDate(course.date)}
                      <span>•</span>
                      {course.participants || 0}/{course.capacity} คน
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleQuickAssign(course.id, course.date)}
                    className="bg-orange-500 hover:bg-orange-600 ml-2 shrink-0"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    จัดทีม
                  </Button>
                </div>
              ))}
              {unassignedCourses.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">ทุกหลักสูตรมีทีมงานดูแลแล้ว</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="understaffed" className="mt-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {understaffedCourses.map(course => {
                const assignment = assignments.find(a => 
                  a.courseId === course.id && a.date === course.date
                );
                return (
                  <div key={`${course.id}-${course.date}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{course.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatThaiDate(course.date)}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {assignment?.members.length || 0} คน
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedCourseId(assignment?.id || "");
                        setQuickAssignOpen(true);
                      }}
                      className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 ml-2 shrink-0"
                    >
                      เพิ่มทีม
                    </Button>
                  </div>
                );
              })}
              {understaffedCourses.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">ทุกหลักสูตรมีทีมงานเพียงพอ</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {upcomingCourses.map(course => {
                const assignment = assignments.find(a => 
                  a.courseId === course.id && a.date === course.date
                );
                return (
                  <div key={`${course.id}-${course.date}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{course.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {formatThaiDate(course.date)}
                        {assignment && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {assignment.members.length} คน
                          </Badge>
                        )}
                      </div>
                    </div>
                    {assignment ? (
                      <Badge className="bg-green-100 text-green-800 ml-2 shrink-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        พร้อม
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleQuickAssign(course.id, course.date)}
                        className="bg-blue-500 hover:bg-blue-600 ml-2 shrink-0"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        จัดทีม
                      </Button>
                    )}
                  </div>
                );
              })}
              {upcomingCourses.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">ไม่มีหลักสูตรใน 7 วันข้างหน้า</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={quickAssignOpen} onOpenChange={setQuickAssignOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>จัดการทีมงานด่วน</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedCourseId && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">เลือกเจ้าหน้าที่</h4>
                    <MemberSelector
                      selectedMemberIds={assignments.find(a => a.id === selectedCourseId)?.members || []}
                      availableMembers={teamMembers}
                      onAddMember={(memberId) => assignMember(selectedCourseId, memberId)}
                      onRemoveMember={(memberId) => {/* implement remove */}}
                    />
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">เลือกรถ</h4>
                    <VehicleSelector
                      selectedVehicleId={assignments.find(a => a.id === selectedCourseId)?.vehicle}
                      availableVehicles={vehicles}
                      onSelectVehicle={(vehicleId) => assignVehicle(selectedCourseId, vehicleId)}
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuickAssignmentPanel;
