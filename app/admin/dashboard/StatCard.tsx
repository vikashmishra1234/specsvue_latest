// components/StatCard.tsx
export default function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon?: string;
  color?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start justify-between p-6 rounded-2xl shadow-sm border border-gray-200 ${color}`}
    >
      <div className="text-2xl">{icon}</div>
      <h3 className="text-sm font-medium text-gray-500 mt-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
