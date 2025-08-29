"use client";
import Image from "next/image";



const KidsGlasses = () => {
 

  return (
    <div className="absolute z-[100] left-0 w-full  flex justify-center gap-16 bg-white  pl-6  py-4">
        <div className="bg-gray-100 rounded-4xl w-fit p-16 flex flex-col items-center gap-5">
            <Image src={'/images/kids-2.png'} className="h-[125px] w-[125px] rounded-[50%]" height={300} width={400} alt="img"/>
            <p>Eye Glasses.</p>
        </div>
        <div className="bg-gray-100 rounded-4xl w-fit p-16 flex flex-col items-center gap-5">
            <Image src={'/images/kids-3.png'} className="h-[125px] w-[125px] rounded-[50%]" height={300} width={400} alt="img"/>
            <p>Zero Power Screen Glasses.</p>
        </div>
        <div className="bg-gray-100 rounded-4xl w-fit p-16 flex flex-col items-center gap-5">
            <Image src={'/images/kids-4.png'} className="h-[125px] w-[125px] rounded-[50%]" height={300} width={400} alt="img"/>
            <p>Sunglasses.</p>
        </div>
    </div>
  );
};

export default KidsGlasses;
