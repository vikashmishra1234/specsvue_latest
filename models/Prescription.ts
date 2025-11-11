import mongoose, { Schema, models, model, InferSchemaType } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    // Personal details
    name: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: String },
    gender: { type: String },

    // Eye prescription details
    dsRE: String,
    dsLE: String,
    dcRE: String,
    dcLE: String,
    axisRE: String,
    axisLE: String,
    addRE: String,
    addLE: String,
    pdRE: String,
    pdLE: String,
    diaRE: String,
    diaLE: String,
    fhRE: String,
    fhLE: String,
  },
  { timestamps: true }
);

export type IPrescription = InferSchemaType<typeof PrescriptionSchema>;

const Prescription =
  models.Prescription || model<IPrescription>("Prescription", PrescriptionSchema);

export default Prescription;
