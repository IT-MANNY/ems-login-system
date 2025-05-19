
import Layout from "@/components/Layout";

const ManageAttendance = () => {
  return (
    <Layout title="จัดการข้อมูลเวลา">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะใช้สำหรับการนำเข้า แก้ไข และตรวจสอบข้อมูลเวลาเข้า-ออกงานของพนักงาน</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default ManageAttendance;
