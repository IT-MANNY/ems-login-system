import { useState } from "react";
import { Calendar, Users, Car, FileText, Search, BarChart3 } from "lucide-react";
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
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useTeamAssignment from "@/hooks/useTeamAssignment";
import MemberSelector from "./MemberSelector";
import VehicleSelector from "./VehicleSelector";
import TeamWorkloadOverview from "./TeamWorkloadOverview";

const TrainingTeamPlanner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("06"); // June
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string>("");
  const [noteText, setNoteText] = useState("");
  const [activeView, setActiveView] = useState("overview");
  
  const { 
    courses, 
    assignments,
    teamMembers,
    vehicles,
    createAssignment,
    removeAssignment,
    assignMember,
    removeMember,
    assignVehicle,
    addNotes
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
  
  // กรองรายการหลักสูตรที่จะจัดในเดือนที่เลือก และตามคำค้นหา
  const filteredCourses = courses
    .filter(course => {
      const courseMonth = course.date.split("-")[1];
      return courseMonth === selectedMonth && filterBySearch(course);
    });

  // ฟังก์ชันสำหรับการจัดการสมาชิกในการมอบหมายงาน
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
  
  // ฟังก์ชันสำหรับการจัดการโน้ต
  const handleOpenNotesDialog = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setCurrentAssignmentId(assignmentId);
    setNoteText(assignment?.notes || "");
    setNotesDialogOpen(true);
  };
  
  const handleSaveNotes = () => {
    if (currentAssignmentId) {
      addNotes(currentAssignmentId, noteText);
      setNotesDialogOpen(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-medium">วางแผนเจ้าหน้าที่ประจำเดือน</h2>
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
                      <TableHead className="w-[120px]">วันที่</TableHead>
                      <TableHead className="w-[220px]">หลักสูตร</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>วิทยากร</TableHead>
                      <TableHead>บริษัท</TableHead>
                      <TableHead>สถานที่</TableHead>
                      <TableHead className="text-center">จำนวน</TableHead>
                      <TableHead className="min-w-[300px]">เจ้าหน้าที่ที่ดูแล</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map((course) => {
                        // หาการมอบหมายงานของหลักสูตรนี้
                        const courseAssignment = assignments.find(
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
                              <Badge variant="outline" className="font-normal">{course.type}</Badge>
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
                            <TableCell className="text-center">
                              {course.registered}/{course.capacity}
                            </TableCell>
                            <TableCell>
                              {courseAssignment ? (
                                <ResizablePanelGroup direction="horizontal" className="min-h-[80px]">
                                  <ResizablePanel defaultSize={75}>
                                    <div className="p-2 bg-gray-50 rounded-md shadow-sm h-full">
                                      <div className="flex flex-wrap gap-2">
                                        {courseAssignment.members.length > 0 ? 
                                          courseAssignment.members.map(memberId => {
                                            const member = teamMembers.find(m => m.id === memberId);
                                            return member ? (
                                              <Badge 
                                                key={member.id} 
                                                className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200"
                                              >
                                                {member.name}
                                              </Badge>
                                            ) : null;
                                          }) : (
                                            <p className="text-sm text-gray-500 italic">ยังไม่มีเจ้าหน้าที่ที่ถูกมอบหมาย</p>
                                          )}
                                      </div>
                                      
                                      {courseAssignment.vehicle && (
                                        <div className="mt-2">
                                          <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">
                                            <Car className="h-3 w-3 mr-1" />
                                            {vehicles.find(v => v.id === courseAssignment.vehicle)?.name || 'รถ'}
                                          </Badge>
                                        </div>
                                      )}
                                      
                                      {courseAssignment.notes && (
                                        <div className="mt-2 text-xs text-gray-600 italic bg-yellow-50 p-1 rounded">
                                          {courseAssignment.notes}
                                        </div>
                                      )}
                                    </div>
                                  </ResizablePanel>
                                  
                                  <ResizablePanel defaultSize={25}>
                                    <div className="p-2 bg-gray-50 rounded-md shadow-sm flex flex-col h-full gap-1">
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start"
                                          >
                                            <Users className="h-3.5 w-3.5 mr-1" />
                                            จัดการเจ้าหน้าที่
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72" align="end">
                                          <MemberSelector
                                            selectedMemberIds={courseAssignment.members}
                                            availableMembers={teamMembers}
                                            onAddMember={(memberId) => handleAddMember(courseAssignment.id, memberId)}
                                            onRemoveMember={(memberId) => handleRemoveMember(courseAssignment.id, memberId)}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full justify-start"
                                          >
                                            <Car className="h-3.5 w-3.5 mr-1" />
                                            จัดการรถ
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72" align="end">
                                          <VehicleSelector
                                            selectedVehicleId={courseAssignment.vehicle}
                                            availableVehicles={vehicles}
                                            onSelectVehicle={(vehicleId) => handleAssignVehicle(courseAssignment.id, vehicleId)}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start"
                                        onClick={() => handleOpenNotesDialog(courseAssignment.id)}
                                      >
                                        <FileText className="h-3.5 w-3.5 mr-1" />
                                        บันทึกเพิ่มเติม
                                      </Button>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 mt-auto"
                                        onClick={() => removeAssignment(courseAssignment.id)}
                                      >
                                        ลบการมอบหมายงาน
                                      </Button>
                                    </div>
                                  </ResizablePanel>
                                </ResizablePanelGroup>
                              ) : (
                                <div className="flex justify-between items-center">
                                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                                    ยังไม่มีเจ้าหน้าที่ดูแล
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="ml-4"
                                    onClick={() => createAssignment(course.id, course.date)}
                                  >
                                    <Users className="h-3.5 w-3.5 mr-1" />
                                    เพิ่มเจ้าหน้าที่
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                          ไม่พบข้อมูลหลักสูตรในเดือนนี้
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog สำหรับจัดการโน้ต */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>บันทึกเพิ่มเติม</DialogTitle>
            <DialogDescription>
              เพิ่มข้อมูลหรือรายละเอียดเพิ่มเติมสำหรับการมอบหมายงาน
            </DialogDescription>
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
