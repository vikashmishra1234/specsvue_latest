import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendValue?: string;
  period?: string;
  color?: string; // e.g. "bg-blue-500" for icon background
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend = "up",
  trendValue,
  period = "vs last month",
  color = "bg-blue-600",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color.replace("bg-", "bg-opacity-10 bg-")} text-opacity-100 ${color.replace("bg-", "text-")}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {(trendValue) && (
        <div className="mt-4 flex items-center gap-2 text-xs font-medium">
          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trendValue}
          </span>
          <span className="text-gray-400 font-normal">{period}</span>
        </div>
      )}
    </div>
  );
}
