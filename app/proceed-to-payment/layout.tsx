'use client';

import { ChevronRight, CheckCircle } from "lucide-react";
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

  // Helper to determine step status
  const getStepStatus = (stepPath: string) => {
    if (pathname === stepPath) return 'current';
    // Logic: Address -> Review -> Summary
    // If we are at Review, Address is completed.
    // If we are at Summary, Address and Review are completed.
    if (pathname.includes('review')) {
        if (stepPath.includes('address')) return 'completed';
    }
    if (pathname.includes('summary')) {
        if (stepPath.includes('address') || stepPath.includes('review')) return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Stepper Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
             {/* Progress Bar Background */}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
             
             {steps.map((step, index) => {
                 const status = getStepStatus(step.path);
                 const isCompleted = status === 'completed';
                 const isCurrent = status === 'current';

                 return (
                     <div key={index} className="flex flex-col items-center gap-2 bg-white px-2">
                         <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                                isCompleted ? 'bg-green-600 border-green-600 text-white' : 
                                isCurrent ? 'bg-gray-900 border-gray-900 text-white' : 
                                'bg-white border-gray-300 text-gray-400'
                            }`}
                         >
                             {isCompleted ? <CheckCircle size={16} /> : index + 1}
                         </div>
                         <span className={`text-xs md:text-sm font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                             {step.label}
                         </span>
                     </div>
                 );
             })}
          </div>
        </div>
      </div>
      
      <div className="px-4 pb-20">{children}</div>
    </div>
  );
}
