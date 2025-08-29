import { connectToDatabase } from "@/lib/dbConnect";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:Request) {
    await connectToDatabase()
    await Order.deleteMany({})
    return new NextResponse("All orders deleted successfully", {
        status: 200,})
}