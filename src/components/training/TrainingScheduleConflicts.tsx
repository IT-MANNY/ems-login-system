
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Calendar, 
  Users, 
  Car, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle 
} from "lucide-react";

interface Conflict {
  id: string;
  type: 'team' | 'vehicle' | 'venue';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedCourses: string[];
  date: string;
  suggestions: string[];
  resolved?: boolean;
}

const MOCK_CONFLICTS: Conflict[] = [
  {
    id: "CF001",
    type: "team",
    severity: "high",
    title: "ทีมงานซ้อนทับ",
    description: "สุรชัย มานะ ถูกมอบหมายให้ดูแล 2 งานในวันเดียวกัน",
    affectedCourses: ["การวิเคราะห์ข้อมูล", "เทคโนโลยีสมัยใหม่"],
    date: "2025-06-10",
    suggestions: [
      "มอบหมายงาน 'การวิเคราะห์ข้อมูล' ให้ วิภาพร ใจดี",
      "เปลี่ยนวันที่ของงาน 'เทคโนโลยีสมัยใหม่'",
      "หาทีมงานสำรองเพิ่มเติม"
    ]
  },
  {
    id: "CF002", 
    type: "vehicle",
    severity: "medium",
    title: "ยานพาหนะไม่เพียงพอ",
    description: "รถตู้ 1 ถูกจองไว้ 2 งานในช่วงเดียวกัน",
    affectedCourses: ["การพัฒนาทักษะการสื่อสาร", "กฎหมายแรงงาน"],
    date: "2025-03-15",
    suggestions: [
      "ใช้รถตู้ 2 สำหรับงาน 'กฎหมายแรงงาน'",
      "เช่ารถเพิ่มเติมสำหรับวันดังกล่าว",
      "ปรับเปลี่ยนเวลาการเดินทาง"
    ]
  },
  {
    id: "CF003",
    type: "venue", 
    severity: "low",
    title: "สถานที่จัดงานใกล้เคียง",
    description: "มี 2 งานที่จัดในพื้นที่ใกล้เคียงกันในวันเดียวกัน อาจทำให้การจราจรติดขัด",
    affectedCourses: ["การบริหารจัดการเวลา"],
    date: "2025-04-22",
    suggestions: [
      "ประสานงานเรื่องการจราจรล่วงหน้า",
      "เตรียมเส้นทางสำรองสำหรับทีมงาน",
      "แจ้งให้ทีมงานออกเดินทางเร็วขึ้น 30 นาทีwrapped"
    ],
    resolved: true
  }
];

const TrainingScheduleConflicts = () => {
  const [conflicts, setConflicts] = useState(MOCK_CONFLICTS);
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'team':
        return <Users className="h-5 w-5 text-red-500" />;
      case 'vehicle':
        return <Car className="h-5 w-5 text-orange-500" />;
      case 'venue':
        return <MapPin className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-orange-100 text-orange-800 border-orange-200",
      low: "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    const labels = {
      high: "สูง",
      medium: "ปานกลาง", 
      low: "ต่ำ"
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {labels[severity as keyof typeof labels]}
      </Badge>
    );
  };

  const resolveConflict = (id: string) => {
    setConflicts(prev => 
      prev.map(conflict => 
        conflict.id === id ? { ...conflict, resolved: true } : conflict
      )
    );
  };

  const unresolvedConflicts = conflicts.filter(c => !c.resolved);
  const resolvedConflicts = conflicts.filter(c => c.resolved);

  const formatThaiDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle>ตรวจสอบความขัดแย้ง</CardTitle>
            {unresolvedConflicts.length > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {unresolvedConflicts.length} รายการ
              </Badge>
            )}
          </div>
        </div>
        
        {unresolvedConflicts.length === 0 ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ไม่พบความขัดแย้งในการจัดตารางงาน ระบบพร้อมใช้งาน
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              พบความขัดแย้ง {unresolvedConflicts.length} รายการที่ต้องแก้ไข
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Unresolved Conflicts */}
        {unresolvedConflicts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-red-800">ต้องแก้ไขด่วน</h4>
            {unresolvedConflicts.map((conflict) => (
              <div key={conflict.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start gap-3">
                  {getConflictIcon(conflict.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium text-gray-800">{conflict.title}</h5>
                      {getSeverityBadge(conflict.severity)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{conflict.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatThaiDate(conflict.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {conflict.affectedCourses.length} หลักสูตร
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">หลักสูตรที่ได้รับผลกระทบ:</p>
                      <div className="flex flex-wrap gap-1">
                        {conflict.affectedCourses.map((course, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">ข้อเสนอแนะ:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {conflict.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-600">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => resolveConflict(conflict.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        แก้ไขแล้ว
                      </Button>
                      <Button variant="outline" size="sm">
                        ดูรายละเอียด
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resolved Conflicts */}
        {resolvedConflicts.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">แก้ไขแล้ว</h4>
            {resolvedConflicts.map((conflict) => (
              <div key={conflict.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{conflict.title}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        แก้ไขแล้ว
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{conflict.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainingScheduleConflicts;
