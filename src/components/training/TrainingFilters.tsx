
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface TrainingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  monthFilter: string;
  onMonthFilterChange: (value: string) => void;
}

const TrainingFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
}: TrainingFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium">ตัวกรองข้อมูล</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="ค้นหาหลักสูตร, บริษัท, วิทยากร, หรือทีมงาน..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="completed">เสร็จสิ้น</SelectItem>
            <SelectItem value="upcoming">กำลังจะมา</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={monthFilter} onValueChange={onMonthFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="เดือน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกเดือน</SelectItem>
            <SelectItem value="01">มกราคม 2568</SelectItem>
            <SelectItem value="02">กุมภาพันธ์ 2568</SelectItem>
            <SelectItem value="03">มีนาคม 2568</SelectItem>
            <SelectItem value="04">เมษายน 2568</SelectItem>
            <SelectItem value="05">พฤษภาคม 2568</SelectItem>
            <SelectItem value="06">มิถุนายน 2568</SelectItem>
            <SelectItem value="07">กรกฎาคม 2568</SelectItem>
            <SelectItem value="08">สิงหาคม 2568</SelectItem>
            <SelectItem value="09">กันยายน 2568</SelectItem>
            <SelectItem value="10">ตุลาคม 2568</SelectItem>
            <SelectItem value="11">พฤศจิกายน 2568</SelectItem>
            <SelectItem value="12">ธันวาคม 2568</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TrainingFilters;
