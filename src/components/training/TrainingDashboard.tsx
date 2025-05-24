
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Users, Settings, Filter, Plus } from "lucide-react";
import TrainingStats from "./TrainingStats";
import TrainingFilters from "./TrainingFilters";
import QuickAssignmentPanel from "./QuickAssignmentPanel";
import TeamWorkloadSummary from "./TeamWorkloadSummary";
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
  filteredHistory: typeof trainings;
}

const TrainingDashboard = ({
  trainings,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
  filteredHistory
}: TrainingDashboardProps) => {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ภาพรวมการอบรม</h2>
          <p className="text-gray-600">จัดการและติดตามงานอบรมของทีม</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            ตัวกรองขั้นสูง
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มงานอบรม
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <TeamWorkloadSummary />

      {/* Main Dashboard */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            ภาพรวม
          </TabsTrigger>
          <TabsTrigger value="quick-assign" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            จัดทีมด่วน
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            ประวัติงาน
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            วิเคราะห์
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TrainingStats trainings={trainings} />
              
              <Card>
                <CardHeader>
                  <CardTitle>งานล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredHistory.slice(0, 3).map((training) => (
                      <div key={training.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{training.courseName}</h4>
                            <p className="text-sm text-gray-500">{training.date}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{training.teamMembers.length} คน</div>
                            <div className="text-xs text-gray-500">ทีมงาน</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <QuickAssignmentPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-assign" className="mt-6">
          <QuickAssignmentPanel />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-6">
            <TrainingFilters
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={onStatusFilterChange}
              monthFilter={monthFilter}
              onMonthFilterChange={onMonthFilterChange}
            />
            
            <div className="grid gap-4">
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
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>แนวโน้มการอบรม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  กราฟแสดงแนวโน้มการอบรม
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>ประสิทธิภาพทีม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  กราฟแสดงประสิทธิภาพทีม
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingDashboard;
