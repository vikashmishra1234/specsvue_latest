"use client";
import axios from "axios";
import React from "react";

const RemoveProductFromCartButton: React.FC<any> = ({setChange, data, userId }) => {
  console.log(data)
  const cartProductId = data?.cartProductId
  const lensId = data?.lensId
  console.log(cartProductId)
  console.log(lensId)
  const removeCartProduct = async () => {
    try {
      const res = await axios.delete("/api/remove-cart-item", {
        data: {
          userId,
          cartProductId,
          lensId
        },
      });
      alert(res.data.message);
      setChange((prev:boolean)=>!prev)
    } catch (error) {
      alert("Error while removing item");
      console.log(error);
    }
  };
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
