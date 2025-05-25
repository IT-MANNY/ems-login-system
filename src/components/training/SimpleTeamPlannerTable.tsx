
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Users, Car, FileText, Plus, Trash2 } from "lucide-react";
import { Course, TeamMember, Vehicle } from "@/types/training";

interface CourseAssignment {
  id: string;
  courseId: string;
  date: string;
  members: string[];
  vehicle?: string;
  notes?: string;
}

interface SimpleTeamPlannerTableProps {
  courses: Course[];
  assignments: CourseAssignment[];
  teamMembers: TeamMember[];
  vehicles: Vehicle[];
  onCreateAssignment: (courseId: string, date: string) => string;
  onAssignMember: (assignmentId: string, memberId: string) => void;
  onRemoveMember: (assignmentId: string, memberId: string) => void;
  onAssignVehicle: (assignmentId: string, vehicleId: string | null) => void;
  onAddNotes: (assignmentId: string, notes: string) => void;
}

const SimpleTeamPlannerTable = ({
  courses,
  assignments,
  teamMembers,
  vehicles,
  onCreateAssignment,
  onAssignMember,
  onRemoveMember,
  onAssignVehicle,
  onAddNotes
}: SimpleTeamPlannerTableProps) => {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

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

  const handleOpenMemberDialog = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setMemberDialogOpen(true);
  };

  const handleOpenVehicleDialog = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setVehicleDialogOpen(true);
  };

  const handleOpenNotesDialog = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setSelectedAssignmentId(assignmentId);
    setNoteText(assignment?.notes || "");
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (selectedAssignmentId) {
      onAddNotes(selectedAssignmentId, noteText);
      setNotesDialogOpen(false);
    }
  };

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>หลักสูตรที่กำลังจะมาในเดือนนี้ ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.length > 0 ? (
              courses.map((course) => {
                const courseAssignment = assignments.find(
                  a => a.courseId === course.id && a.date === course.date
                );
                
                return (
                  <div key={`${course.id}-${course.date}`} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{course.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                              <span>{formatThaiDate(course.date)}</span>
                              <Badge variant="outline">{course.type}</Badge>
                              <span>•</span>
                              <span>{course.registered}/{course.capacity} คน</span>
                              {course.instructor && (
                                <>
                                  <span>•</span>
                                  <span>{course.instructor}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assignment Area */}
                      <div className="lg:w-96">
                        {courseAssignment ? (
                          <div className="space-y-3">
                            {/* Assigned Members */}
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-900">ทีมงาน</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenMemberDialog(courseAssignment.id)}
                                >
                                  <Users className="h-3 w-3 mr-1" />
                                  จัดการ
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {courseAssignment.members.length > 0 ? 
                                  courseAssignment.members.map(memberId => {
                                    const member = teamMembers.find(m => m.id === memberId);
                                    return member ? (
                                      <Badge key={member.id} className="bg-blue-100 text-blue-800 text-xs">
                                        {member.name}
                                      </Badge>
                                    ) : null;
                                  }) : (
                                    <span className="text-xs text-gray-500 italic">ยังไม่มีเจ้าหน้าที่</span>
                                  )}
                              </div>
                            </div>

                            {/* Vehicle and Notes */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenVehicleDialog(courseAssignment.id)}
                                className="flex-1"
                              >
                                <Car className="h-3 w-3 mr-1" />
                                {courseAssignment.vehicle ? 
                                  vehicles.find(v => v.id === courseAssignment.vehicle)?.name || 'รถ' : 
                                  'เลือกรถ'
                                }
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenNotesDialog(courseAssignment.id)}
                              >
                                <FileText className="h-3 w-3" />
                              </Button>
                            </div>

                            {courseAssignment.notes && (
                              <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-200">
                                {courseAssignment.notes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              const assignmentId = onCreateAssignment(course.id, course.date);
                              handleOpenMemberDialog(assignmentId);
                            }}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            เพิ่มทีมงาน
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">ไม่พบข้อมูลหลักสูตรในเดือนนี้</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Member Assignment Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>จัดการเจ้าหน้าที่</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {teamMembers.map(member => {
                const isAssigned = selectedAssignment?.members.includes(member.id);
                return (
                  <Button
                    key={member.id}
                    variant={isAssigned ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedAssignmentId) {
                        if (isAssigned) {
                          onRemoveMember(selectedAssignmentId, member.id);
                        } else {
                          onAssignMember(selectedAssignmentId, member.id);
                        }
                      }
                    }}
                    className="justify-start"
                  >
                    {member.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vehicle Assignment Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>เลือกรถ</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => {
                if (selectedAssignmentId) {
                  onAssignVehicle(selectedAssignmentId, null);
                  setVehicleDialogOpen(false);
                }
              }}
              className="w-full justify-start"
            >
              ไม่ใช้รถ
            </Button>
            {vehicles.map(vehicle => (
              <Button
                key={vehicle.id}
                variant={selectedAssignment?.vehicle === vehicle.id ? "default" : "outline"}
                onClick={() => {
                  if (selectedAssignmentId) {
                    onAssignVehicle(selectedAssignmentId, vehicle.id);
                    setVehicleDialogOpen(false);
                  }
                }}
                className="w-full justify-start"
              >
                <Car className="h-4 w-4 mr-2" />
                {vehicle.name} ({vehicle.capacity} คน)
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>บันทึกเพิ่มเติม</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="เพิ่มรายละเอียด เช่น ข้อควรระวัง หรือคำแนะนำเพิ่มเติม..."
              className="min-h-[100px]"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSaveNotes}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleTeamPlannerTable;
