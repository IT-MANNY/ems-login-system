
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Users as UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  
  const clearAllFilters = () => {
    onSearchChange("");
    onStatusFilterChange("all");
    onMonthFilterChange("all");
  };
  
  const hasActiveFilters = searchTerm || statusFilter !== "all" || monthFilter !== "all";
  
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== "all") count++;
    if (monthFilter !== "all") count++;
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">ตัวกรองข้อมูล</h3>
            <p className="text-sm text-gray-500">ค้นหาและกรองข้อมูลการอบรม</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {getActiveFilterCount()} ตัวกรองที่ใช้งาน
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="h-4 w-4 mr-1" />
                ล้างทั้งหมด
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Field */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="ค้นหาหลักสูตร, บริษัท, วิทยากร, หรือทีมงาน..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="md:col-span-3">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="สถานะ" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  เสร็จสิ้น
                </div>
              </SelectItem>
              <SelectItem value="upcoming">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  กำลังจะมา
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Month Filter */}
        <div className="md:col-span-3">
          <Select value={monthFilter} onValueChange={onMonthFilterChange}>
            <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="เดือน" />
              </div>
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
      
      {/* Quick Filter Badges */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">ตัวกรองที่ใช้:</span>
            {searchTerm && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                ค้นหา: "{searchTerm}"
                <button onClick={() => onSearchChange("")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                สถานะ: {statusFilter === "completed" ? "เสร็จสิ้น" : "กำลังจะมา"}
                <button onClick={() => onStatusFilterChange("all")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {monthFilter !== "all" && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                เดือน: {monthFilter}
                <button onClick={() => onMonthFilterChange("all")} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingFilters;
