import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function DateRangePicker({ value, onChange }: { value: DateRange | undefined; onChange: (r: DateRange | undefined) => void }) {
  return <DayPicker mode="range" selected={value} onSelect={onChange} disabled={{ before: new Date() }} />;
}
