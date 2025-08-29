import ProductsPage from "./ProductsPage";
import InnerBanner from "@/app/components/client-components/InnerBanner"

export default function Page(){
  return(
    <div>
      <InnerBanner imagePath={"/images/Product_Banner.jpg"}/>
      <ProductsPage productType={null}/>
    </div>
  )
}