
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Calendar,
  Award,
  Clock,
  DollarSign 
} from "lucide-react";

interface TrainingAnalyticsProps {
  trainings: Array<{
    date: string;
    status: string;
    participants: number;
    capacity: number;
    duration: string;
    rating?: number;
    teamMembers: string[];
  }>;
}

const TrainingAnalytics = ({ trainings }: TrainingAnalyticsProps) => {
  // คำนวณข้อมูลสถิติ
  const completedTrainings = trainings.filter(t => t.status === "completed");
  
  // ข้อมูลประสิทธิภาพรายเดือน
  const monthlyData = [
    { month: "ม.ค.", completed: 3, planned: 4, efficiency: 75 },
    { month: "ก.พ.", completed: 2, planned: 3, efficiency: 67 },
    { month: "มี.ค.", completed: 4, planned: 4, efficiency: 100 },
    { month: "เม.ย.", completed: 3, planned: 5, efficiency: 60 },
    { month: "พ.ค.", completed: 5, planned: 5, efficiency: 100 },
    { month: "มิ.ย.", completed: 2, planned: 3, efficiency: 67 }
  ];

  // ข้อมูลประเภทการอบรม
  const trainingTypes = [
    { name: "ทักษะการสื่อสาร", value: 35, color: "#3B82F6" },
    { name: "เทคโนโลยี", value: 25, color: "#10B981" },
    { name: "การจัดการ", value: 20, color: "#F59E0B" },
    { name: "กฎหมาย", value: 15, color: "#EF4444" },
    { name: "อื่นๆ", value: 5, color: "#8B5CF6" }
  ];

  // ข้อมูลการใช้ทรัพยากร
  const resourceUsage = [
    { resource: "ห้องประชุม A", usage: 85, total: 20 },
    { resource: "ห้องประชุม B", usage: 70, total: 15 },
    { resource: "รถตู้ 1", usage: 90, total: 12 },
    { resource: "รถตู้ 2", usage: 60, total: 8 },
    { resource: "อุปกรณ์ AV", usage: 75, total: 10 }
  ];

  // คำนวณ KPIs
  const totalParticipants = completedTrainings.reduce((sum, t) => sum + t.participants, 0);
  const averageRating = completedTrainings.filter(t => t.rating).length > 0
    ? completedTrainings.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrainings.filter(t => t.rating).length
    : 0;
  const utilization = completedTrainings.length > 0
    ? (completedTrainings.reduce((sum, t) => sum + (t.participants / t.capacity * 100), 0) / completedTrainings.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">อัตราสำเร็จ</p>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round((completedTrainings.length / trainings.length) * 100)}%
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+5% จากเดือนที่แล้ว</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">ผู้เข้าร่วมรวม</p>
                <div className="text-2xl font-bold text-green-900">{totalParticipants}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12% จากเดือนที่แล้ว</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">คะแนนเฉลี่ย</p>
                <div className="text-2xl font-bold text-yellow-900">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">จาก 5.0 คะแนน</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">การใช้ที่นั่ง</p>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round(utilization)}%
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {utilization >= 80 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${utilization >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                    {utilization >= 80 ? 'ใช้งานเต็มที่' : 'ยังมีที่ว่าง'}
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-600" />
              ประสิทธิภาพรายเดือน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === 'completed' ? 'เสร็จสิ้น' : name === 'planned' ? 'วางแผน' : 'ประสิทธิภาพ (%)'
                  ]}
                />
                <Bar dataKey="completed" fill="#3B82F6" name="completed" />
                <Bar dataKey="planned" fill="#93C5FD" name="planned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              ประเภทการอบรม
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trainingTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {trainingTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'สัดส่วน']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            การใช้ทรัพยากร
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resourceUsage.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.resource}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.total} ครั้ง</span>
                    <Badge 
                      className={
                        item.usage >= 80 ? "bg-red-100 text-red-800" :
                        item.usage >= 60 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }
                    >
                      {item.usage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={item.usage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingAnalytics;
