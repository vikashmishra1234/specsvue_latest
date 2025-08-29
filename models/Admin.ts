import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IAdmin extends Document {
  adminId: string;
  password: string;
}

const AdminSchema: Schema<IAdmin> = new Schema({
  adminId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = models.Admin || model<IAdmin>('Admin', AdminSchema);

export default Admin;
