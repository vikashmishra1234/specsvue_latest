"use client";
import { fetchProducts } from "@/store/cartSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const RemoveProductFromCartButton: React.FC<any> = ({setChange, data, userId }) => {
  const cartProductId = data?.cartProductId
  const lensId = data?.lensId
  const dispatch = useDispatch<any>();
  const [loading,setLoading] = useState(false)
  const removeCartProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.delete("/api/remove-cart-item", {
        data: {
          userId,
          cartProductId,
          lensId
        },
      });
      setChange((prev:boolean)=>!prev);
      dispatch(fetchProducts(userId))
    } catch (error) {
      alert("Error while removing item");
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(()=>{
    const stock = Number(data.productId?.stock);
    if(stock<=0){
      removeCartProduct()
    }

  },[])
  return (
    <button
    disabled={loading}
      onClick={() => removeCartProduct()}
      className="px-4 py-1 cursor-pointer md:px-4 md:py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
    >
      {
        loading?"Removing...":"Remove"
      }
    </button>
  );
};

export default RemoveProductFromCartButton;
