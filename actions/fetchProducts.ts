"use client"
import { IProduct } from "@/models/Product"
import axios from "axios"
import { useEffect, useState } from "react"

interface Filters{
  categories:[]
  frameColor:[]
  frameMaterial:[]
  frameShape:[]
  frameSize:[]
  genders:[]
  prescriptionType:[]
  weight:[]
}
export const useProducts = (limit:number,productCategory:string)=>{
const [data,setData] = useState<any>()
const [filters,setFilters] = useState<Filters>({
   categories:[],
  frameColor:[],
  frameMaterial:[],
  frameShape:[],
  frameSize:[],
  genders:[],
  prescriptionType:[],
  weight:[]
})
const [loading,setLoading] = useState<boolean>(false)
const [error,setError] = useState<string>('');

    useEffect(() => {
      let mounted = true;

      const getData = async () => {
        try {
          setLoading(true);
          setError("");
          const [productsRes, filtersRes] = await Promise.all([
            axios.get(`/api/get-products?limit=${limit}&category=${productCategory}`),
            axios.get('/api/get-filters')
          ]);

          if (!mounted) return;
          setData(productsRes.data.products);
          setFilters(filtersRes.data.filters);
        } catch (error) {
          if (!mounted) return;
          setError("Something went wrong while loading products.");
        } finally {
          if (mounted) setLoading(false);
        }
      };

      if (limit) {
        getData();
      }

      return () => {
        mounted = false;
      };
    }, [limit, productCategory]);

      return {data,error,loading,filters}
}


export const useAddress = (userId:string)=>{
  const [data,setData] = useState<IProduct[]>()
  const [loading,setLoading] = useState<boolean>(false)
  const [error,setError] = useState<string>('');
      useEffect(() => {
          const getData = async () => {
            try {
              setLoading(true)
              const res = await axios.get(`/api/get-address?userId=${userId}`)
              setData(res.data.address)
              return ;
            } catch (error) {
              setError('Something Went Wrong')
              return error;
            }
            finally{
              setLoading(false)
            }
          }
          userId&&getData()
        }, [userId])
        return {data,error,loading}
  }
