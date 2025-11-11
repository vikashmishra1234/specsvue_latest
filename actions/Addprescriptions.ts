"use server";

import { connectToDatabase } from "@/lib/dbConnect";
import Prescription from "@/models/Prescription";


export default async function AddPrescription( prescriptionData: any) {


  try {
    await connectToDatabase();

    const newPres = new Prescription(prescriptionData);
    await newPres.save()

    return { success: true, message: "Prescription Added Successfully" };
  } catch (error:any) {
    console.error("Error saving prescription:", error);
    return { success: false, message: "Database error" };
  }
}
