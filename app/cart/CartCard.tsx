
import Image from "next/image";
import React from "react";
import RemoveProductFromCartButton from "./RemoveProductFromCartButton";

const CartCard: React.FC<any> = ({session, data,setChange }) => {
  const {
    lensName,
    price,
    quantity,
    productId,
  } = data;

  const framePrice = parseFloat(productId.price);
  const lensPrice = price - framePrice;
  const finalPrice = price * quantity;
  const userId = session?.user.userId || localStorage.getItem('guestId') as string;


  return (
    <div className="flex flex-row md:flex-row justify-between gap-5 p-5 rounded-2xl shadow-md bg-white w-full max-w-4xl hover:shadow-lg transition">
      {/* Product Image */}
      <div className="w-[100px] md:w-[200px] flex-shrink-0">
        <Image
          src={productId.images?.[0] || "/placeholder.jpg"}
          alt="product"
          height={200}
          width={200}
          className="rounded-xl object-contain w-full h-auto"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between w-full space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm md:text-xl font-semibold text-gray-800 capitalize">
            {productId.frameColor} {productId.frameMaterial} {productId.frameType}{" "}
            {productId.frameShape} {productId.collection} {productId.brandName}{" "}
            {productId.modelNumber}
          </h3>

          <p className="text-sm text-gray-500">Lens: {lensName}</p>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Frame Price:</span>
              <span>₹{framePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Lens Price:</span>
              <span>₹{lensPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
          </div>

          <div className="flex justify-between font-semibold text-gray-800 border-t pt-2 mt-2">
            <span>Final Total:</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 md:pt-4 md:justify-end">
        <RemoveProductFromCartButton setChange={setChange} data={data} userId={userId}/>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
