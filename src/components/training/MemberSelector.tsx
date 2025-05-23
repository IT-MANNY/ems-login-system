
import { TeamMember } from "@/types/training";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MemberSelectorProps {
  selectedMemberIds: string[];
  availableMembers: TeamMember[];
  onAddMember: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
}

const MemberSelector = ({
  selectedMemberIds,
  availableMembers,
  onAddMember,
  onRemoveMember
}: MemberSelectorProps) => {
  // กรองเฉพาะสมาชิกที่ยังไม่ถูกเลือก
  const unselectedMembers = availableMembers.filter(
    member => !selectedMemberIds.includes(member.id)
  );
  
  // หาข้อมูลสมาชิกที่ถูกเลือกไว้แล้ว
  const selectedMembers = availableMembers.filter(
    member => selectedMemberIds.includes(member.id)
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedMembers.map(member => (
          <Badge 
            key={member.id} 
            className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1"
          >
            <span>{member.name}</span>
            <button
              type="button"
              onClick={() => onRemoveMember(member.id)}
              className="ml-1 rounded-full hover:bg-blue-300 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {selectedMembers.length === 0 && (
          <p className="text-sm text-gray-500 italic">ยังไม่มีสมาชิกในทีมที่ถูกเลือก</p>
        )}
      </div>
      
      <select
        className="border rounded p-1 text-sm w-full"
        onChange={(e) => {
          if (e.target.value) {
            onAddMember(e.target.value);
            e.target.value = "";
          }
        }}
        value=""
      >
        <option value="">+ เพิ่มสมาชิกทีม</option>
        {unselectedMembers.map(member => (
          <option key={member.id} value={member.id}>
            {member.name} - {member.position}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MemberSelector;
