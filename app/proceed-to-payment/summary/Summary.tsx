import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <h2 className="text-3xl font-semibold mb-2">Thank you for your order!</h2>
      <p className="text-gray-600 mb-6">
        We’ve received your order and will begin processing it shortly.
      </p>
      <Link href="/products">
        <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
          Keep Shopping
        </button>
      </Link>
    </div>
  );
}
