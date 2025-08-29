import Image from "next/image";

export default function ProductBanner({imagePath,title="Products",description=`Home${typeof window !== "undefined" &&window.location.pathname}`}:{imagePath:string;title?:string;description?:string}){
    return(
         <section className="relative h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={imagePath}
          alt="An optometrist helping a customer with eyeglasses"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-gray-200">
           {description}
          </p>
        </div>
      </section>
    )
}