
import { useState } from "react";
import { Calendar, User, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamMember, Course } from "@/types/training";

interface TeamWorkloadOverviewProps {
  teamMembers: TeamMember[];
  courses: Course[];
  assignments: any[];
  onAssignMember: (courseId: string, date: string, memberId: string) => void;
}

const TeamWorkloadOverview = ({ 
  teamMembers, 
  courses, 
  assignments, 
  onAssignMember 
}: TeamWorkloadOverviewProps) => {
  const [selectedMonth, setSelectedMonth] = useState("06");
  
  // สร้างรายการวันที่ในเดือนที่เลือก
  const getDaysInMonth = (month: string) => {
    const year = 2025;
    const daysInMonth = new Date(year, parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    });
  };

  const days = getDaysInMonth(selectedMonth);

  // หาหลักสูตรในแต่ละวัน
  const getCoursesForDate = (date: string) => {
    return courses.filter(course => course.date === date);
  };

  // หาการมอบหมายงานของสมาชิกในแต่ละวัน
  const getMemberAssignmentsForDate = (memberId: string, date: string) => {
    return assignments.filter(assignment => 
      assignment.date === date && assignment.members.includes(memberId)
    );
  };

  // คำนวณจำนวนงานของสมาชิกในเดือน
  const getMemberWorkload = (memberId: string) => {
    const monthlyAssignments = assignments.filter(assignment => 
      assignment.date.startsWith(`2025-${selectedMonth}`) && 
      assignment.members.includes(memberId)
    );
    return monthlyAssignments.length;
  };

  // หาวันที่อาจจะขาดคน (มีหลักสูตรแต่ไม่มีคนดูแล)
  const getUnderstaffedDates = () => {
    return days.filter(date => {
      const coursesOnDate = getCoursesForDate(date);
      const assignmentsOnDate = assignments.filter(a => a.date === date);
      return coursesOnDate.length > 0 && assignmentsOnDate.length === 0;
    });
  };

  const formatThaiDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${parseInt(day)}/${parseInt(month)}`;
  };

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const understaffedDates = getUnderstaffedDates();

  return (
    <div className="space-y-6">
      {/* Header with month selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-medium">ภาพรวมทีมงาน</h2>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="06">{thaiMonths[5]} 2568</option>
            <option value="07">{thaiMonths[6]} 2568</option>
            <option value="08">{thaiMonths[7]} 2568</option>
          </select>
        </div>
      </div>

      {/* Alert for understaffed dates */}
      {understaffedDates.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">วันที่ต้องการความสนใจ:</span>
              <div className="flex gap-1">
                {understaffedDates.map(date => (
                  <Badge key={date} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    {formatThaiDate(date)}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team workload summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {teamMembers.map(member => {
          const workload = getMemberWorkload(member.id);
          const isOverloaded = workload > 10; // เกิน 10 งานต่อเดือน
          
          return (
            <Card key={member.id} className={isOverloaded ? "border-red-200 bg-red-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.position}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${isOverloaded ? 'text-red-600' : 'text-blue-600'}`}>
                      {workload}
                    </div>
                    <div className="text-xs text-gray-500">งาน/เดือน</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline view */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            ไทม์ไลน์การมอบหมายงาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {days.filter(date => getCoursesForDate(date).length > 0).map(date => {
              const coursesOnDate = getCoursesForDate(date);
              const assignmentsOnDate = assignments.filter(a => a.date === date);
              const hasAssignments = assignmentsOnDate.length > 0;
              
              return (
                <div key={date} className={`p-4 border rounded-lg ${!hasAssignments ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{formatThaiDate(date)}</div>
                      <Badge variant="outline" className="text-xs">
                        {coursesOnDate.length} หลักสูตร
                      </Badge>
                      {hasAssignments ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {hasAssignments ? `มีทีมดูแล ${assignmentsOnDate.length} งาน` : 'ยังไม่มีทีมดูแล'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {coursesOnDate.map(course => {
                      const courseAssignment = assignmentsOnDate.find(a => a.courseId === course.id);
                      
                      return (
                        <div key={course.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{course.name}</div>
                            <div className="text-xs text-gray-500">{course.location} • {course.instructor}</div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {courseAssignment ? (
                              <div className="flex gap-1">
                                {courseAssignment.members.map((memberId: string) => {
                                  const member = teamMembers.find(m => m.id === memberId);
                                  return member ? (
                                    <Badge key={member.id} variant="secondary" className="text-xs">
                                      {member.name.split(' ')[0]}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-300">
                                ต้องการทีม
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamWorkloadOverview;
