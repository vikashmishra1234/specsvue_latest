import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  paymentId: string;
  orderId: string;
  signature: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed';
  userId?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['success', 'failed'], required: true },
    userId: { type: String,required:true }, // optional: depends on your app
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
