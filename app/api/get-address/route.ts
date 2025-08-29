import { connectToDatabase } from "@/lib/dbConnect";
import Address from "@/models/Address";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    try {
        console.log("called")
        await connectToDatabase()
        const url = new URL(request.url)
        const userId = url.searchParams.get('userId');
        if(!userId){
            return NextResponse.json({message:"userId not found"},{status:404})
        }
        const address = await Address.findOne({userId});
        if(!address){
            return NextResponse.json({message:"address not found"},{status:404})
        }
        return NextResponse.json({address:address.addresses},{status:200})
    } catch (error) {
        return NextResponse.json({message:"server error"},{status:500})
        
    }
}