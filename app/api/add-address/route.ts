import { connectToDatabase } from "@/lib/dbConnect";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      pincode,
      houseNumberOrBuildingName,
      areaOrLocality,
      landmark,
      name,
      phone,
      email,
      userId,
    } = body;

    if (
      !pincode ||
      !houseNumberOrBuildingName ||
      !areaOrLocality ||
      !landmark ||
      !name ||
      !phone ||
      !email ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Please provide all the details" },
        { status: 400 }
      );
    }

    const newAddressData = {
      pincode,
      houseNumberOrBuildingName,
      areaOrLocality,
      landmark,
      name,
      phone,
      email,
    };

    const existingDoc = await Address.findOne({ userId });

    if (existingDoc) {
      existingDoc.addresses.unshift(newAddressData); // add to top
      await existingDoc.save();

      // Send only the newly added address
      const newlyAdded = existingDoc.addresses[0];
      return NextResponse.json({
        message: "Address added",
        data: newlyAdded,
      });
    } else {
      const newAddress = new Address({
        userId,
        addresses: [newAddressData],
      });
      await newAddress.save();

      return NextResponse.json({
        message: "New address document created",
        data: newAddress.addresses[0],
      });
    }
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
