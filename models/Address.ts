import { Schema, model, models, InferSchemaType } from "mongoose";

const AddressItemSchema = new Schema(
  {
    pincode: { type: Number, required: true },
    houseNumberOrBuildingName: { type: String, required: true },
    areaOrLocality: { type: String, required: true },
    landmark: { type: String, default: "none" },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
  },
  { _id: true }
);

const AddressSchema = new Schema(
  {
    userId: { type: String, required: true }, // reference to user

    addresses: { type: [AddressItemSchema], default: [] },
  },
  { timestamps: true }
);

export type IAddress = InferSchemaType<typeof AddressSchema>;

const Address = models.Address || model<IAddress>("Address", AddressSchema);

export default Address;
