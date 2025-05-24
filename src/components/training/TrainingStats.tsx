
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface TrainingStatsProps {
  trainings: Array<{
    status: string;
    duration: string;
    participants: number;
    capacity: number;
    rating?: number;
    teamMembers: string[];
    date: string;
  }>;
}

const TrainingStats = ({ trainings }: TrainingStatsProps) => {
  // Calculate statistics
  const completedTrainings = trainings.filter(t => t.status === "completed");
  const upcomingTrainings = trainings.filter(t => t.status === "upcoming");
  
  const totalHours = completedTrainings.reduce((total, training) => {
    const hours = parseInt(training.duration.split(' ')[0]);
    return total + hours;
  }, 0);
  
  const totalParticipants = completedTrainings.reduce((total, training) => {
    return total + training.participants;
  }, 0);
  
  const averageRating = completedTrainings.length > 0 
    ? completedTrainings
        .filter(t => t.rating)
        .reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrainings.filter(t => t.rating).length
    : 0;
  
  const averageUtilization = completedTrainings.length > 0
    ? (completedTrainings.reduce((sum, t) => sum + (t.participants / t.capacity * 100), 0) / completedTrainings.length)
    : 0;

  // Get unique team members
  const uniqueMembers = new Set();
  trainings.forEach(training => {
    training.teamMembers.forEach(member => uniqueMembers.add(member));
  });

  // Calculate upcoming workload
  const upcomingThis7Days = upcomingTrainings.filter(t => {
    const trainingDate = new Date(t.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return trainingDate >= today && trainingDate <= nextWeek;
  });

  const stats = [
    {
      title: "งานที่เสร็จสิ้น",
      value: completedTrainings.length,
      subtitle: "หลักสูตร",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      trend: "+12%",
      trendUp: true,
      action: "ดูรายละเอียด"
    },
    {
      title: "งานที่กำลังจะมา",
      value: upcomingTrainings.length,
      subtitle: `ใน 7 วัน: ${upcomingThis7Days.length}`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      trend: upcomingThis7Days.length > 3 ? "ยุ่ง" : "ปกติ",
      trendUp: upcomingThis7Days.length <= 3,
      action: "วางแผน"
    },
    {
      title: "ชั่วโมงงานทั้งหมด",
      value: totalHours,
      subtitle: "ชั่วโมง",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      trend: `${Math.round(totalHours / (completedTrainings.length || 1))} ชม./งาน`,
      trendUp: true,
      action: "วิเคราะห์"
    },
    {
      title: "ผู้เข้าร่วมทั้งหมด",
      value: totalParticipants,
      subtitle: "คน",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
      trend: `${Math.round(totalParticipants / (completedTrainings.length || 1))} คน/งาน`,
      trendUp: true,
      action: "รายงาน"
    },
    {
      title: "คะแนนเฉลี่ย",
      value: averageRating > 0 ? averageRating.toFixed(1) : "-",
      subtitle: "จาก 5.0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100",
      trend: averageRating >= 4.5 ? "ดีเยี่ยม" : averageRating >= 4.0 ? "ดี" : "ปรับปรุง",
      trendUp: averageRating >= 4.0,
      action: "ปรับปรุง"
    },
    {
      title: "อัตราการใช้ที่นั่ง",
      value: averageUtilization > 0 ? `${averageUtilization.toFixed(0)}%` : "-",
      subtitle: "เฉลี่ย",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      trend: averageUtilization >= 80 ? "เต็ม" : averageUtilization >= 60 ? "ดี" : "ต่ำ",
      trendUp: averageUtilization >= 60,
      action: "เพิ่มคน"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2 hover:shadow-lg transition-shadow duration-200 group`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {stat.title}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {stat.subtitle}
                </p>
                
                {/* Trend and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.trendUp ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${stat.color} hover:bg-white/50`}
                  >
                    {stat.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrainingStats;
