
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // This is just a fallback, we shouldn't see this
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">กำลังเข้าสู่ระบบ EMS</h1>
        <p className="text-xl text-gray-600">กรุณารอสักครู่...</p>
      </div>
    </div>
  );
};

export default Index;
