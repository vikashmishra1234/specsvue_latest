interface Props {
  title: string;
  keyName: string;
  options: string[];
  selected: string[]; // Always array for multi-select
  onChange: (key: string, value: string) => void;
  multi?: boolean; // Optional flag if needed later
}

export default function FilterSection({
  title,
  keyName,
  options,
  selected,
  onChange,
}: Props) {
  const isActive = (value: string) => selected?.includes(value);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-800 text-base md:text-lg">{title}</h4>
      
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((item) => (
          <button
            key={item}
            onClick={() => onChange(keyName, item)}
            className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
              isActive(item)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
