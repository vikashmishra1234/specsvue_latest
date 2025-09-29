"use client"
import Collections from "./Home/Collections"
import Feature from "./Home/Feature"
import Contact from "./Home/Contact"
import {motion} from 'framer-motion'
import {useProducts} from "@/actions/fetchProducts"
import ProductsPage from "../products/ProductsPage"


const Home = ()=>{
  const {data,error} = useProducts(30,"all");
  if(error){
    return <h2>error while fetching products</h2>
  }
  return (
    <div className="min-h-screen">
      <div className="min-h-screen  bg-gray-100 py-10 px-4">
        <ProductsPage productType={null} />
    </div>
      <Collections/>
      <Feature/>
      <Contact/>
      {/* <Footer/> */}
    </div>
  )
}

 export default Home;
