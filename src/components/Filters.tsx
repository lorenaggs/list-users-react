import { OptionsGender } from "../models/optionsGender";
import { OptionsStatus } from "../models/optionsStatus";

interface FiltersProps {
  gender?: string;
  status?: string;
  onGenderChange: (gender: string) => void;
  onStatusChange: (status: string) => void;
}

export const Filters = ({ gender = '', status = '', onGenderChange, onStatusChange }: FiltersProps) => {

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <select
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
        className="flex-1 border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)'
        }}
      >
        <option value="">Todos los géneros</option>
        <option value={OptionsGender.hombre}>Hombre</option>
        <option value={OptionsGender.mujer}>Mujer</option>
      </select>
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="flex-1 border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        style={{
          borderColor: 'var(--border-color)',
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text-primary)'
        }}
      >
        <option value="">Todos los estados</option>
        <option value={OptionsStatus.activo}>Activo</option>
        <option value={OptionsStatus.inactivo}>Inactivo</option>
      </select>
    </div>
  );
};

