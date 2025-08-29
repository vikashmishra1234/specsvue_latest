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
        const getData = async () => {
          try {
            setLoading(true)
            const res = await axios.get(`/api/get-products?limit=${limit}&category=${productCategory}`)
            setData(res.data.products)
            return ;
          } catch (error) {
            setError('Something Went Wrong')
            return error;
          }
          finally{
            setLoading(false)
          }
        }
        limit&&getData()
      }, [limit])


    // fetching filters
    useEffect(()=>{
        (async()=>{
          try {
            // setLoading(true)
            const res = await axios.get('/api/get-filters');
            setFilters(res.data.filters);
            return;
          } catch (error) {
            setError("Error While Fetching Filters")
            return error
          }
          finally{
            // setLoading(false)
          }
        })()
    },[])

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