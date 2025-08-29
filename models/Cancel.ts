// models/Cancel.ts (example)
import mongoose from "mongoose";

const CancelSchema = new mongoose.Schema({
  userId: { type: String, ref: "User", required: true },
  orderId: { type: String, ref: "Order", required: true },
  item: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // ✅ add ref to enable .populate()
      required: true,
    },
    lensName: { type: String },
    lensCoating: { type: String },
    lensMaterial: { type: String },
    quantity: { type: Number },
  },
  canceledAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cancel || mongoose.model("Cancel", CancelSchema);
