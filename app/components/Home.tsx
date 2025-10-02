"use client";
import Collections from "./Home/Collections";
import Feature from "./Home/Feature";
import Contact from "./Home/Contact";
import { useProducts } from "@/actions/fetchProducts";
import ProductsPage from "../products/ProductsPage";

const Home = () => {
  const { error } = useProducts(30, "all");
  if (error) {
    return <h2>error while fetching products</h2>;
  }
  return (
    <main>
      <div className="bg-gray-100 py-10 px-4">
        <ProductsPage productType={null} />
      </div>
      <Collections />
      <Feature />
      <Contact />
    </main>
  );
};

export default Home;
