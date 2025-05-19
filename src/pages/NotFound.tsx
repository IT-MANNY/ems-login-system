
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <div className="mb-8">
          <p className="text-2xl font-medium text-gray-800 mb-2">ไม่พบหน้าที่คุณค้นหา</p>
          <p className="text-gray-600">หน้าที่คุณพยายามเข้าถึงไม่มีอยู่ในระบบ</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(-1)}>กลับไปยังหน้าก่อนหน้า</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            กลับสู่หน้าหลัก
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
