
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Settings, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TrainingHistoryCard from "./TrainingHistoryCard";

interface TrainingDashboardProps {
  trainings: Array<{
    id: string;
    courseId: string;
    courseName: string;
    date: string;
    location: string;
    company: string;
    instructor: string;
    duration: string;
    participants: number;
    capacity: number;
    status: string;
    teamMembers: string[];
    vehicle?: string;
    notes?: string;
    rating?: number;
    feedback?: string;
  }>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  monthFilter: string;
  onMonthFilterChange: (value: string) => void;
  filteredHistory: Array<{
    id: string;
    courseId: string;
    courseName: string;
    date: string;
    location: string;
    company: string;
    instructor: string;
    duration: string;
    participants: number;
    capacity: number;
    status: string;
    teamMembers: string[];
    vehicle?: string;
    notes?: string;
    rating?: number;
    feedback?: string;
  }>;
}

const TrainingDashboard = ({
  filteredHistory
}: TrainingDashboardProps) => {
  const { hasRole } = useUser();
  
  const canManageTeam = hasRole(['manager', 'admin']);

  // Simple stats
  const completedCount = filteredHistory.filter(t => t.status === "completed").length;
  const upcomingCount = filteredHistory.filter(t => t.status === "upcoming").length;

  return (
    <div className="space-y-6">
      {/* Permission Notice for Non-Managers */}
      {!canManageTeam && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="h-5 w-5" />
              <p className="font-medium">สำหรับดูประวัติงานส่วนตัว</p>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              คุณสามารถดูประวัติงานอบรมของตัวเองได้ การจัดการระบบเฉพาะผู้จัดการ
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              งานที่เสร็จสิ้น
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedCount}</div>
            <p className="text-xs text-green-600">หลักสูตร</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <Users className="h-4 w-4" />
              งานที่กำลังจะมา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{upcomingCount}</div>
            <p className="text-xs text-blue-600">หลักสูตร</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Work */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>งานล่าสุด</span>
            {canManageTeam && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                จัดการระบบ
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.slice(0, 3).map((training) => (
              <div key={training.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{training.courseName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{training.date} • {training.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        training.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {training.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังจะมา'}
                      </span>
                      <span className="text-xs text-gray-500">
                        ทีม {training.teamMembers.length} คน
                      </span>
                    </div>
                  </div>
                  {training.rating && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-yellow-600">⭐ {training.rating}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">ประวัติงานทั้งหมด</h3>
        {filteredHistory.length > 0 ? (
          filteredHistory.map((training) => (
            <TrainingHistoryCard key={training.id} training={training} />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">ไม่พบข้อมูลงานอบรม</p>
            <p className="text-sm">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDashboard;
