
import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, { message: "กรุณากรอก Username" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // If user is already logged in, redirect them
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    const success = await login(values.username, values.password);
    setIsLoading(false);
    
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-ems-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">ระบบจัดการข้อมูลพนักงาน</h1>
          <p className="text-gray-600 mt-2">Employee Management System (EMS)</p>
          <p className="text-sm text-gray-500 mt-1">เวอร์ชัน 2.0</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">เข้าสู่ระบบ</CardTitle>
            <CardDescription>
              กรอก Username และ Password เพื่อเข้าสู่ระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="กรอก Username" 
                          {...field} 
                          autoComplete="username"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="กรอก Password" 
                          {...field} 
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          จดจำฉัน
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <a 
                    href="#" 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, this would navigate to a forgot password page
                      alert("กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน");
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-ems-blue hover:bg-ems-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              ต้องการความช่วยเหลือ? กรุณาติดต่อ{" "}
              <a href="mailto:it@example.com" className="text-blue-600 hover:text-blue-800">
                ฝ่ายไอที
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-yellow-800 mb-2">สำหรับการทดลองใช้:</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
            <div className="p-2 bg-white rounded border border-yellow-200">
              <p className="font-semibold">พนักงานทั่วไป</p>
              <p>Username: user1</p>
              <p>Password: password1</p>
            </div>
            <div className="p-2 bg-white rounded border border-yellow-200">
              <p className="font-semibold">ผู้จัดการ</p>
              <p>Username: manager1</p>
              <p>Password: password2</p>
            </div>
            <div className="p-2 bg-white rounded border border-yellow-200">
              <p className="font-semibold">ผู้ดูแลระบบ</p>
              <p>Username: admin1</p>
              <p>Password: password3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
