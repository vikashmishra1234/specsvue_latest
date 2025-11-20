import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConnect";
import { ContactLens } from "@/models/ContactLens";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const filters: any = {};

    if (searchParams.get("brand"))
      filters.brand = searchParams.get("brand");

    if (searchParams.get("disposability"))
      filters.disposability = searchParams.get("disposability");

    if (searchParams.get("type"))
      filters.type = searchParams.get("type");

    if (searchParams.get("prescriptionType"))
      filters.prescriptionType = searchParams.get("prescriptionType");

    if (searchParams.get("color"))
      filters.color = searchParams.get("color");

    if (searchParams.get("isBestSeller") === "true")
      filters.isBestSeller = true;

    // Price range
    if (searchParams.get("min") || searchParams.get("max")) {
      filters.price = {};
      if (searchParams.get("min"))
        filters.price.$gte = Number(searchParams.get("min"));
      if (searchParams.get("max"))
        filters.price.$lte = Number(searchParams.get("max"));
    }

    const sort = searchParams.get("sort") || "-createdAt";
    const page = Number(searchParams.get("page")) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const products = await ContactLens.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await ContactLens.countDocuments(filters);

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
