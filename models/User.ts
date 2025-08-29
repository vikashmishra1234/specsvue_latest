import { Schema, models, model, InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
   email:{type:String,required:true},
   isVerified:{type:Boolean,required:true},
   name:{type:String,required:true},
   picture:{type:String,required:true},
   token:{type:String,required:true},
   userId:{type:String,required:true,unique:true}
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema>;

const User = models.User || model<IUser>('User', UserSchema);

export default User;
