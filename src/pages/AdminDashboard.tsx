
import Layout from "@/components/Layout";

const AdminDashboard = () => {
  return (
    <Layout title="แดชบอร์ดผู้ดูแลระบบ">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะแสดงภาพรวมสำหรับผู้ดูแลระบบ เช่น สถิติพนักงาน จำนวนคำขอที่รออนุมัติ และเมนูลัดไปยังการจัดการต่างๆ</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
