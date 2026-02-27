import { connectToDatabase } from "@/lib/dbConnect";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ addressId: string }> }
) {
  try {
    await connectToDatabase();
    const { addressId } = await params;
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
      !addressId ||
      !pincode ||
      !houseNumberOrBuildingName ||
      !areaOrLocality ||
      !name ||
      !phone ||
      !email ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Please provide all required details" },
        { status: 400 }
      );
    }

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      return NextResponse.json({ message: "Address not found" }, { status: 404 });
    }

    const existingAddress = addressDoc.addresses.id(addressId);
    if (!existingAddress) {
      return NextResponse.json({ message: "Address entry not found" }, { status: 404 });
    }

    existingAddress.pincode = pincode;
    existingAddress.houseNumberOrBuildingName = houseNumberOrBuildingName;
    existingAddress.areaOrLocality = areaOrLocality;
    existingAddress.landmark = landmark?.trim() || "none";
    existingAddress.name = name;
    existingAddress.phone = phone;
    existingAddress.email = email;

    await addressDoc.save();

    return NextResponse.json({
      message: "Address updated successfully",
      data: existingAddress,
    });
  } catch (error) {
    console.error("Update Address Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
