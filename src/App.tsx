
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import OTRequest from "./pages/OTRequest";
import LeaveRequest from "./pages/LeaveRequest";
import Attendance from "./pages/Attendance";
import Training from "./pages/Training";
import ManagerDashboard from "./pages/ManagerDashboard";
import TeamRequests from "./pages/TeamRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTrainings from "./pages/ManageTrainings";
import ManageAttendance from "./pages/ManageAttendance";
import ManageEmployees from "./pages/ManageEmployees";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/ot-request" element={<ProtectedRoute><OTRequest /></ProtectedRoute>} />
            <Route path="/leave-request" element={<ProtectedRoute><LeaveRequest /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
            <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
            
            {/* Manager Routes */}
            <Route path="/manager-dashboard" element={<ProtectedRoute requiredRole="manager"><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/team-requests" element={<ProtectedRoute requiredRole="manager"><TeamRequests /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/manage-trainings" element={<ProtectedRoute requiredRole="admin"><ManageTrainings /></ProtectedRoute>} />
            <Route path="/manage-attendance" element={<ProtectedRoute requiredRole="admin"><ManageAttendance /></ProtectedRoute>} />
            <Route path="/manage-employees" element={<ProtectedRoute requiredRole="admin"><ManageEmployees /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
