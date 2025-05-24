
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Target,
} from "lucide-react";

interface TrainingStatsProps {
  trainings: Array<{
    status: string;
    duration: string;
    participants: number;
    capacity: number;
    rating?: number;
    teamMembers: string[];
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

  const stats = [
    {
      title: "งานที่เสร็จสิ้น",
      value: completedTrainings.length,
      subtitle: "หลักสูตร",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-100"
    },
    {
      title: "งานที่กำลังจะมา",
      value: upcomingTrainings.length,
      subtitle: "หลักสูตร",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "ชั่วโมงงานทั้งหมด",
      value: totalHours,
      subtitle: "ชั่วโมง",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100"
    },
    {
      title: "ผู้เข้าร่วมทั้งหมด",
      value: totalParticipants,
      subtitle: "คน",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100"
    },
    {
      title: "คะแนนเฉลี่ย",
      value: averageRating > 0 ? averageRating.toFixed(1) : "-",
      subtitle: "จาก 5.0",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-100"
    },
    {
      title: "อัตราการใช้ที่นั่ง",
      value: averageUtilization > 0 ? `${averageUtilization.toFixed(0)}%` : "-",
      subtitle: "เฉลี่ย",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">
                  {stat.subtitle}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-60`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrainingStats;
