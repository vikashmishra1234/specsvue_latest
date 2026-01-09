
import React from "react";
import RemoveProductFromCartButton from "./RemoveProductFromCartButton";
import Image from "next/image";

const ContactLensCartCard: React.FC<any> = ({ session, data, setChange }) => {
  const {
    price,
    quantity,
    productId, // This is the populated ContactLens object
    power,
    cylinder,
    axis,
    baseCurve,
    diameter,
    color,
    lensType
  } = data;

  const finalPrice = price * quantity;
  const userId = session?.user.userId || localStorage.getItem('guestId') as string;

  return (
    <div className="flex flex-row md:flex-row justify-between gap-5 p-5 rounded-2xl shadow-md bg-white w-full max-w-4xl hover:shadow-lg transition">
      {/* Product Image */}
      <div className="w-[100px] md:w-[200px] flex-shrink-0">
         <div className="aspect-square relative rounded-xl overflow-hidden border">
            <Image
            src={productId.images?.[0] || "/placeholder.jpg"}
            alt="product"
            fill
            className="object-contain"
            />
         </div>
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between w-full space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm md:text-xl font-semibold text-gray-800 capitalize">
            {productId.name}
          </h3>
          <p className="text-sm text-blue-600 font-medium">{productId.brandName} - {productId.lensType}</p>

          <div className="text-sm text-gray-600 grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
             <p>Power: <b>{power}</b></p>
             {cylinder && <p>Cyl: <b>{cylinder}</b></p>}
             {axis && <p>Axis: <b>{axis}</b></p>}
             {baseCurve && <p>BC: <b>{baseCurve}</b></p>}
             {diameter && <p>Dia: <b>{diameter}</b></p>}
             {color && <p>Color: <b>{color}</b></p>}
          </div>

          <div className="text-sm text-gray-600 space-y-1 mt-2 pt-2 border-t">
            <div className="flex justify-between">
              <span>Price per box:</span>
              <span>₹{price}</span>
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
        <div className="flex gap-3 md:pt-4 justify-between items-center">
            {productId.stock !== undefined && (
                <div className={`text-sm ${productId.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {productId.stock > 0 ? `In Stock` : "Out of Stock"}
                </div>
            )}
           <RemoveProductFromCartButton setChange={setChange} data={data} userId={userId}/>
        </div>
      </div>
    </div>
  );
};

export default ContactLensCartCard;
