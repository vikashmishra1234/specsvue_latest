"use client"
import axios from "axios"
import { useEffect, useState } from "react"

export const useContactLenses = (limit: number = 20, type?: string, brand?: string) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        let querySup = `?limit=${limit}`;
        if(type) querySup += `&type=${type}`;
        if(brand) querySup += `&brand=${brand}`;

        const res = await axios.get(`/api/get-contact-lenses${querySup}`)
        if(res.data.success){
             setData(res.data.products)
        } else {
             setError(res.data.error || "Failed to fetch")
        }
      } catch (error: any) {
        setError(error.message || 'Something Went Wrong')
      }
      finally {
        setLoading(false)
      }
    }
    getData()
  }, [limit, type, brand])

  return { data, error, loading }
}

export const useContactLens = (id: string) => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
  
    useEffect(() => {
      const getData = async () => {
        if(!id) return;
        try {
          setLoading(true)
          const res = await axios.get(`/api/get-contact-lens?id=${id}`)
          if(res.data.success){
               setData(res.data.product)
          } else {
               setError(res.data.error)
          }
        } catch (error: any) {
          setError(error.message || 'Something Went Wrong')
        }
        finally {
          setLoading(false)
        }
      }
      getData()
    }, [id])
  
    return { data, error, loading }
  }
