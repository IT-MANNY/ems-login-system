
import Layout from "@/components/Layout";

const LeaveRequest = () => {
  return (
    <Layout title="ขอลางาน">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 mb-4">หน้านี้จะเป็นที่สำหรับกรอกแบบฟอร์มขอลางาน โดยพนักงานสามารถเลือกประเภทการลา กรอกวันที่เริ่มลา และวันสิ้นสุดการลา พร้อมระบุเหตุผลการลา</p>
        <div className="text-center py-12">
          <p className="text-gray-400 italic">อยู่ระหว่างการพัฒนา</p>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveRequest;
