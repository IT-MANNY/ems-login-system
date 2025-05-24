
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import useTeamAssignment from "@/hooks/useTeamAssignment";

const TeamWorkloadSummary = () => {
  const { courses, assignments, teamMembers } = useTeamAssignment();

  // คำนวณข้อมูลสถิติ
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthCourses = courses.filter(course => {
    const courseMonth = new Date(course.date).getMonth() + 1;
    return courseMonth === currentMonth;
  });

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => {
    const course = courses.find(c => c.id === a.courseId);
    return course && new Date(course.date) < new Date();
  }).length;

  // คำนวณภาระงานของแต่ละคน
  const memberWorkloads = teamMembers.map(member => {
    const memberAssignments = assignments.filter(a => a.members.includes(member.id));
    const thisMonthAssignments = memberAssignments.filter(a => {
      const course = courses.find(c => c.id === a.courseId);
      return course && new Date(course.date).getMonth() + 1 === currentMonth;
    });
    
    return {
      ...member,
      totalAssignments: memberAssignments.length,
      thisMonthAssignments: thisMonthAssignments.length,
      workloadPercentage: Math.min((thisMonthAssignments.length / 8) * 100, 100) // สมมติว่า 8 งาน/เดือนคือ 100%
    };
  });

  const highWorkloadMembers = memberWorkloads.filter(m => m.workloadPercentage > 80);
  const lowWorkloadMembers = memberWorkloads.filter(m => m.workloadPercentage < 30);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* สถิติรวม */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            งานเดือนนี้
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{currentMonthCourses.length}</div>
          <p className="text-xs text-blue-600">หลักสูตร</p>
          <div className="mt-2">
            <div className="text-sm text-blue-700">
              เสร็จแล้ว: {completedAssignments}/{totalAssignments}
            </div>
            <Progress 
              value={(completedAssignments / totalAssignments) * 100} 
              className="h-2 mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* ทีมงานที่มีภาระงานสูง */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            ภาระงานสูง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{highWorkloadMembers.length}</div>
          <p className="text-xs text-orange-600">คน</p>
          <div className="mt-2 space-y-1">
            {highWorkloadMembers.slice(0, 2).map(member => (
              <div key={member.id} className="text-xs text-orange-700 flex justify-between">
                <span>{member.name}</span>
                <span>{member.thisMonthAssignments} งาน</span>
              </div>
            ))}
            {highWorkloadMembers.length > 2 && (
              <div className="text-xs text-orange-600">และอีก {highWorkloadMembers.length - 2} คน</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ทีมงานที่มีภาระงานต่ำ */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
            <Users className="h-4 w-4" />
            ภาระงานต่ำ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{lowWorkloadMembers.length}</div>
          <p className="text-xs text-green-600">คน</p>
          <div className="mt-2 space-y-1">
            {lowWorkloadMembers.slice(0, 2).map(member => (
              <div key={member.id} className="text-xs text-green-700 flex justify-between">
                <span>{member.name}</span>
                <span>{member.thisMonthAssignments} งาน</span>
              </div>
            ))}
            {lowWorkloadMembers.length > 2 && (
              <div className="text-xs text-green-600">และอีก {lowWorkloadMembers.length - 2} คน</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ประสิทธิภาพทีม */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            ประสิทธิภาพ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {Math.round((completedAssignments / totalAssignments) * 100)}%
          </div>
          <p className="text-xs text-purple-600">อัตราสำเร็จ</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-purple-700">
              <span>เป้าหมาย: 95%</span>
              <Badge 
                className={`text-xs ${
                  (completedAssignments / totalAssignments) * 100 >= 95 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {(completedAssignments / totalAssignments) * 100 >= 95 ? 'บรรลุ' : 'ต้องปรับปรุง'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamWorkloadSummary;
