"use server";

import { connectToDatabase } from "@/lib/dbConnect";
import Prescription from "@/models/Prescription";

interface PresData {
  dsRE?: string;
  dsLE?: string;
  dcRE?: string;
  dcLE?: string;
  axisRE?: string;
  axisLE?: string;
  addRE?: string;
  addLE?: string;
  pdRE?: string;
  pdLE?: string;
  diaRE?: string;
  diaLE?: string;
  fhRE?: string;
  fhLE?: string;
}

export default async function AddPrescription(userId: string, prescriptionData: PresData) {
  if (!userId) {
    return { success: false, message: "User must be logged in" };
  }

  try {
    await connectToDatabase();

    const result = await Prescription.create({
      userId,
      ...prescriptionData,
    });

    return { success: true, message: "Prescription Added Successfully" };
  } catch (error) {
    console.error("Error saving prescription:", error);
    return { success: false, message: "Database error" };
  }
}
