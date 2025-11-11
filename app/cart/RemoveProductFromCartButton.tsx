"use client";
import axios from "axios";
import React, { useEffect } from "react";

const RemoveProductFromCartButton: React.FC<any> = ({setChange, data, userId }) => {
  const cartProductId = data?.cartProductId
  const lensId = data?.lensId
  const removeCartProduct = async () => {
    try {
      const res = await axios.delete("/api/remove-cart-item", {
        data: {
          userId,
          cartProductId,
          lensId
        },
      });
      setChange((prev:boolean)=>!prev)
    } catch (error) {
      alert("Error while removing item");
      console.log(error);
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
      onClick={() => removeCartProduct()}
      className="px-4 py-1 cursor-pointer md:px-4 md:py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
    >
      Remove
    </button>
  );
};

export default RemoveProductFromCartButton;
