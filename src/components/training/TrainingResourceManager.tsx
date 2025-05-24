
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Car, 
  MapPin, 
  Laptop, 
  Camera, 
  Mic, 
  Calendar,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: 'vehicle' | 'venue' | 'equipment';
  status: 'available' | 'booked' | 'maintenance';
  capacity?: number;
  location?: string;
  bookings: Array<{
    date: string;
    courseId: string;
    courseName: string;
    timeSlot: string;
  }>;
  nextAvailable?: string;
  utilizationRate: number;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: "V001",
    name: "รถตู้ 1",
    type: "vehicle", 
    status: "booked",
    capacity: 12,
    location: "ลานจอดรถ A",
    bookings: [
      {
        date: "2025-06-10",
        courseId: "C003",
        courseName: "เทคโนโลยีสมัยใหม่",
        timeSlot: "08:00-18:00"
      },
      {
        date: "2025-07-05", 
        courseId: "C004",
        courseName: "การวิเคราะห์ข้อมูล",
        timeSlot: "07:30-19:00"
      }
    ],
    nextAvailable: "2025-07-06",
    utilizationRate: 85
  },
  {
    id: "V002",
    name: "รถตู้ 2",
    type: "vehicle",
    status: "available", 
    capacity: 12,
    location: "ลานจอดรถ B",
    bookings: [],
    nextAvailable: "ว่าง",
    utilizationRate: 45
  },
  {
    id: "R001",
    name: "ห้องประชุมใหญ่",
    type: "venue",
    status: "available",
    capacity: 50,
    location: "อาคาร A ชั้น 2",
    bookings: [
      {
        date: "2025-03-15",
        courseId: "C001", 
        courseName: "การพัฒนาทักษะการสื่อสาร",
        timeSlot: "09:00-15:00"
      }
    ],
    nextAvailable: "ว่าง",
    utilizationRate: 70
  },
  {
    id: "R002",
    name: "ห้องอบรม 2",
    type: "venue",
    status: "booked",
    capacity: 30,
    location: "อาคาร B ชั้น 1", 
    bookings: [
      {
        date: "2025-04-22",
        courseId: "C002",
        courseName: "การบริหารจัดการเวลา", 
        timeSlot: "13:00-16:00"
      }
    ],
    nextAvailable: "2025-04-23",
    utilizationRate: 60
  },
  {
    id: "E001",
    name: "ชุดโสตทัศนูปกรณ์ A",
    type: "equipment",
    status: "available",
    location: "ห้องเก็บอุปกรณ์ 1",
    bookings: [],
    nextAvailable: "ว่าง", 
    utilizationRate: 30
  },
  {
    id: "E002", 
    name: "กล้องบันทึกวีดีโอ",
    type: "equipment",
    status: "maintenance",
    location: "ห้องเก็บอุปกรณ์ 2",
    bookings: [],
    nextAvailable: "2025-06-15",
    utilizationRate: 0
  }
];

const TrainingResourceManager = () => {
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [selectedType, setSelectedType] = useState<string>("all");

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return <Car className="h-5 w-5 text-blue-600" />;
      case 'venue':
        return <MapPin className="h-5 w-5 text-green-600" />;
      case 'equipment':
        return <Laptop className="h-5 w-5 text-purple-600" />;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200">ว่าง</Badge>;
      case 'booked':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">จองแล้ว</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">ซ่อมบำรุง</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  const filteredResources = selectedType === "all" 
    ? resources 
    : resources.filter(r => r.type === selectedType);

  const resourceStats = {
    total: resources.length,
    available: resources.filter(r => r.status === 'available').length,
    booked: resources.filter(r => r.status === 'booked').length,
    maintenance: resources.filter(r => r.status === 'maintenance').length
  };

  const formatThaiDate = (dateStr: string) => {
    if (dateStr === "ว่าง") return dateStr;
    const date = new Date(dateStr);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]}`;
  };

  return (
    <div className="space-y-6">
      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">ทรัพยากรทั้งหมด</p>
                <div className="text-2xl font-bold text-blue-900">{resourceStats.total}</div>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">พร้อมใช้งาน</p>
                <div className="text-2xl font-bold text-green-900">{resourceStats.available}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">จองแล้ว</p>
                <div className="text-2xl font-bold text-orange-900">{resourceStats.booked}</div>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">ซ่อมบำรุง</p>
                <div className="text-2xl font-bold text-red-900">{resourceStats.maintenance}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              จัดการทรัพยากร
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
              >
                ทั้งหมด
              </Button>
              <Button
                variant={selectedType === "vehicle" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("vehicle")}
              >
                ยานพาหนะ
              </Button>
              <Button
                variant={selectedType === "venue" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("venue")}
              >
                สถานที่
              </Button>
              <Button
                variant={selectedType === "equipment" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("equipment")}
              >
                อุปกรณ์
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getResourceIcon(resource.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-800">{resource.name}</h4>
                          {getStatusBadge(resource.status)}
                          <Badge variant="outline" className="text-xs">
                            {resource.id}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            {resource.capacity && (
                              <div className="flex items-center gap-1 mb-1">
                                <span>ความจุ:</span>
                                <span className="font-medium">{resource.capacity} คน</span>
                              </div>
                            )}
                            {resource.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{resource.location}</span>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3" />
                              <span>ว่างถัดไป: {formatThaiDate(resource.nextAvailable || "ไม่ทราบ")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>การใช้งาน: {resource.utilizationRate}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-500 mb-1">อัตราการใช้งาน</div>
                            <Progress value={resource.utilizationRate} className="h-2" />
                          </div>
                        </div>
                        
                        {resource.bookings.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs font-medium text-gray-700 mb-2">การจองที่จะมาถึง:</div>
                            <div className="space-y-1">
                              {resource.bookings.slice(0, 2).map((booking, index) => (
                                <div key={index} className="text-xs bg-blue-50 rounded p-2">
                                  <div className="font-medium">{booking.courseName}</div>
                                  <div className="text-gray-600">
                                    {formatThaiDate(booking.date)} • {booking.timeSlot}
                                  </div>
                                </div>
                              ))}
                              {resource.bookings.length > 2 && (
                                <div className="text-xs text-blue-600">
                                  และอีก {resource.bookings.length - 2} รายการ
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        จัดการ
                      </Button>
                      <Button variant="outline" size="sm">
                        ดูตาราง
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingResourceManager;
