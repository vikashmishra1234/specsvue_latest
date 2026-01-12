import Image from "next/image";
import React from "react";
import RemoveProductFromCartButton from "./RemoveProductFromCartButton";
import { Info } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Product Image */}
      <div className="w-full sm:w-[160px] flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center justify-center">
        <Image
          src={productId.images?.[0] || "/placeholder.jpg"}
          alt="product"
          height={200}
          width={200}
          className="object-contain w-full h-auto mix-blend-multiply"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between flex-1">
        <div>
           <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 capitalize leading-tight">
                    {productId.brandName} {productId.modelNumber}
                </h3>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ml-2">
                    {productId.frameType}
                </span>
           </div>
           
           <p className="text-gray-500 text-sm mb-4 line-clamp-1">
             {productId.frameColor} • {productId.frameShape} • {productId.frameMaterial}
           </p>

           {/* Pricing Breakdown */}
           <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1.5"><Info size={14}/> Frame Base Price</span>
                    <span>₹{framePrice}</span>
                </div>
                {lensName && (
                    <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1.5"><Info size={14}/> Lens ({lensName})</span>
                        <span>+ ₹{lensPrice}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-900 font-medium pt-2 border-t border-gray-200">
                    <span>Price per unit</span>
                    <span>₹{price}</span>
                </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Qty:</span>
                    <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{quantity}</span>
                 </div>
                 <div className="text-lg font-bold text-gray-900">
                    ₹{finalPrice}
                 </div>
            </div>
            
            <div className="flex items-center gap-4">
                {productId.stock !== undefined && (
                   <span className={`text-xs font-medium ${Number(productId.stock) > 0 ? "text-green-600" : "text-red-500"}`}>
                       {Number(productId.stock) > 0 ? "In Stock" : "Out of Stock"}
                   </span>
                )}
                <RemoveProductFromCartButton setChange={setChange} data={data} userId={userId}/>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
