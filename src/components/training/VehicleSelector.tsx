
import { Vehicle } from "@/types/training";

interface VehicleSelectorProps {
  selectedVehicleId?: string;
  availableVehicles: Vehicle[];
  onSelectVehicle: (vehicleId: string | null) => void;
}

const VehicleSelector = ({
  selectedVehicleId,
  availableVehicles,
  onSelectVehicle
}: VehicleSelectorProps) => {
  const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">รถที่ใช้:</span>
        {selectedVehicle && (
          <button
            type="button"
            onClick={() => onSelectVehicle(null)}
            className="text-xs text-red-600 hover:text-red-800"
          >
            ไม่ใช้รถ
          </button>
        )}
      </div>
      
      <select
        className="border rounded p-1 text-sm w-full"
        value={selectedVehicleId || ""}
        onChange={(e) => onSelectVehicle(e.target.value || null)}
      >
        <option value="">ไม่ใช้รถ</option>
        {availableVehicles.map(vehicle => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.name} ({vehicle.type}, {vehicle.capacity} ที่นั่ง)
          </option>
        ))}
      </select>
    </div>
  );
};

export default VehicleSelector;
