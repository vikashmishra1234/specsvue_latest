// components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 text-center min-w-[160px] hover:shadow-md transition-shadow duration-200">
      <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}