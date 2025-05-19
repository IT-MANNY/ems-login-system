
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  UserCircle, 
  Clock, 
  CalendarDays, 
  GraduationCap, 
  Users, 
  ClipboardList,
  FileText,
  LogOut, 
  ChevronDown, 
  Menu,
  X
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { currentUser, logout, hasRole } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: "หน้าหลัก", path: "/dashboard", icon: <LayoutDashboard size={18} />, roles: ["user", "manager", "admin"] },
    { title: "ข้อมูลส่วนตัว", path: "/profile", icon: <UserCircle size={18} />, roles: ["user", "manager", "admin"] },
    { title: "ขออนุมัติ OT", path: "/ot-request", icon: <Clock size={18} />, roles: ["user", "manager", "admin"] },
    { title: "ขอลางาน", path: "/leave-request", icon: <CalendarDays size={18} />, roles: ["user", "manager", "admin"] },
    { title: "ประวัติการเข้างาน", path: "/attendance", icon: <FileText size={18} />, roles: ["user", "manager", "admin"] },
    { title: "ประวัติอบรม", path: "/training", icon: <GraduationCap size={18} />, roles: ["user", "manager", "admin"] },
    { title: "แดชบอร์ดผู้จัดการ", path: "/manager-dashboard", icon: <LayoutDashboard size={18} />, roles: ["manager", "admin"] },
    { title: "คำขอของทีม", path: "/team-requests", icon: <ClipboardList size={18} />, roles: ["manager", "admin"] },
    { title: "แดชบอร์ดผู้ดูแล", path: "/admin-dashboard", icon: <LayoutDashboard size={18} />, roles: ["admin"] },
    { title: "จัดการพนักงาน", path: "/manage-employees", icon: <Users size={18} />, roles: ["admin"] },
    { title: "จัดการแผนอบรม", path: "/manage-trainings", icon: <GraduationCap size={18} />, roles: ["admin"] },
    { title: "จัดการข้อมูลเวลา", path: "/manage-attendance", icon: <Clock size={18} />, roles: ["admin"] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => hasRole(role as any))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="h-8 w-8 bg-ems-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-ems-blue">EMS</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">
                      {currentUser?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                        currentUser?.role === 'manager' ? 'ผู้จัดการ' : 'พนักงาน'}
                    </p>
                  </div>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>ข้อมูลส่วนตัว</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-14 z-50 h-[calc(100vh-3.5rem)] bg-white md:hidden">
          <div className="px-4 py-6 space-y-1">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={18} className="mr-3" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop Only */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-sm rounded-md ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
