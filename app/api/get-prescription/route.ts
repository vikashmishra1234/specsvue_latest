import { connectToDatabase } from "@/lib/dbConnect";
import Prescription from "@/models/Prescription";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    try {
        await connectToDatabase()
        const url = new URL(request.url)
        const data = await Prescription.find({})
        if(!data){
            return NextResponse.json({message:"prescriptions not found"},{status:404})
        }
        return NextResponse.json({prescriptions:data},{status:200})
    } catch (error) {
        return NextResponse.json({message:"server error"},{status:500})
        
    }
}