'use client'
import Image from "next/image";
import { useEffect, useState } from "react";


export default function ProductBanner({imagePath,title="Products",description=`Home${typeof window !== "undefined" &&window.location.pathname}`}:{imagePath:string;title?:string;description?:string}){
  const [pathName,setPathName]  = useState('')
  useEffect(()=>{
    setPathName(window.location.pathname)
  },[window.location.pathname])
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
          <p className="text-sm md:text-lg text-gray-200">
           {description}
           {/* home{pathName} */}
          </p>
        </div>
      </section>
    )
}