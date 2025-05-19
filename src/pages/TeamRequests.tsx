
import Layout from "@/components/Layout";

const TeamRequests = () => {
  return (
    <Layout title="คำขอของทีม">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะแสดงคำขอต่างๆ ของพนักงานในทีม เช่น คำขอ OT และคำขอลางาน ที่รอการอนุมัติ</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default TeamRequests;
