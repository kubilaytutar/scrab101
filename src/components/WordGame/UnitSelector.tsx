import { Button } from "@/components/ui/button";
import { UNITS } from "./gameData";

interface UnitSelectorProps {
  currentUnit: keyof typeof UNITS;
  onUnitSelect: (unit: keyof typeof UNITS) => void;
}

const UnitSelector = ({ currentUnit, onUnitSelect }: UnitSelectorProps) => (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Select a Unit</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {(Object.keys(UNITS) as (keyof typeof UNITS)[]).map((unit) => (
        <Button
          key={unit}
          onClick={() => onUnitSelect(unit)}
          variant={currentUnit === unit ? "default" : "outline"}
          className="w-full"
        >
          {UNITS[unit].name}
        </Button>
      ))}
    </div>
  </div>
);

export default UnitSelector;