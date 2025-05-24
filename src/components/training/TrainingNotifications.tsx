
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Users,
  Car,
  FileText,
  X,
  MoreHorizontal 
} from "lucide-react";

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  timestamp: string;
  courseId?: string;
  actionRequired?: boolean;
  read?: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "N001",
    type: "urgent",
    title: "ต้องมอบหมายทีมงานด่วน",
    message: "หลักสูตร 'การวิเคราะห์ข้อมูลสำหรับการตัดสินใจ' ในวันที่ 5 ก.ค. ยังไม่มีทีมงานดูแล",
    timestamp: "5 นาทีที่แล้ว",
    courseId: "C004",
    actionRequired: true,
    read: false
  },
  {
    id: "N002", 
    type: "warning",
    title: "ยานพาหนะไม่เพียงพอ",
    message: "รถตู้ 1 ถูกจองไว้แล้ว สำหรับงานวันที่ 15 มี.ค. ต้องหายานพาหนะทดแทน",
    timestamp: "1 ชั่วโมงที่แล้ว",
    courseId: "C001",
    actionRequired: true,
    read: false
  },
  {
    id: "N003",
    type: "info", 
    title: "การประเมินเสร็จสิ้น",
    message: "ได้รับผลประเมินจาก 'การพัฒนาทักษะการสื่อสาร' คะแนนเฉลี่ย 4.8/5.0",
    timestamp: "3 ชั่วโมงที่แล้ว",
    courseId: "C001",
    actionRequired: false,
    read: true
  },
  {
    id: "N004",
    type: "success",
    title: "งานอบรมสำเร็จ",
    message: "การอบรม 'การบริหารจัดการเวลา' เสร็จสิ้นเรียบร้อย ผู้เข้าร่วม 20/25 คน",
    timestamp: "1 วันที่แล้ว",
    courseId: "C002", 
    actionRequired: false,
    read: true
  },
  {
    id: "N005",
    type: "warning",
    title: "ทีมงานเกินกำลัง",
    message: "สุรชัย มานะ มีงานอบรม 8 รายการในเดือนนี้ อาจต้องปรับสมดุลภาระงาน",
    timestamp: "2 วันที่แล้ว",
    actionRequired: true,
    read: false
  }
];

const TrainingNotifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    const colors = {
      urgent: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-orange-100 text-orange-800 border-orange-200", 
      success: "bg-green-100 text-green-800 border-green-200",
      info: "bg-blue-100 text-blue-800 border-blue-200"
    };
    
    return colors[type as keyof typeof colors] || colors.info;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = showUnreadOnly 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.read).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">การแจ้งเตือน</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {unreadCount} ใหม่
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? "ทั้งหมด" : "ยังไม่อ่าน"}
            </Button>
          </div>
        </div>
        
        {urgentCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-800">
                มี {urgentCount} เรื่องเร่งด่วนที่ต้องดำเนินการ
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">ไม่มีการแจ้งเตือน</p>
                <p className="text-sm">ระบบจะแจ้งเตือนเมื่อมีเหตุการณ์สำคัญ</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800">
                            {notification.title}
                          </h4>
                          <Badge className={getNotificationBadge(notification.type)}>
                            {notification.type === 'urgent' ? 'เร่งด่วน' :
                             notification.type === 'warning' ? 'เตือน' :
                             notification.type === 'success' ? 'สำเร็จ' : 'ข้อมูล'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {notification.actionRequired && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                              ต้องดำเนินการ
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {notification.actionRequired && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          ดำเนินการ
                        </Button>
                        <Button variant="outline" size="sm">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TrainingNotifications;
