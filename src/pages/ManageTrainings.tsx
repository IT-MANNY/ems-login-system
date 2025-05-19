
import Layout from "@/components/Layout";

const ManageTrainings = () => {
  return (
    <Layout title="จัดการแผนอบรม">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะใช้สำหรับการสร้าง แก้ไข และลบแผนการอบรมต่างๆ โดยฝ่าย HR หรือผู้ดูแลระบบ</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default ManageTrainings;
