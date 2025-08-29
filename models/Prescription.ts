import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescription extends Document {
    userId:string;

  refrRE: string;
  refrLE: string;
  dsRE: string;
  dsLE: string;
  dcRE: string;
  dcLE: string;
  axisRE: string;
  axisLE: string;
  addRE: string;
  addLE: string;
  pdRE: string;
  pdLE: string;
  diaRE: string;
  diaLE: string;
  fhRE: string;
  fhLE: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PrescriptionSchema: Schema = new Schema(
  {
    userId:{
        type:String,
        required:true
    },
    refrRE: String,
    refrLE: String,
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

export default mongoose.models.Prescription ||
  mongoose.model<IPrescription>('Prescription', PrescriptionSchema);
