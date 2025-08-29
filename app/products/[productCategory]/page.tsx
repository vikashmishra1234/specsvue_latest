"use client"
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import ProductsPage from '../ProductsPage';
import InnerBanner from '@/app/components/client-components/InnerBanner'
export default function Page() {

  function toCapitalCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
  const params = useParams();
  const productType = toCapitalCase(params?.productCategory as string);



  return (
   <div>
     <InnerBanner imagePath={"/images/Product_Banner.jpg"}/>
    <ProductsPage productType={productType}  />
   </div>
  );
}
