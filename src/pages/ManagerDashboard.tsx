
import Layout from "@/components/Layout";

const ManagerDashboard = () => {
  return (
    <Layout title="แดชบอร์ดผู้จัดการ">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะแสดงภาพรวมสำหรับผู้จัดการ เช่น สถานะของคำขอ OT และการลาของพนักงานในทีม</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
