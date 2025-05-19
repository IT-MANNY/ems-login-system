
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Team, TeamAssignment } from "@/types/training";

interface TrainingTeamCardProps {
  team: Team;
  assignments: TeamAssignment[];
}

const TrainingTeamCard = ({ team, assignments }: TrainingTeamCardProps) => {
  // จัดกลุ่มการมอบหมายตามเดือน
  const assignmentsByMonth: Record<string, TeamAssignment[]> = {};
  
  assignments.forEach(assignment => {
    const month = assignment.date.substring(5, 7); // เดือนในรูปแบบ MM
    if (!assignmentsByMonth[month]) {
      assignmentsByMonth[month] = [];
    }
    assignmentsByMonth[month].push(assignment);
  });
  
  // แปลงเดือนเป็นชื่อไทย
  const getThaiMonth = (month: string) => {
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return thaiMonths[parseInt(month) - 1];
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-blue-600" />
          <div className="font-medium text-sm">{team.name}</div>
        </div>
        
        <div className="pl-6 text-xs text-gray-600">
          <div className="flex justify-between mb-1">
            <span>จำนวนสมาชิก:</span>
            <span>{team.members} คน</span>
          </div>
          <div className="flex justify-between">
            <span>หลักสูตรที่ดูแล:</span>
            <span>{assignments.length} รายการ</span>
          </div>
        </div>
        
        {Object.keys(assignmentsByMonth).length > 0 && (
          <div className="mt-3 border-t pt-2">
            <div className="text-xs font-medium text-gray-500">ตารางงาน:</div>
            <div className="mt-1 space-y-1">
              {Object.entries(assignmentsByMonth).map(([month, monthAssignments]) => (
                <div key={month} className="text-xs">
                  <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-800 border-blue-200">
                    {getThaiMonth(month)}
                  </Badge>
                  <div className="pl-2">
                    {monthAssignments.length} รายการ
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingTeamCard;
