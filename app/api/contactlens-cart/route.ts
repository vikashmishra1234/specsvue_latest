import { connectToDatabase } from "@/lib/dbConnect";
import { ContactLensCart } from "@/models/ContactLensCart";
import { ContactLens } from "@/models/ContactLens";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { userId, rightSPH, leftSPH, boxCount, contactLensId } = await req.json();

    // Get product price from DB
    const product = await ContactLens.findById(contactLensId).select("price");
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const productPrice = product.price;

    let cart = await ContactLensCart.findOne({ userId });

    const newItem = {
      rightSPH,
      leftSPH,
      boxCount,
      product: contactLensId,
    };

    if (!cart) {
      // create new cart
      cart = await ContactLensCart.create({
        userId,
        items: [newItem],
        cartTotal: productPrice,
      });
    } else {
      // update existing cart
      cart.items.push(newItem);
      cart.cartTotal = (cart.cartTotal || 0) + productPrice;
      await cart.save();
    }

    return NextResponse.json(
      { message: "Successfully added to cart" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
