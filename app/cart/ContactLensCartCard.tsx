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
    <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Product Image */}
      <div className="w-full sm:w-[160px] flex-shrink-0 bg-gray-50 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
        <Image
          src={productId.images?.[0] || "/placeholder.jpg"}
          alt="product"
          fill
          className="object-contain p-2 hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-between flex-1">
        <div>
           <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 capitalize leading-tight">
                    {productId.name}
                </h3>
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap ml-2">
                    {productId.lensType}
                </span>
           </div>
           
           <p className="text-gray-500 text-sm mb-4 font-medium">
             {productId.brandName}
           </p>

           {/* Lens Specs Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col">
                    <span className="text-gray-400">Power</span>
                    <span className="font-semibold text-gray-900">{power || 'N/A'}</span>
                </div>
                {cylinder && (
                    <div className="flex flex-col">
                        <span className="text-gray-400">Cylinder</span>
                        <span className="font-semibold text-gray-900">{cylinder}</span>
                    </div>
                )}
                {axis && (
                    <div className="flex flex-col">
                        <span className="text-gray-400">Axis</span>
                        <span className="font-semibold text-gray-900">{axis}</span>
                    </div>
                )}
                {color && (
                    <div className="flex flex-col">
                        <span className="text-gray-400">Color</span>
                        <span className="font-semibold text-gray-900">{color}</span>
                    </div>
                )}
                 {baseCurve && (
                    <div className="flex flex-col">
                        <span className="text-gray-400">Base Curve</span>
                        <span className="font-semibold text-gray-900">{baseCurve}</span>
                    </div>
                )}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Qty:</span>
                    <div className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{quantity} Box(es)</div>
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

export default ContactLensCartCard;
