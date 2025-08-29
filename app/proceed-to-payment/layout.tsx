'use client';

import { ChevronRight } from "lucide-react";
import React from 'react';
import { usePathname } from 'next/navigation';

const steps = [
  { label: "Shipping Address", path: "/proceed-to-payment/address" },
  { label: "Review/Payment", path: "/proceed-to-payment/review" },
  { label: "Summary", path: "/proceed-to-payment/summary" },
];

export default function ProceedToPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap gap-4 md:gap-6 items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <li
                  className={`text-lg transition-all px-3 py-1 rounded-md ${
                    pathname === step.path
                      ? 'text-blue-600 font-semibold underline underline-offset-4'
                      : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </li>
                {index < steps.length - 1 && (
                  <ChevronRight className="text-gray-400 w-5 h-5" />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
      <div className=" px-4">{children}</div>
    </div>
  );
}
