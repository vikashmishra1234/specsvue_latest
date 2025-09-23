"use client";

import ProductCard from "./ProductCard";
import Loading from "../components/Loading";
import { useProducts } from "@/actions/fetchProducts";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import FilterSection from "./FilterSection";

const ProductsPage:React.FC<{productType:string|null}> = ({productType}) => {
  
  const { data: allProducts, loading, filters } = useProducts(12, "all");
  const [products, setProducts] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Multi-select filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(productType?{productType:[productType]}:{});

  // Price range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const priceMin = useMemo(() => Math.min(...(allProducts || []).map((p:any) => p.price)), [allProducts]);
  const priceMax = useMemo(() => Math.max(...(allProducts || []).map((p:any) => p.price)), [allProducts]);

  // Update filtered products
  useEffect(() => {
    if (!allProducts) return;

    const filtered = allProducts.filter((item: any) => {
      // Filter by price range
      const inPriceRange = item.price >= priceRange[0] && item.price <= priceRange[1];
      if (!inPriceRange) return false;

      // Multi-select filters
      for (const key in selectedFilters) {
        const selectedValues = selectedFilters[key];
        if (selectedValues.length > 0 && !selectedValues.includes(item[key])) {
          return false;
        }
      }

      return true;
    });

    setProducts(filtered);
  }, [selectedFilters, allProducts, priceRange]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleResetFilters = () => {
    setSelectedFilters({});
    setPriceRange([priceMin, priceMax]);
  };

  const isAnyFilterSelected = useMemo(() => {
    const hasMulti = Object.values(selectedFilters).some(arr => arr.length > 0);
    const isPriceChanged = priceRange[0] !== priceMin || priceRange[1] !== priceMax;
    return hasMulti || isPriceChanged;
  }, [selectedFilters, priceRange, priceMin, priceMax]);

  if (loading || !allProducts) return <Loading />;

  return (
    <div>
      {/* Banner */}
     

      {/* Filters & Products */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-4 sm:py-12 gap-8">
        {/* Filters */}
        <aside className="lg:w-1/4 w-full">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-600 text-white px-4 py-2 rounded shadow"
            >
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          <div
            className={`space-y-6 ${
              isFilterOpen ? "block" : "hidden"
            } lg:block bg-white p-4 rounded shadow-md sticky top-10`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Apply Filters</h3>
              {isAnyFilterSelected && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-500 underline hover:text-blue-700"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block font-medium mb-1">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="w-full mb-1"
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="w-full"
              />
            </div>

            {filters?.categories?.length > 0 && (
              <FilterSection
                title="Category"
                keyName="productType"
                options={filters.categories}
                selected={selectedFilters["productType"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.frameShape?.length > 0 && (
              <FilterSection
                title="Frame Shape"
                keyName="frameShape"
                options={filters.frameShape}
                selected={selectedFilters["frameShape"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.frameColor?.length > 0 && (
              <FilterSection
                title="Frame Color"
                keyName="frameColor"
                options={filters.frameColor}
                selected={selectedFilters["frameColor"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.frameMaterial?.length > 0 && (
              <FilterSection
                title="Frame Material"
                keyName="frameMaterial"
                options={filters.frameMaterial}
                selected={selectedFilters["frameMaterial"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.frameSize?.length > 0 && (
              <FilterSection
                title="Frame Size"
                keyName="frameSize"
                options={filters.frameSize}
                selected={selectedFilters["frameSize"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.genders?.length > 0 && (
              <FilterSection
                title="Gender"
                keyName="gender"
                options={filters.genders}
                selected={selectedFilters["gender"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.weight?.length > 0 && (
              <FilterSection
                title="Weight"
                keyName="weight"
                options={filters.weight}
                selected={selectedFilters["weight"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}

            {filters?.prescriptionType?.length > 0 && (
              <FilterSection
                title="Prescription Type"
                keyName="prescriptionType"
                options={filters.prescriptionType}
                selected={selectedFilters["prescriptionType"] || []}
                onChange={handleFilterChange}
                multi
              />
            )}
          </div>
        </aside>

        {/* Products */}
        <main className="lg:w-3/4 w-full">
          {products?.length === 0 ? (
            <p className="text-center text-gray-500">No products found</p>
          ) : (
            <div className="grid gap-3 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products?.map((item: any, index: number) => (
                <ProductCard
                  key={index}
                  price={item?.price}
                  discount={item?.discount}
                  images={item?.images}
                  frameMaterial={item?.frameMaterial}
                  frameSize={item?.frameSize}
                  brandName={item?.brandName}
                  productId={item?._id}
                  
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
