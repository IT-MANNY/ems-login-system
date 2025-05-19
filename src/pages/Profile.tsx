
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { currentUser, updatePassword } = useUser();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPasswordChange = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "รหัสผ่านไม่ตรงกัน",
        description: "รหัสผ่านใหม่และยืนยันรหัสผ่านต้องตรงกัน",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    const success = await updatePassword(data.currentPassword, data.newPassword);
    setIsSubmitting(false);
    
    if (success) {
      reset();
      setIsPasswordDialogOpen(false);
    }
  };
  
  return (
    <Layout title="ข้อมูลส่วนตัว">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="p-6 md:col-span-1 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
              {currentUser?.firstName?.charAt(0)}
              {currentUser?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-semibold mt-4">
            {currentUser?.firstName} {currentUser?.lastName}
          </h2>
          
          <p className="text-gray-500 mb-2">{currentUser?.position}</p>
          
          <div className="mt-4 space-y-2 w-full">
            <div className="text-sm">
              <span className="text-gray-500">รหัสพนักงาน:</span> 
              <span className="font-medium ml-1">{currentUser?.employeeId}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">แผนก:</span> 
              <span className="font-medium ml-1">{currentUser?.department}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">วันที่เริ่มงาน:</span> 
              <span className="font-medium ml-1">{
                new Date(currentUser?.startDate || "").toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              }</span>
            </div>
          </div>
          
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-6">
                เปลี่ยนรหัสผ่าน
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmitPasswordChange)}>
                <DialogHeader>
                  <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
                  <DialogDescription>
                    กรอกข้อมูลด้านล่างเพื่อเปลี่ยนรหัสผ่านของคุณ
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...register("currentPassword", { required: "กรุณากรอกรหัสผ่านปัจจุบัน" })}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...register("newPassword", { 
                        required: "กรุณากรอกรหัสผ่านใหม่",
                        minLength: {
                          value: 6,
                          message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"
                        }
                      })}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", { 
                        required: "กรุณายืนยันรหัสผ่านใหม่",
                        validate: (value) => value === watch("newPassword") || "รหัสผ่านไม่ตรงกัน"
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsPasswordDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
        
        {/* Profile Details Card */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-medium mb-4">รายละเอียดข้อมูลส่วนตัว</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ชื่อ</Label>
                <Input value={currentUser?.firstName} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>นามสกุล</Label>
                <Input value={currentUser?.lastName} readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={currentUser?.username} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>อีเมล</Label>
                <Input value={currentUser?.email} readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>แผนก</Label>
                <Input value={currentUser?.department} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>ตำแหน่ง</Label>
                <Input value={currentUser?.position} readOnly />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>บทบาทในระบบ</Label>
                <Input 
                  value={
                    currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                    currentUser?.role === 'manager' ? 'ผู้จัดการ' : 'พนักงาน'
                  } 
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <Label>ผู้จัดการ</Label>
                <Input 
                  value={currentUser?.managerUsername || "ไม่มีผู้จัดการ"} 
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={() => toast({ title: "ฟังก์ชันนี้ยังไม่เปิดใช้งาน", description: "ในเวอร์ชันนี้ยังไม่สามารถแก้ไขข้อมูลส่วนตัวได้" })}>
              แก้ไขข้อมูล
            </Button>
          </div>
        </Card>
        
        {/* Account Settings Card */}
        <Card className="p-6 md:col-span-3">
          <h3 className="text-lg font-medium mb-4">การตั้งค่าบัญชี</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">การแจ้งเตือนทางอีเมล</h4>
                <p className="text-sm text-gray-500">รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงสถานะคำขอ</p>
              </div>
              <Button variant="secondary" onClick={() => toast({ title: "ฟังก์ชันนี้ยังไม่เปิดใช้งาน" })}>
                ตั้งค่า
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium">ความเป็นส่วนตัว</h4>
                <p className="text-sm text-gray-500">จัดการการแสดงข้อมูลส่วนตัวของคุณ</p>
              </div>
              <Button variant="secondary" onClick={() => toast({ title: "ฟังก์ชันนี้ยังไม่เปิดใช้งาน" })}>
                ตั้งค่า
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
              <div>
                <h4 className="font-medium text-red-600">ลบบัญชี</h4>
                <p className="text-sm text-gray-500">ดำเนินการลบบัญชีของคุณออกจากระบบ</p>
              </div>
              <Button variant="destructive" onClick={() => toast({ title: "ไม่สามารถดำเนินการได้", description: "กรุณาติดต่อผู้ดูแลระบบเพื่อดำเนินการลบบัญชี" })}>
                ลบบัญชี
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
