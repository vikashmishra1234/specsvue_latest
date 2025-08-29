import PrescriptionForm from "../components/client-components/PrescriptionForm";
import Image from "next/image";

export default async function Page() {
  return (
    <div>
      {/* --- Banner Section --- */}
      <section className="relative h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/Prescription_banner.jpg" // CHANGE: Add your banner image path here
          alt="An optometrist helping a customer with eyeglasses"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Submit Your Prescription
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Easily enter your prescription details below to order your perfect
            pair of glasses.
          </p>
        </div>
      </section>

      {/* --- Form Section --- */}
      <div className="py-16 md:py-24 bg-gray-50">
        <PrescriptionForm />
      </div>
    </div>
  );
}