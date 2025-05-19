
import Layout from "@/components/Layout";

const ManageEmployees = () => {
  return (
    <Layout title="จัดการพนักงาน">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะใช้สำหรับการเพิ่ม แก้ไข และจัดการข้อมูลพนักงาน รวมถึงการกำหนดสิทธิ์และบทบาทในระบบ</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default ManageEmployees;
