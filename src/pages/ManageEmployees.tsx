
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// ข้อมูลจำลองพนักงาน
const MOCK_EMPLOYEES = [
  {
    id: "EMP001",
    username: "user1",
    firstName: "สมชาย",
    lastName: "ใจดี",
    email: "somchai@example.com",
    phone: "081-234-5678",
    department: "การตลาด",
    position: "เจ้าหน้าที่การตลาด",
    role: "user",
    manager: "สมศรี รักงาน",
    startDate: "2023-01-15",
    active: true
  },
  {
    id: "EMP002",
    username: "manager1",
    firstName: "สมศรี",
    lastName: "รักงาน",
    email: "somsri@example.com",
    phone: "081-345-6789",
    department: "การตลาด",
    position: "ผู้จัดการการตลาด",
    role: "manager",
    manager: null,
    startDate: "2020-05-10",
    active: true
  },
  {
    id: "EMP003",
    username: "admin1",
    firstName: "สุดา",
    lastName: "บริหารดี",
    email: "suda@example.com",
    phone: "081-456-7890",
    department: "บุคคล",
    position: "ผู้ดูแลระบบ",
    role: "admin",
    manager: null,
    startDate: "2019-03-20",
    active: true
  },
  {
    id: "EMP004",
    username: "user2",
    firstName: "นิดา",
    lastName: "สร้างสรรค์",
    email: "nida@example.com",
    phone: "081-567-8901",
    department: "ไอที",
    position: "นักออกแบบ",
    role: "user",
    manager: "สุดา บริหารดี",
    startDate: "2022-08-01",
    active: false
  }
];

const ManageEmployees = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && emp.active) ||
      (statusFilter === "inactive" && !emp.active);
    
    return matchesSearch && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: "default" as const, text: "ผู้ดูแลระบบ", icon: Shield },
      manager: { variant: "secondary" as const, text: "ผู้จัดการ", icon: Users },
      user: { variant: "outline" as const, text: "พนักงาน", icon: UserCheck }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (active: boolean) => {
    return (
      <Badge variant={active ? "default" : "secondary"} className="flex items-center gap-1">
        {active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
        {active ? "ทำงาน" : "หยุด"}
      </Badge>
    );
  };

  const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleAddEmployee = () => {
    toast({
      title: "เพิ่มพนักงานสำเร็จ",
      description: "ข้อมูลพนักงานใหม่ถูกบันทึกแล้ว",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    toast({
      title: "ลบพนักงานสำเร็จ",
      description: "ข้อมูลพนักงานถูกลบออกจากระบบแล้ว",
      variant: "destructive"
    });
  };

  const handleToggleStatus = (employeeId: string, currentStatus: boolean) => {
    toast({
      title: currentStatus ? "ระงับพนักงาน" : "เปิดใช้งานพนักงาน",
      description: `สถานะพนักงานถูกเปลี่ยนเป็น${!currentStatus ? "ทำงาน" : "หยุด"}แล้ว`,
    });
  };

  return (
    <Layout title="จัดการพนักงาน">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">พนักงานทั้งหมด</p>
                  <p className="text-2xl font-bold text-blue-600">{MOCK_EMPLOYEES.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ทำงาน</p>
                  <p className="text-2xl font-bold text-green-600">
                    {MOCK_EMPLOYEES.filter(emp => emp.active).length}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">หยุดงาน</p>
                  <p className="text-2xl font-bold text-red-600">
                    {MOCK_EMPLOYEES.filter(emp => !emp.active).length}
                  </p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ผู้จัดการ</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {MOCK_EMPLOYEES.filter(emp => emp.role === 'manager').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              รายชื่อพนักงาน
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>รายชื่อพนักงาน</span>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        เพิ่มพนักงาน
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>เพิ่มพนักงานใหม่</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        <div>
                          <Label>ชื่อ</Label>
                          <Input placeholder="ชื่อจริง" />
                        </div>
                        <div>
                          <Label>นามสกุล</Label>
                          <Input placeholder="นามสกุล" />
                        </div>
                        <div>
                          <Label>อีเมล</Label>
                          <Input type="email" placeholder="email@example.com" />
                        </div>
                        <div>
                          <Label>เบอร์โทร</Label>
                          <Input placeholder="081-234-5678" />
                        </div>
                        <div>
                          <Label>แผนก</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกแผนก" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="marketing">การตลาด</SelectItem>
                              <SelectItem value="hr">บุคคล</SelectItem>
                              <SelectItem value="it">ไอที</SelectItem>
                              <SelectItem value="finance">การเงิน</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>ตำแหน่ง</Label>
                          <Input placeholder="ตำแหน่งงาน" />
                        </div>
                        <div>
                          <Label>บทบาท</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกบทบาท" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">พนักงาน</SelectItem>
                              <SelectItem value="manager">ผู้จัดการ</SelectItem>
                              <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Username</Label>
                          <Input placeholder="username" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          ยกเลิก
                        </Button>
                        <Button onClick={handleAddEmployee}>บันทึก</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ค้นหาชื่อ อีเมล แผนก..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกสถานะ</SelectItem>
                      <SelectItem value="active">ทำงาน</SelectItem>
                      <SelectItem value="inactive">หยุดงาน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัสพนักงาน</TableHead>
                        <TableHead>ชื่อ-นามสกุล</TableHead>
                        <TableHead>ติดต่อ</TableHead>
                        <TableHead>แผนก/ตำแหน่ง</TableHead>
                        <TableHead>บทบาท</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>วันเริ่มงาน</TableHead>
                        <TableHead>การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                              <div className="text-sm text-gray-500">@{employee.username}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {employee.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {employee.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.department}</div>
                              <div className="text-sm text-gray-500">{employee.position}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(employee.role)}</TableCell>
                          <TableCell>{getStatusBadge(employee.active)}</TableCell>
                          <TableCell>{formatThaiDate(employee.startDate)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleStatus(employee.id, employee.active)}
                              >
                                {employee.active ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ManageEmployees;
