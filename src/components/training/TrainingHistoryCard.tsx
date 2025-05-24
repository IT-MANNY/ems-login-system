
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  User,
  Users,
  Clock,
  Car,
  FileText,
  Star,
  Building,
  Target,
} from "lucide-react";

interface TrainingHistoryCardProps {
  training: {
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
  };
}

const TrainingHistoryCard = ({ training }: TrainingHistoryCardProps) => {
  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", 
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">เสร็จสิ้น</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">กำลังจะมา</Badge>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? "text-yellow-400 fill-yellow-400" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{training.courseName}</CardTitle>
              {getStatusBadge(training.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-mono">{training.courseId}</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatThaiDate(training.date)}
              </div>
            </div>
          </div>
          {training.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <div className="flex items-center gap-1">
                {renderStars(training.rating)}
              </div>
              <span className="text-sm font-medium text-yellow-800 ml-1">
                {training.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">หน่วยงาน:</span>
              <span className="font-medium">{training.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">วิทยากร:</span>
              <span className="font-medium">{training.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">สถานที่:</span>
              <span className="font-medium">{training.location}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">ระยะเวลา:</span>
              <span className="font-medium">{training.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">ผู้เข้าร่วม:</span>
              <span className="font-medium">{training.participants}/{training.capacity} คน</span>
            </div>
            {training.vehicle && (
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">ยานพาหนะ:</span>
                <span className="font-medium">{training.vehicle}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Members */}
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">ทีมงานที่ดูแล</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {training.teamMembers.map((member, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {member}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes and Feedback */}
        {(training.notes || training.feedback) && (
          <div className="border-t pt-4 space-y-3">
            {training.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">บันทึกเพิ่มเติม</span>
                </div>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {training.notes}
                </p>
              </div>
            )}
            
            {training.feedback && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">ความเห็นจากผู้จัด</span>
                </div>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {training.feedback}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingHistoryCard;
